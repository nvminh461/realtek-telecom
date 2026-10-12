import { headers } from 'next/headers'

import { siteUrl } from './site'

const localHost = /^(localhost|\d+\.\d+\.\d+\.\d+)(:\d+)?$/

/**
 * Origin of the domain being visited, so every domain pointed at the site serves it as-is: canonical URLs, hreflang,
 * Open Graph and the sitemap follow that domain. Reads request headers, so callers render per request.
 */
export async function getSiteUrl(): Promise<string> {
  const h = await headers()
  const host = (h.get('x-forwarded-host') ?? h.get('host') ?? '').split(',')[0].trim().toLowerCase()
  if (!/^[a-z0-9.-]+(:\d+)?$/.test(host)) return siteUrl
  // TLS usually ends at Cloudflare or a reverse proxy, so the forwarded scheme is unreliable: public domains are https.
  return `${localHost.test(host) ? 'http' : 'https'}://${host}`
}
