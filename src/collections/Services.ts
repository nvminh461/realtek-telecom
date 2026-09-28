import type { CollectionConfig } from 'payload'

import { hiddenForContributor, isAdminOrEditor, publishedOrStaff } from '@/access'
import { auditFields, stampAudit } from '@/fields/audit'
import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'
import { revalidateCollection } from '@/hooks/revalidate'
import { previewUrl } from '@/lib/preview'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Dịch vụ', plural: 'Dịch vụ' },
  admin: {
    useAsTitle: 'title',
    group: 'Nội dung',
    defaultColumns: ['title', 'slug', 'featured', 'order', '_status', 'updatedAt'],
    hidden: hiddenForContributor,
    preview: (doc, { locale }) => previewUrl(`/services/${doc.slug}`, locale),
  },
  defaultSort: 'order',
  versions: { drafts: true, maxPerDoc: 20 },
  access: {
    read: publishedOrStaff,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Nội dung',
          fields: [
            { name: 'title', label: 'Tên dịch vụ', type: 'text', localized: true, required: true },
            { name: 'excerpt', label: 'Tóm tắt', type: 'textarea', localized: true },
            { name: 'content', label: 'Giới thiệu', type: 'richText', localized: true },
            {
              name: 'groups',
              label: 'Hạng mục dịch vụ',
              type: 'array',
              labels: { singular: 'Hạng mục', plural: 'Hạng mục' },
              admin: {
                description:
                  'Hiện thành các nút trên thẻ dịch vụ ở trang chủ và thành danh sách ở trang chi tiết. Mỗi hạng mục có thể có các mục con.',
              },
              fields: [
                { name: 'title', label: 'Tên hạng mục', type: 'text', localized: true, required: true },
                {
                  name: 'items',
                  label: 'Mục con',
                  type: 'array',
                  labels: { singular: 'Mục con', plural: 'Mục con' },
                  fields: [{ name: 'title', label: 'Tên', type: 'text', localized: true, required: true }],
                },
              ],
            },
          ],
        },
        {
          label: 'Hình ảnh',
          fields: [
            { name: 'featuredImage', label: 'Ảnh đại diện', type: 'upload', relationTo: 'media', required: true },
            { name: 'gallery', label: 'Bộ sưu tập ảnh', type: 'upload', relationTo: 'media', hasMany: true },
          ],
        },
        { label: 'SEO', fields: [seoField] },
      ],
    },
    ...slugField(),
    {
      name: 'featured',
      label: 'Hiện ở trang chủ',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    { name: 'order', label: 'Thứ tự', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    ...auditFields,
  ],
  hooks: {
    beforeChange: [stampAudit],
    ...revalidateCollection(),
  },
}
