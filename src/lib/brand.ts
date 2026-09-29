import type { SiteSetting } from '@/payload-types'

export type StaticLogo = { src: string; width: number; height: number }

/** Official "RealTek · Informatics Telecom" logo (trimmed, transparent PNG), used by every locale. */
export const realtekLogo: StaticLogo = { src: '/brand/realtek-logo.png', width: 426, height: 80 }
/**
 * Props for `<Logo>`: the uploaded logo when set, otherwise the built-in file. The logo is always the red one on a
 * transparent background, never a white version and never on a plate, even over the dark hero and in the footer.
 */
export function logoFor(settings: Pick<SiteSetting, 'logo'>) {
  return { logo: settings.logo, image: realtekLogo }
}
