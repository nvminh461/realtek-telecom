import type { SiteSetting } from '@/payload-types'

export type StaticLogo = { src: string; width: number; height: number }

/** Official "RealTek · Informatics Telecom" logo (trimmed, transparent PNG), used by every locale. */
export const realtekLogo: StaticLogo = { src: '/brand/realtek-logo.png', width: 426, height: 80 }
/** White version of the same logo, for dark backgrounds (transparent header over the hero, footer). */
export const realtekLogoLight: StaticLogo = { src: '/brand/realtek-logo-white.png', width: 491, height: 99 }

type LogoSettings = Pick<SiteSetting, 'logo' | 'logoLight'>

/** Props for `<Logo>` on a light or dark background: the uploaded logo when set, otherwise the built-in file. */
export function logoFor(settings: LogoSettings, tone: 'dark' | 'light') {
  return tone === 'light'
    ? { logo: settings.logoLight, image: realtekLogoLight }
    : { logo: settings.logo, image: realtekLogo }
}
