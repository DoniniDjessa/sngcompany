// Allows browsers to PUT files straight into the R2 bucket (presigned URLs) from these origins.
// Usage: node --env-file=.env.local scripts/r2-cors.mjs [https://www.mon-domaine.ci ...]
import { GetBucketCorsCommand, PutBucketCorsCommand, S3Client } from "@aws-sdk/client-s3"

const env = process.env
const origins = [...new Set(["http://localhost:3000", ...process.argv.slice(2)].map((o) => o.replace(/\/$/, "")))]
const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: env.R2_ACCESS_KEY_ID, secretAccessKey: env.R2_SECRET_ACCESS_KEY },
})

await s3.send(new PutBucketCorsCommand({
  Bucket: env.R2_BUCKET,
  CORSConfiguration: { CORSRules: [{ AllowedOrigins: origins, AllowedMethods: ["GET", "PUT", "HEAD"], AllowedHeaders: ["content-type"], MaxAgeSeconds: 3600 }] },
}))
const { CORSRules } = await s3.send(new GetBucketCorsCommand({ Bucket: env.R2_BUCKET }))
console.log(`CORS du bucket ${env.R2_BUCKET} :`, JSON.stringify(CORSRules[0].AllowedOrigins))
