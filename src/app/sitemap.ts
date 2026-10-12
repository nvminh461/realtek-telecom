import type { MetadataRoute } from 'next'

import { listPublishedSlugs } from '@/lib/data'
import { languageAlternates } from '@/lib/metadata'
import { getSiteUrl } from '@/lib/origin'
import { absoluteUrl } from '@/lib/site'

// Built per request for the domain being visited (data comes from the cached reads in lib/data), so `next build`
// never queries the database.
export const dynamic = 'force-dynamic'

const staticPaths = ['/', '/about', '/services', '/projects', '/news', '/documents', '/contact']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await getSiteUrl()
  const entry = (path: string, lastModified?: string, priority = 0.7): MetadataRoute.Sitemap[number] => ({
    url: absoluteUrl(path, 'vi', origin),
    lastModified: lastModified ? new Date(lastModified) : new Date(),
    priority,
    alternates: { languages: languageAlternates(path, origin) },
  })

  const [services, projects, posts, documents] = await Promise.all([
    listPublishedSlugs('services'),
    listPublishedSlugs('projects'),
    listPublishedSlugs('posts'),
    listPublishedSlugs('documents'),
  ])

  return [
    ...staticPaths.map((p) => entry(p, undefined, p === '/' ? 1 : 0.8)),
    ...services.map((d) => entry(`/services/${d.slug}`, d.updatedAt, 0.8)),
    ...projects.map((d) => entry(`/projects/${d.slug}`, d.updatedAt)),
    ...posts.map((d) => entry(`/news/${d.slug}`, d.updatedAt, 0.6)),
    ...documents.map((d) => entry(`/documents/${d.slug}`, d.updatedAt, 0.6)),
  ]
}
