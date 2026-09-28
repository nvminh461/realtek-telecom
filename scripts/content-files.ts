/**
 * Image files behind src/demo/content.ts, shared by scripts/seed.ts and scripts/update-content.ts:
 * Unsplash photos are downloaded, local photos and partner logos are read from public/.
 */
import { readFileSync } from 'fs'
import path from 'path'

import * as content from '../src/demo/content'

export type ImageFile = { name: string; data: () => Promise<Buffer>; mimetype: string }

const publicFile = (src: string) => readFileSync(path.join(process.cwd(), 'public', src))
const mimeOf = (name: string) => (name.endsWith('.png') ? 'image/png' : 'image/jpeg')

async function fetchUnsplash(id: string) {
  const res = await fetch(`https://images.unsplash.com/photo-${id}?w=2400&q=80&fm=jpg&fit=max`)
  if (!res.ok) throw new Error(`Không tải được ảnh ${id}: ${res.status}`)
  return Buffer.from(await res.arrayBuffer())
}

/** Upload file of a `photo()` key; the name is also how update-content recognises an existing upload. */
export function photoFile(key: content.PhotoKey): ImageFile {
  if (content.isLocalPhoto(key)) {
    const { src } = content.localPhotos[key]
    const name = path.basename(src)
    return { name, mimetype: mimeOf(name), data: async () => publicFile(src) }
  }
  return { name: `${key}.jpg`, mimetype: 'image/jpeg', data: () => fetchUnsplash(content.photos[key]) }
}

/** Upload file of a partner logo (PNG in public/content/partners). */
export function partnerLogoFile(entry: content.PartnerEntry): ImageFile {
  const { src, filename } = content.partnerInfo(entry)
  return { name: `partner-${filename}`, mimetype: mimeOf(filename), data: async () => publicFile(src) }
}
