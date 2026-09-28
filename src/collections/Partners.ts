import type { CollectionConfig } from 'payload'

import { anyone, hiddenForContributor, isAdminOrEditor } from '@/access'
import { revalidateCollection } from '@/hooks/revalidate'

export const Partners: CollectionConfig = {
  slug: 'partners',
  labels: { singular: 'Đối tác', plural: 'Đối tác' },
  admin: {
    useAsTitle: 'name',
    group: 'Hiển thị',
    defaultColumns: ['name', 'group', 'order', 'enabled'],
    hidden: hiddenForContributor,
  },
  defaultSort: 'order',
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'name', label: 'Tên đối tác', type: 'text', required: true },
    {
      name: 'group',
      label: 'Nhóm',
      type: 'select',
      required: true,
      defaultValue: 'partner',
      options: [
        { label: 'Đối tác tiêu biểu', value: 'partner' },
        { label: 'Sản phẩm chính (thương hiệu)', value: 'product' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'logo', label: 'Logo', type: 'upload', relationTo: 'media', required: true },
    { name: 'url', label: 'Website', type: 'text' },
    { name: 'enabled', label: 'Hiển thị', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    { name: 'order', label: 'Thứ tự', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
  hooks: revalidateCollection(),
}
