import type { Partner } from '@/payload-types'
import { resolveImage } from '@/lib/media'

import { LogoCarousel, type CarouselLogo } from './LogoCarousel'

/** Logos of the partners that have one, ready for the client-side carousel or grid. */
export function partnerLogos(partners: Partner[]): CarouselLogo[] {
  return partners.flatMap((p) => {
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
}

/** Partner logos as a swipeable, self-scrolling carousel; `reverse` runs it the other way. */
export function PartnerMarquee({ partners, reverse = false }: { partners: Partner[]; reverse?: boolean }) {
  const logos = partnerLogos(partners)
  if (!logos.length) return null
  return <LogoCarousel logos={logos} reverse={reverse} />
}
