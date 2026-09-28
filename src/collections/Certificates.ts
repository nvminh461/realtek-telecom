import type { CollectionConfig } from 'payload'

import { anyone, hiddenForContributor, isAdminOrEditor } from '@/access'
import { revalidateCollection } from '@/hooks/revalidate'

/** Certificates and awards shown on the home and about pages (components/CertificateGrid). */
export const Certificates: CollectionConfig = {
  slug: 'certificates',
  labels: { singular: 'Chứng chỉ', plural: 'Chứng chỉ' },
  admin: {
    useAsTitle: 'title',
    group: 'Nội dung',
    defaultColumns: ['title', 'image', 'orientation', 'order', 'enabled'],
    description:
      'Hiển thị ở trang chủ và trang giới thiệu theo thứ tự: 20 chứng chỉ đầu tiên, các chứng chỉ còn lại hiện khi bấm "Xem thêm".',
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
    { name: 'title', label: 'Tiêu đề', type: 'text', localized: true, required: true },
    { name: 'image', label: 'Ảnh chứng chỉ', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'orientation',
      label: 'Kiểu ảnh',
      type: 'radio',
      required: true,
      defaultValue: 'portrait',
      options: [
        { label: 'Dọc', value: 'portrait' },
        { label: 'Ngang', value: 'landscape' },
      ],
      admin: {
        layout: 'horizontal',
        description: 'Ảnh dọc chiếm 1 ô, ảnh ngang chiếm 2 ô cùng chiều cao; lưới tự sắp xếp để không có ô trống.',
      },
    },
    { name: 'enabled', label: 'Hiển thị', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    { name: 'order', label: 'Thứ tự', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
  hooks: revalidateCollection(),
}
