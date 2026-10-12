import type { MetadataRoute } from 'next'

import { getSiteUrl } from '@/lib/origin'

// Points at the sitemap of the domain being visited.
export const dynamic = 'force-dynamic'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = await getSiteUrl()
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/', '/next/', '/*/download$', '/*?q=*'],
    },
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  }
}
