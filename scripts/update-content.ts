/**
 * Non-destructive update of the database from src/demo/content.ts (unlike `npm run seed:force`, nothing is wiped):
 *
 *   npm run update-content            # upsert content; lists everything in the database missing from content.ts
 *   npm run update-content:prune      # …and deletes them (same as `-- --prune`, which PowerShell drops)
 *
 * - services, projects: upserted by slug (all locales, published); post/document categories: upserted by slug.
 * - partners: upserted by name (logo, website, order).
 * - certificates: upserted by Vietnamese title (image, orientation, order, all locales).
 * - globals site-settings, home-page, about-page: updated in every locale; fields content.ts doesn't set
 *   (logos, notification emails, CRM link…) are left as they are.
 * - sliders: existing slides only get their texts (eyebrow, heading, text, button label) updated, by position;
 *   their images, videos and links are never touched. A slider whose placement doesn't exist yet is created.
 * - media: a photo or logo is uploaded only when no media item has that file name yet, or the same name with the
 *   `-1`, `-2`… suffix Payload adds when a name is taken (see scripts/content-files.ts).
 * - posts, documents: upserted by slug (all locales, published). An existing post keeps its publish date unless
 *   content.ts gives a fixed `date`; an existing document keeps its publish date and its real download count.
 */
import 'dotenv/config'
import { getPayload, type Payload } from 'payload'

import * as content from '../src/demo/content'
import { escapeRegex } from '../src/lib/text'
import config from '../src/payload.config'
import { partnerLogoFile, photoFile, type ImageFile } from './content-files'
import { revalidateSite } from './revalidate'

if (!process.env.DATABASE_URI) {
  console.error('Cần khai báo DATABASE_URI trong .env để cập nhật dữ liệu.')
  process.exit(1)
}

const prune = process.argv.includes('--prune')
// A fresh object per call: the cloud-storage plugin keeps the incoming file in req.context (see scripts/seed.ts).
const ctx = () => ({ disableRevalidate: true })
const translations = ['en', 'zh'] as const
const payload: Payload = await getPayload({ config })

/* ---------- helpers ---------- */

type Row = { id?: string | null }

/** Same as in scripts/seed.ts: reuse saved array-row ids so a locale's update doesn't drop the other locales. */
function withRowIds(data: unknown, saved: unknown): unknown {
  if (Array.isArray(data) && Array.isArray(saved)) {
    return data.map((row, i) => {
      const savedRow = saved[i] as Row | undefined
      if (!row || typeof row !== 'object' || !savedRow?.id) return row
      return { ...(withRowIds(row, savedRow) as object), id: savedRow.id }
    })
  }
  if (data && typeof data === 'object' && saved && typeof saved === 'object' && !Array.isArray(data)) {
    return Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, withRowIds(v, (saved as Record<string, unknown>)[k])]),
    )
  }
  return data
}

/** Every `photo()` key referenced anywhere in a value. */
function photoKeysIn(value: unknown, found = new Set<content.PhotoKey>()) {
  if (Array.isArray(value)) value.forEach((v) => photoKeysIn(v, found))
  else if (value && typeof value === 'object') {
    if ('$photo' in value) found.add((value as content.PhotoRef).$photo)
    else Object.values(value).forEach((v) => photoKeysIn(v, found))
  }
  return found
}

const stats = { uploaded: 0, reused: 0 }

/** `earth.jpg` also matches `earth-1.jpg`, `earth-2.jpg`…: Payload renames an upload whose name is already taken. */
const sameFile = (name: string) => {
  const dot = name.lastIndexOf('.')
  return new RegExp(`^${escapeRegex(name.slice(0, dot))}(-\\d+)?${escapeRegex(name.slice(dot))}$`)
}

/** Media id of a file, uploading it only when no media item has that file name. */
async function ensureMedia(file: ImageFile, alt: content.L) {
  const pattern = sameFile(file.name)
  const candidates = await payload.find({
    collection: 'media',
    where: { filename: { contains: file.name.slice(0, file.name.lastIndexOf('.')) } },
    sort: 'createdAt',
    pagination: false,
    depth: 0,
    overrideAccess: true,
  })
  // The oldest match, so every run reuses the same upload.
  const existing = candidates.docs.find((m) => m.filename && pattern.test(m.filename))
  if (existing) {
    stats.reused++
    return existing.id
  }
  const data = await file.data()
  const media = await payload.create({
    collection: 'media',
    locale: 'vi',
    data: { alt: alt.vi },
    file: { data, mimetype: file.mimetype, name: file.name, size: data.length },
    context: ctx(),
  })
  for (const locale of translations) {
    await payload.update({ collection: 'media', id: media.id, locale, data: { alt: alt[locale] }, context: ctx() })
  }
  stats.uploaded++
  return media.id
}

const mediaIds = {} as Record<content.PhotoKey, string>
const localize = (value: unknown, locale: content.Loc) => content.localize(value, locale, (key) => mediaIds[key])

type SlugCollection = 'services' | 'projects' | 'posts' | 'documents' | 'post-categories' | 'document-categories'

async function findBy(collection: SlugCollection | 'partners' | 'sliders', field: string, value: string) {
  const res = await payload.find({
    collection,
    where: { [field]: { equals: value } },
    limit: 1,
    depth: 0,
    draft: false,
    overrideAccess: true,
  })
  return res.docs[0] as unknown as (Record<string, unknown> & { id: string }) | undefined
}

/** Creates or updates the document with this slug, Vietnamese first, then the translations (reusing row ids). */
async function upsertBySlug(collection: SlugCollection, data: { slug: string }, publish: boolean) {
  const status = publish ? { _status: 'published' as const } : {}
  const existing = await findBy(collection, 'slug', data.slug)
  const vi = { ...(localize(data, 'vi') as object), ...status }
  const saved = existing
    ? await payload.update({
        collection,
        id: existing.id,
        locale: 'vi',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: withRowIds(vi, existing) as any,
        depth: 0,
        context: ctx(),
      })
    : // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await payload.create({ collection, locale: 'vi', data: vi as any, depth: 0, context: ctx() })
  for (const locale of translations) {
    await payload.update({
      collection,
      id: saved.id,
      locale,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: { ...(withRowIds(localize(data, locale), saved) as object), ...status } as any,
      depth: 0,
      context: ctx(),
    })
  }
  return existing ? 'updated' : 'created'
}

async function setGlobal(slug: 'site-settings' | 'home-page' | 'about-page', data: object) {
  const current = await payload.findGlobal({ slug, locale: 'vi', depth: 0, overrideAccess: true })
  const saved = await payload.updateGlobal({
    slug,
    locale: 'vi',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: withRowIds(localize(data, 'vi'), current) as any,
    depth: 0,
    context: ctx(),
  })
  for (const locale of translations) {
    await payload.updateGlobal({
      slug,
      locale,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: withRowIds(localize(data, locale), saved) as any,
      depth: 0,
      context: ctx(),
    })
  }
}

/** Deletes (with --prune) or lists the documents whose key is not in `keep`. */
async function pruneMissing(
  collection:
    | 'services'
    | 'projects'
    | 'posts'
    | 'documents'
    | 'partners'
    | 'certificates'
    | 'post-categories'
    | 'document-categories',
  field: 'slug' | 'name' | 'title',
  keep: string[],
) {
  const all = await payload.find({ collection, limit: 0, pagination: false, depth: 0, overrideAccess: true })
  const keyOf = (doc: unknown) => String((doc as Record<string, unknown>)[field])
  const stale = all.docs.filter((d) => !keep.includes(keyOf(d)))
  for (const doc of stale) {
    const key = keyOf(doc)
    if (prune) {
      await payload.delete({ collection, id: doc.id, context: ctx() })
      console.log(`  Đã xoá ${collection}: ${key}`)
    } else {
      console.log(`  Không còn trong content.ts (${collection}): ${key}`)
    }
  }
  return stale.length
}

/* ---------- media ---------- */

console.log('Ảnh…')
const referenced = photoKeysIn([
  content.services,
  content.projects,
  content.posts,
  content.documents,
  content.certificates,
  content.sliders,
  content.siteSettings,
  content.homePage,
  content.aboutPage,
])
// Local photos are all uploaded so editors can pick them in the admin; Unsplash photos only when referenced.
for (const key of new Set([...referenced, ...(Object.keys(content.localPhotos) as content.PhotoKey[])])) {
  mediaIds[key] = await ensureMedia(photoFile(key), content.photoAlts[key])
}
console.log(`  mới tải lên: ${stats.uploaded}, đã có sẵn: ${stats.reused}`)

/* ---------- categories ---------- */

for (const [i, c] of content.postCategories.entries()) {
  await upsertBySlug('post-categories', { slug: c.slug, title: c.title, order: i + 1 } as { slug: string }, false)
}
for (const [i, c] of content.documentCategories.entries()) {
  await upsertBySlug('document-categories', { slug: c.slug, title: c.title, order: i + 1 } as { slug: string }, false)
}
console.log('Danh mục: xong')

/* ---------- services & projects ---------- */

for (const collection of ['services', 'projects'] as const) {
  const items = content[collection] as { slug: string }[]
  const result = { created: 0, updated: 0 }
  for (const item of items) result[await upsertBySlug(collection, item, true)]++
  console.log(`${collection}: thêm ${result.created}, cập nhật ${result.updated}`)
  await pruneMissing(
    collection,
    'slug',
    items.map((d) => d.slug),
  )
}

/* ---------- posts & documents ---------- */

const isoDaysAgo = (days: number) => new Date(Date.now() - days * 24 * 3600 * 1000).toISOString()
const categoryId = async (collection: 'post-categories' | 'document-categories', slug: string) =>
  (await findBy(collection, 'slug', slug))?.id

{
  const result = { created: 0, updated: 0 }
  for (const { daysAgo, date, category, ...post } of content.posts) {
    const existing = await findBy('posts', 'slug', post.slug)
    const publishedAt = date ?? (existing?.publishedAt as string | undefined) ?? isoDaysAgo(daysAgo)
    const data = { ...post, category: await categoryId('post-categories', category), publishedAt }
    result[await upsertBySlug('posts', data, true)]++
  }
  console.log(`posts: thêm ${result.created}, cập nhật ${result.updated}`)
  await pruneMissing(
    'posts',
    'slug',
    content.posts.map((d) => d.slug),
  )
}
{
  const result = { created: 0, updated: 0 }
  for (const { daysAgo, category, downloadCount, ...document } of content.documents) {
    const existing = await findBy('documents', 'slug', document.slug)
    const data = {
      ...document,
      category: await categoryId('document-categories', category),
      publishedAt: (existing?.publishedAt as string | undefined) ?? isoDaysAgo(daysAgo),
      ...(existing ? {} : { downloadCount }),
    }
    result[await upsertBySlug('documents', data, true)]++
  }
  console.log(`documents: thêm ${result.created}, cập nhật ${result.updated}`)
  await pruneMissing(
    'documents',
    'slug',
    content.documents.map((d) => d.slug),
  )
}

// Categories last: with --prune, the posts/documents that used a removed category are already gone.
await pruneMissing(
  'post-categories',
  'slug',
  content.postCategories.map((c) => c.slug),
)
await pruneMissing(
  'document-categories',
  'slug',
  content.documentCategories.map((c) => c.slug),
)

/* ---------- partners ---------- */

const partnerNames: string[] = []
for (const [i, entry] of content.partners.entries()) {
  const { name, group, url } = content.partnerInfo(entry)
  partnerNames.push(name)
  const logo = await ensureMedia(partnerLogoFile(entry), { vi: name, en: name, zh: name })
  const data = { name, group, url: url ?? null, logo, order: i, enabled: true }
  const existing = await findBy('partners', 'name', name)
  if (existing) await payload.update({ collection: 'partners', id: existing.id, data, context: ctx() })
  else await payload.create({ collection: 'partners', data, context: ctx() })
}
console.log(`Đối tác: ${partnerNames.length}`)
await pruneMissing('partners', 'name', partnerNames)

/* ---------- certificates ---------- */

for (const [i, { title, image, orientation }] of content.certificates.entries()) {
  const data = { title: title.vi, image: mediaIds[image.$photo], orientation, order: i, enabled: true }
  const { docs } = await payload.find({
    collection: 'certificates',
    where: { title: { equals: title.vi } },
    locale: 'vi',
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const saved = docs[0]
    ? await payload.update({ collection: 'certificates', id: docs[0].id, locale: 'vi', data, context: ctx() })
    : await payload.create({ collection: 'certificates', locale: 'vi', data, context: ctx() })
  for (const locale of translations) {
    await payload.update({
      collection: 'certificates',
      id: saved.id,
      locale,
      data: { title: title[locale] },
      context: ctx(),
    })
  }
}
console.log(`Chứng chỉ: ${content.certificates.length}`)
await pruneMissing(
  'certificates',
  'title',
  content.certificates.map((c) => c.title.vi),
)

/* ---------- sliders: texts only ---------- */

type SlideRow = Row & { button?: { label?: string | null; url?: string | null } | null } & Record<string, unknown>

for (const slider of content.sliders) {
  const existing = await findBy('sliders', 'placement', slider.placement)
  if (!existing) {
    const data = {
      name: slider.name,
      placement: slider.placement,
      autoplay: true,
      interval: 7,
      slides: slider.slides.map((slide) => ({ enabled: true, type: 'image', ...slide })),
    }
    const created = await payload.create({
      collection: 'sliders',
      locale: 'vi',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: localize(data, 'vi') as any,
      depth: 0,
      context: ctx(),
    })
    for (const locale of translations) {
      await payload.update({
        collection: 'sliders',
        id: created.id,
        locale,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: withRowIds(localize(data, locale), created) as any,
        depth: 0,
        context: ctx(),
      })
    }
    console.log(`Trình chiếu "${slider.placement}": đã tạo mới`)
    continue
  }
  for (const locale of ['vi', ...translations] as const) {
    const current = await payload.findByID({ collection: 'sliders', id: existing.id, locale, depth: 0 })
    const slides = ((current.slides ?? []) as SlideRow[]).map((row, i) => {
      const source = slider.slides[i]
      if (!source) return row
      const texts = localize(
        { eyebrow: source.eyebrow, heading: source.heading, text: source.text, label: source.button?.label },
        locale,
      ) as { eyebrow?: string; heading?: string; text?: string; label?: string }
      return {
        ...row,
        ...(source.eyebrow ? { eyebrow: texts.eyebrow } : {}),
        ...(source.heading ? { heading: texts.heading } : {}),
        ...(source.text ? { text: texts.text } : {}),
        ...(source.button ? { button: { ...row.button, label: texts.label } } : {}),
      }
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await payload.update({ collection: 'sliders', id: existing.id, locale, data: { slides } as any, context: ctx() })
  }
  const extra = slider.slides.length - ((existing.slides as unknown[] | undefined)?.length ?? 0)
  console.log(
    `Trình chiếu "${slider.placement}": đã cập nhật chữ${extra > 0 ? ` (bỏ qua ${extra} slide mới, thêm ảnh trong trang quản trị)` : ''}`,
  )
}

/* ---------- globals ---------- */

await setGlobal('site-settings', content.siteSettings)
await setGlobal('home-page', content.homePage)
await setGlobal('about-page', content.aboutPage)
console.log('Cấu hình chung, trang chủ, giới thiệu: xong')

if (!prune)
  console.log('Chạy `npm run update-content:prune` để xoá các mục không còn trong content.ts (nếu có liệt kê ở trên).')

await revalidateSite()

console.log('Cập nhật hoàn tất.')
process.exit(0)
