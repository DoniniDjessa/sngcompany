import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

// Cloudflare R2 (bucket R2_BUCKET). Files never go through our server: the browser PUTs to a signed URL.
//   photos/…     vehicle, equipment and farm photos — readable by anyone (shown on the site)
//   documents/…  contracts, IDs, invoices — staff only

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID!, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY! },
})
const Bucket = process.env.R2_BUCKET!

const IMAGES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
export const FOLDERS = {
  photos: { types: IMAGES, maxBytes: 8 * 1024 * 1024 },
  documents: {
    types: [
      ...IMAGES,
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
    maxBytes: 15 * 1024 * 1024,
  },
} as const
export type Folder = keyof typeof FOLDERS

export const isPublicKey = (key: string) => key.startsWith("photos/") && !key.includes("..")
export const isValidKey = (key: string) => /^(photos|documents)\/[\w./-]+$/.test(key) && !key.includes("..")

export function buildKey(folder: Folder, filename: string) {
  const clean = filename.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w.-]+/g, "-").slice(-80)
  return `${folder}/${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}-${clean}`
}

export const signUpload = (key: string, contentType: string, size: number) =>
  getSignedUrl(s3, new PutObjectCommand({ Bucket, Key: key, ContentType: contentType, ContentLength: size }), { expiresIn: 300 })

export const signDownload = (key: string, downloadName?: string) =>
  getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket, Key: key, ResponseContentDisposition: downloadName ? `attachment; filename="${downloadName}"` : undefined }),
    { expiresIn: 300 },
  )

export const deleteObject = (key: string) => s3.send(new DeleteObjectCommand({ Bucket, Key: key }))
