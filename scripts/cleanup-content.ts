/**
 * Removes the placeholder records the first seed put in the database (services, projects, documents, posts,
 * partners and categories that are not real Realtek content), so only the company's real content remains.
 *
 *   npm run cleanup-content            # dry run: lists what would be deleted, deletes nothing
 *   npm run cleanup-content:apply      # deletes them (same as `-- --apply`, which PowerShell drops)
 *
 * Only the placeholder slugs/names listed below are ever deleted. Anything else in the database that is not in
 * src/demo/content.ts is reported (it may have been added in the admin) but left alone.
 * Run `npm run update-content` as well so the real content is present and up to date.
 */
import 'dotenv/config'
import { getPayload, type Payload } from 'payload'

import * as content from '../src/demo/content'
import config from '../src/payload.config'
import { revalidateSite } from './revalidate'

if (!process.env.DATABASE_URI) {
  console.error('Cần khai báo DATABASE_URI trong .env để dọn dữ liệu.')
  process.exit(1)
}

const apply = process.argv.includes('--apply')
const ctx = () => ({ disableRevalidate: true })
const payload: Payload = await getPayload({ config })

/** Placeholder content of the first seed (and of earlier drafts of content.ts), by slug or name. */
const placeholders = {
  services: [
    'network-infrastructure',
    'fiber-optic-telecom',
    'data-center',
    'cybersecurity',
    'software-solutions',
    'smart-campus-elv',
    'unified-communications',
  ],
  projects: [
    'office-tower-network',
    'data-center-upgrade',
    'campus-wifi',
    'fiber-backbone',
    'smart-office',
    'headquarters-it-system',
  ],
  documents: [
    'structured-cabling-guide',
    'fiber-splicing-procedure',
    'server-room-standards',
    'network-equipment-catalogue-2026',
    'wifi-survey-checklist',
    'service-request-form',
    'maintenance-handover-template',
  ],
  posts: ['technology-conference-2026', 'year-end-customer-meeting'],
  partners: ['NORTHWIND', 'CONTOSO', 'FABRIKAM', 'LITWARE', 'TAILSPIN', 'ADATUM'],
  'document-categories': ['technical-documents', 'catalogues', 'forms'],
  'post-categories': ['events'],
} as const

type Target = keyof typeof placeholders

/** What content.ts keeps, per collection (to tell unknown extras apart from real content). */
const kept: Record<Target, string[]> = {
  services: content.services.map((d) => d.slug),
  projects: content.projects.map((d) => d.slug),
  documents: content.documents.map((d) => d.slug),
  posts: content.posts.map((d) => d.slug),
  partners: content.partners.map((d) => d.name),
  'document-categories': content.documentCategories.map((c) => c.slug),
  'post-categories': content.postCategories.map((c) => c.slug),
}

const deleted: Partial<Record<Target, string[]>> = {}
let unknown = 0

// Documents and posts before their categories, so nothing is left pointing at a deleted category.
const order: Target[] = [
  'services',
  'projects',
  'documents',
  'posts',
  'partners',
  'document-categories',
  'post-categories',
]

for (const collection of order) {
  const field = collection === 'partners' ? 'name' : 'slug'
  const { docs } = await payload.find({
    collection,
    limit: 0,
    pagination: false,
    depth: 0,
    overrideAccess: true,
  })
  const keyOf = (doc: unknown) => String((doc as Record<string, unknown>)[field])
  const remove = docs.filter((d) => (placeholders[collection] as readonly string[]).includes(keyOf(d)))
  const extras = docs.filter((d) => !remove.includes(d) && !kept[collection].includes(keyOf(d)))

  console.log(`\n${collection}: ${docs.length} trong database`)
  for (const doc of remove) {
    console.log(`  ${apply ? 'Đã xoá' : 'Sẽ xoá'}: ${keyOf(doc)}`)
    if (apply) await payload.delete({ collection, id: doc.id, overrideAccess: true, context: ctx() })
  }
  for (const doc of extras) console.log(`  Không có trong content.ts (giữ nguyên, hãy kiểm tra): ${keyOf(doc)}`)
  unknown += extras.length
  deleted[collection] = remove.map((d) => String(d.id))
}

// Drop deleted services/projects from the home page's hand-picked lists.
if (apply) {
  const home = await payload.findGlobal({ slug: 'home-page', depth: 0, overrideAccess: true })
  const idOf = (v: unknown) => String(typeof v === 'object' && v ? (v as { id: unknown }).id : v)
  const keep = (list: unknown, gone: string[] = []) =>
    Array.isArray(list) ? list.map(idOf).filter((id) => !gone.includes(id)) : list
  const services = keep(home.services, deleted.services)
  const projects = keep(home.projects, deleted.projects)
  if (
    JSON.stringify(services) !== JSON.stringify(home.services?.map(idOf)) ||
    JSON.stringify(projects) !== JSON.stringify(home.projects?.map(idOf))
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await payload.updateGlobal({ slug: 'home-page', data: { services, projects } as any, context: ctx() })
    console.log('\nĐã bỏ các mục đã xoá khỏi danh sách chọn ở trang chủ.')
  }
}

const total = Object.values(deleted).reduce((n, ids) => n + (ids?.length ?? 0), 0)
console.log(
  `\n${apply ? 'Đã xoá' : 'Sẽ xoá'} ${total} mục mẫu.${unknown ? ` ${unknown} mục khác không có trong content.ts được giữ nguyên.` : ''}`,
)
if (!apply) console.log('Chạy `npm run cleanup-content:apply` để xoá thật.')

if (apply) await revalidateSite()

process.exit(0)
