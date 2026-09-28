import Image from 'next/image'

import type { StaticLogo } from '@/lib/brand'
import { resolveImage } from '@/lib/media'

type Props = {
  logo?: unknown
  /** Built-in logo file used when no logo is uploaded; sized by height, keeping its ratio. */
  image: StaticLogo
  className?: string
  name?: string
}

/** Uploaded logo when configured, otherwise the built-in RealTek logo. */
export function Logo({ logo, image, className = '', name = 'Realtek Telecom' }: Props) {
  const uploaded = resolveImage(logo)
  const src = uploaded ? { src: uploaded.url, width: uploaded.width, height: uploaded.height } : image
  return (
    <Image
      src={src.src}
      width={src.width}
      height={src.height}
      alt={name}
      priority
      unoptimized={uploaded?.mimeType === 'image/svg+xml'}
      className={`block h-8 w-auto max-w-[200px] object-contain object-left sm:h-9 sm:max-w-[240px] ${className}`}
    />
  )
}
