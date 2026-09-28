import type { GlobalConfig } from 'payload'

import { anyone, hiddenForContributor, isAdminOrEditor } from '@/access'
import { linkFields } from '@/fields/link'
import { seoField } from '@/fields/seo'
import { revalidateGlobal } from '@/hooks/revalidate'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Trang chủ',
  admin: {
    group: 'Nội dung trang',
    hidden: hiddenForContributor,
    description: 'Ảnh trình chiếu đầu trang quản lý tại Hiển thị → Trình chiếu ảnh (vị trí Trang chủ).',
  },
  access: { read: anyone, update: isAdminOrEditor },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Giới thiệu',
          fields: [
            {
              name: 'intro',
              type: 'group',
              label: false,
              fields: [
                { name: 'eyebrow', label: 'Dòng nhỏ', type: 'text', localized: true },
                { name: 'heading', label: 'Tiêu đề', type: 'textarea', localized: true },
                { name: 'text', label: 'Đoạn giới thiệu', type: 'textarea', localized: true },
                { name: 'image', label: 'Ảnh', type: 'upload', relationTo: 'media' },
                { name: 'link', label: 'Nút', type: 'group', fields: linkFields() },
                {
                  name: 'stats',
                  label: 'Số liệu nổi bật',
                  type: 'array',
                  maxRows: 4,
                  labels: { singular: 'Số liệu', plural: 'Số liệu' },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'value', label: 'Giá trị', type: 'number', required: true },
                        { name: 'suffix', label: 'Hậu tố', type: 'text', admin: { placeholder: '+' } },
                        { name: 'label', label: 'Nhãn', type: 'text', localized: true, required: true },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Lĩnh vực & dự án',
          fields: [
            {
              name: 'services',
              label: 'Dịch vụ hiển thị',
              type: 'relationship',
              relationTo: 'services',
              hasMany: true,
              maxRows: 7,
              admin: { description: 'Để trống thì hiển thị các dịch vụ được đánh dấu "Hiện ở trang chủ".' },
            },
            {
              name: 'projects',
              label: 'Dự án hiển thị',
              type: 'relationship',
              relationTo: 'projects',
              hasMany: true,
              maxRows: 6,
              admin: { description: 'Để trống thì hiển thị các dự án được đánh dấu "Hiện ở trang chủ".' },
            },
          ],
        },
        {
          label: 'Dải ảnh nổi bật',
          fields: [
            {
              name: 'highlight',
              type: 'group',
              label: false,
              fields: [
                { name: 'image', label: 'Ảnh nền', type: 'upload', relationTo: 'media' },
                { name: 'eyebrow', label: 'Dòng nhỏ', type: 'text', localized: true },
                { name: 'heading', label: 'Tiêu đề', type: 'textarea', localized: true },
                { name: 'text', label: 'Nội dung', type: 'textarea', localized: true },
                { name: 'link', label: 'Nút', type: 'group', fields: linkFields() },
              ],
            },
          ],
        },
        { label: 'SEO', fields: [seoField] },
      ],
    },
  ],
  hooks: { afterChange: [revalidateGlobal] },
}

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'Giới thiệu công ty',
  admin: { group: 'Nội dung trang', hidden: hiddenForContributor },
  access: { read: anyone, update: isAdminOrEditor },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Nội dung',
          fields: [
            { name: 'heading', label: 'Tiêu đề trang', type: 'text', localized: true },
            { name: 'lead', label: 'Đoạn mở đầu', type: 'textarea', localized: true },
            { name: 'image', label: 'Ảnh đầu trang', type: 'upload', relationTo: 'media' },
            { name: 'content', label: 'Nội dung', type: 'richText', localized: true },
            {
              name: 'values',
              label: 'Giá trị cốt lõi',
              type: 'array',
              maxRows: 6,
              labels: { singular: 'Giá trị', plural: 'Giá trị' },
              fields: [
                { name: 'title', label: 'Tiêu đề', type: 'text', localized: true, required: true },
                { name: 'text', label: 'Mô tả', type: 'textarea', localized: true },
              ],
            },
          ],
        },
        {
          label: 'Chặng đường',
          fields: [
            {
              name: 'milestones',
              label: 'Các mốc phát triển',
              type: 'array',
              labels: { singular: 'Mốc', plural: 'Mốc' },
              fields: [
                { name: 'year', label: 'Năm', type: 'text', required: true },
                { name: 'title', label: 'Tiêu đề', type: 'text', localized: true, required: true },
                { name: 'text', label: 'Mô tả', type: 'textarea', localized: true },
              ],
            },
          ],
        },
        {
          label: 'Sản phẩm',
          fields: [
            {
              name: 'productLines',
              label: 'Sản phẩm thế hệ tiếp theo',
              type: 'array',
              labels: { singular: 'Dòng sản phẩm', plural: 'Dòng sản phẩm' },
              fields: [
                { name: 'title', label: 'Tên dòng sản phẩm', type: 'text', localized: true, required: true },
                {
                  name: 'items',
                  label: 'Thành phần',
                  type: 'array',
                  labels: { singular: 'Thành phần', plural: 'Thành phần' },
                  fields: [{ name: 'title', label: 'Tên', type: 'text', localized: true, required: true }],
                },
                { name: 'note', label: 'Ghi chú', type: 'textarea', localized: true },
              ],
            },
          ],
        },
        {
          label: 'Mạng lưới hoạt động',
          fields: [
            {
              name: 'offices',
              label: 'Văn phòng',
              type: 'array',
              labels: { singular: 'Văn phòng', plural: 'Văn phòng' },
              fields: [
                { name: 'name', label: 'Tên (ví dụ: Văn phòng Hà Nội)', type: 'text', localized: true, required: true },
                { name: 'address', label: 'Địa chỉ', type: 'textarea', localized: true, required: true },
                { name: 'phone', label: 'Điện thoại', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Nhân sự',
          fields: [
            { name: 'teamIntro', label: 'Giới thiệu đội ngũ', type: 'textarea', localized: true },
            {
              name: 'teams',
              label: 'Phòng ban',
              type: 'array',
              labels: { singular: 'Phòng ban', plural: 'Phòng ban' },
              fields: [
                { name: 'title', label: 'Tên phòng ban / nhóm', type: 'text', localized: true, required: true },
                {
                  name: 'members',
                  label: 'Nhân sự',
                  type: 'array',
                  labels: { singular: 'Nhân sự', plural: 'Nhân sự' },
                  fields: [
                    { name: 'name', label: 'Họ tên', type: 'text', required: true },
                    { name: 'role', label: 'Vai trò / kinh nghiệm', type: 'text', localized: true },
                    {
                      name: 'details',
                      label: 'Chi tiết',
                      type: 'textarea',
                      localized: true,
                      admin: { description: 'Mỗi dòng là một ý (chứng chỉ, phụ trách, kinh nghiệm…).' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        { label: 'SEO', fields: [seoField] },
      ],
    },
  ],
  hooks: { afterChange: [revalidateGlobal] },
}
