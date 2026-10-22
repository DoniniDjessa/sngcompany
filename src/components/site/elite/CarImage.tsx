"use client"
import Image, { type ImageLoader, type ImageProps } from "next/image"

// The fleet photos are straight from the phones (up to 18 MB): Next's optimizer gives up on them,
// so they are resized by Supabase Storage itself (/render/image) at the width the browser needs.
const supabaseLoader: ImageLoader = ({ src, width, quality }) =>
  `${src.replace("/storage/v1/object/public/", "/storage/v1/render/image/public/")}?width=${Math.min(width, 2500)}&quality=${quality ?? 70}`

export default function CarImage(props: ImageProps) {
  const fromStorage = typeof props.src === "string" && props.src.includes("/storage/v1/object/public/")
  // eslint-disable-next-line jsx-a11y/alt-text -- alt comes with the props
  return <Image {...props} loader={fromStorage ? supabaseLoader : undefined} />
}
