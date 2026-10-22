import Image from "next/image"
import { imgSrc } from "@/lib/content"

// Image coming from the site content: a static file (optimised by next/image) or a photo
// uploaded from the backoffice to R2 (served through a signed redirect, so a plain <img>).
export default function CmsImage({ src, alt, sizes = "100vw", priority, className }: {
  src: string
  alt: string
  sizes?: string
  priority?: boolean
  className?: string
}) {
  const url = imgSrc(src)
  if (!url) return null
  if (url.startsWith("/api/")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- signed R2 redirect
      <img src={url} alt={alt} className={className} loading={priority ? "eager" : "lazy"} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
    )
  }
  return <Image src={url} alt={alt} fill sizes={sizes} priority={priority} className={className} />
}
