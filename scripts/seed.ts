/**
 * Loads the placeholder content of src/demo/content.ts (the same content demo mode shows) into Payload,
 * so the site looks identical once a database is connected (SRS FR-15). Replace it with real content in the admin.
 *
 *   npm run seed            # refuses to run when content already exists
 *   npm run seed:force      # wipes seeded collections first (same as `-- --force`, which PowerShell drops)
 */
import 'dotenv/config'
import crypto from 'crypto'
import { getPayload, type Payload } from 'payload'

import * as content from '../src/demo/content'
import config from '../src/payload.config'
import { partnerLogoFile, photoFile } from './content-files'
import { revalidateSite } from './revalidate'

if (!process.env.DATABASE_URI) {
  console.error('Cần khai báo DATABASE_URI trong .env để seed dữ liệu.')
  process.exit(1)
}

const force = process.argv.includes('--force')
// A fresh object per call: the cloud-storage plugin stores the incoming file in req.context
// (`_payloadCloudStorage`, only if unset), so a shared object would make every upload reuse the first file.
const ctx = () => ({ disableRevalidate: true })
const translations = ['en', 'zh'] as const
const payload: Payload = await getPayload({ config })

/* ---------- helpers ---------- */

const mediaIds = {} as Record<content.PhotoKey, string>
const localize = (value: unknown, locale: content.Loc) => content.localize(value, locale, (key) => mediaIds[key])

/**
 * Array rows are not localized but their fields are: en/zh updates must reuse the row ids created with the
 * Vietnamese save, otherwise Payload replaces the rows and the Vietnamese values are lost.
 */
function withRowIds(data: unknown, saved: unknown): unknown {
  if (Array.isArray(data) && Array.isArray(saved)) {
    return data.map((row, i) => {
      const savedRow = saved[i] as { id?: string } | undefined
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

type Collection = 'services' | 'projects' | 'posts' | 'documents' | 'sliders'

/** Vietnamese first, then en/zh translations of the same document. */
async function createLocalized(collection: Collection, data: object, drafts = true) {
  const status = drafts ? { _status: 'published' as const } : {}
  const created = await payload.create({
    collection,
    locale: 'vi',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: { ...(localize(data, 'vi') as object), ...status } as any,
    depth: 0,
    context: ctx(),
  })
  for (const locale of translations) {
    await payload.update({
      collection,
      id: created.id,
      locale,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: { ...(withRowIds(localize(data, locale), created) as object), ...status } as any,
      depth: 0,
      context: ctx(),
    })
  }
  return created.id
}

async function setGlobal(slug: 'site-settings' | 'home-page' | 'about-page', data: object) {
  const saved = await payload.updateGlobal({
    slug,
    locale: 'vi',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: localize(data, 'vi') as any,
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

async function createCategory(
  collection: 'post-categories' | 'document-categories',
  slug: string,
  title: content.L,
  order: number,
) {
  const c = await payload.create({ collection, locale: 'vi', data: { slug, title: title.vi, order }, context: ctx() })
  for (const locale of translations) {
    await payload.update({ collection, id: c.id, locale, data: { title: title[locale] }, context: ctx() })
  }
  return c.id
}

async function upload(name: string, data: Buffer, alt: content.L, mimetype: string) {
  const media = await payload.create({
    collection: 'media',
    locale: 'vi',
    data: { alt: alt.vi },
    file: { data, mimetype, name, size: data.length },
    context: ctx(),
  })
  for (const locale of translations) {
    await payload.update({ collection: 'media', id: media.id, locale, data: { alt: alt[locale] }, context: ctx() })
  }
  return media.id
}

const isoDaysAgo = (days: number) => new Date(Date.now() - days * 24 * 3600 * 1000).toISOString()

/* ---------- guard ---------- */

const existing = await payload.count({ collection: 'services', overrideAccess: true })
if (existing.totalDocs > 0 && !force) {
  console.log('Đã có dữ liệu. Chạy `npm run seed:force` để xoá và seed lại.')
  process.exit(0)
}
if (force) {
  for (const collection of [
    'services',
    'projects',
    'posts',
    'documents',
    'post-categories',
    'document-categories',
    'sliders',
    'banners',
    'partners',
    'certificates',
    'media',
  ] as const) {
    await payload.delete({ collection, where: { id: { exists: true } }, context: ctx() })
  }
  console.log('Đã xoá dữ liệu cũ.')
}

/* ---------- content ---------- */

console.log('Đang tải ảnh mẫu…')
for (const key of content.photoKeys) {
  const file = photoFile(key)
  mediaIds[key] = await upload(file.name, await file.data(), content.photoAlts[key], file.mimetype)
  process.stdout.write('.')
}
console.log(' xong')

const postCategoryIds: Record<string, string> = {}
for (const [i, c] of content.postCategories.entries()) {
  postCategoryIds[c.slug] = await createCategory('post-categories', c.slug, c.title, i + 1)
}
const documentCategoryIds: Record<string, string> = {}
for (const [i, c] of content.documentCategories.entries()) {
  documentCategoryIds[c.slug] = await createCategory('document-categories', c.slug, c.title, i + 1)
}

for (const service of content.services) await createLocalized('services', service)
for (const project of content.projects) await createLocalized('projects', project)
for (const { daysAgo, date, category, ...post } of content.posts) {
  await createLocalized('posts', {
    ...post,
    category: postCategoryIds[category],
    publishedAt: date ?? isoDaysAgo(daysAgo),
  })
}
for (const { daysAgo, category, ...document } of content.documents) {
  await createLocalized('documents', {
    ...document,
    category: documentCategoryIds[category],
    publishedAt: isoDaysAgo(daysAgo),
  })
}
for (const slider of content.sliders) {
  await createLocalized(
    'sliders',
    {
      name: slider.name,
      placement: slider.placement,
      autoplay: true,
      interval: 7,
      slides: slider.slides.map((slide) => ({ enabled: true, type: 'image', ...slide })),
    },
    false,
  )
}
console.log(
  `Dịch vụ: ${content.services.length}, dự án: ${content.projects.length}, tin tức: ${content.posts.length}, tài liệu: ${content.documents.length}`,
)

for (const [i, entry] of content.partners.entries()) {
  const { name, group, url } = content.partnerInfo(entry)
  const file = partnerLogoFile(entry)
  const logo = await upload(file.name, await file.data(), { vi: name, en: name, zh: name }, file.mimetype)
  await payload.create({
    collection: 'partners',
    data: { name, group, url, logo, order: i, enabled: true },
    context: ctx(),
  })
}

for (const [i, { title, image, orientation }] of content.certificates.entries()) {
  const certificate = await payload.create({
    collection: 'certificates',
    locale: 'vi',
    data: { title: title.vi, image: mediaIds[image.$photo], orientation, order: i, enabled: true },
    context: ctx(),
  })
  for (const locale of translations) {
    await payload.update({
      collection: 'certificates',
      id: certificate.id,
      locale,
      data: { title: title[locale] },
      context: ctx(),
    })
  }
}

await setGlobal('site-settings', content.siteSettings)
await setGlobal('home-page', content.homePage)
await setGlobal('about-page', content.aboutPage)
console.log('Đối tác, chứng chỉ, cấu hình chung, trang chủ, giới thiệu: xong')

/* ---------- first admin ---------- */

const users = await payload.count({ collection: 'users', overrideAccess: true })
if (users.totalDocs === 0) {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@realtek.local'
  const password = process.env.SEED_ADMIN_PASSWORD || crypto.randomBytes(9).toString('base64url')
  await payload.create({
    collection: 'users',
    data: { email, password, name: 'Quản trị viên', role: 'admin', active: true },
    overrideAccess: true,
  })
  console.log(`Tài khoản quản trị: ${email} / ${password}`)
}

await revalidateSite()

console.log('Seed hoàn tất.')
process.exit(0)
