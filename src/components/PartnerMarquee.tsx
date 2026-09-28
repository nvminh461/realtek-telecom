import type { Partner } from '@/payload-types'
import { resolveImage } from '@/lib/media'

import { LogoCarousel, type CarouselLogo } from './LogoCarousel'

/** Partner logos as a swipeable, self-scrolling carousel; `reverse` runs it the other way. */
export function PartnerMarquee({ partners, reverse = false }: { partners: Partner[]; reverse?: boolean }) {
  const logos: CarouselLogo[] = partners.flatMap((p) => {
    const logo = resolveImage(p.logo, undefined, p.name)
    return logo
      ? [
          {
            id: String(p.id),
            name: p.name,
            url: p.url,
            src: logo.url,
            width: logo.width,
            height: logo.height,
            unoptimized: logo.mimeType === 'image/svg+xml',
          },
        ]
      : []
  })
  if (!logos.length) return null
  return <LogoCarousel logos={logos} reverse={reverse} />
}
