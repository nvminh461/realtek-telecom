import { defineRouting } from 'next-intl/routing'

export const locales = ['vi', 'en', 'zh'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'vi'

/**
 * BCP 47 tags for `<html lang>`, hreflang and the like. The URL/locale code stays `zh`, but the Chinese
 * content is Traditional Chinese (Taiwan usage), so browsers pick Traditional glyph shapes and fonts.
 */
export const htmlLang: Record<Locale, string> = { vi: 'vi', en: 'en', zh: 'zh-Hant' }

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  localeDetection: false,
})

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}
