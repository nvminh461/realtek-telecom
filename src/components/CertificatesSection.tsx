import { getTranslations } from 'next-intl/server'

import { CertificateGrid, type CertificateItem } from '@/components/CertificateGrid'
import { SectionHeading } from '@/components/SectionHeading'
import type { Locale } from '@/i18n/routing'
import { getCertificates } from '@/lib/data'
import { resolveImage } from '@/lib/media'

/** Certificates section of the home and about pages; renders nothing until a certificate is published. */
export async function CertificatesSection({
  locale,
  eyebrow,
  className = '',
}: {
  locale: Locale
  eyebrow?: string
  className?: string
}) {
  const [certificates, t, tc] = await Promise.all([
    getCertificates(locale),
    getTranslations({ locale, namespace: 'certificates' }),
    getTranslations({ locale, namespace: 'common' }),
  ])
  const items = certificates.flatMap((c): CertificateItem[] => {
    const image = resolveImage(c.image, 'wide', c.title)
    return image ? [{ id: String(c.id), title: c.title, orientation: c.orientation, image }] : []
  })
  if (!items.length) return null

  return (
    <section className={`py-24 md:py-32 ${className}`}>
      <div className="container-x">
        <SectionHeading eyebrow={eyebrow} title={t('title')} className="mb-12 md:mb-16">
          {t('text')}
        </SectionHeading>
        <CertificateGrid
          items={items}
          labels={{ more: t('more'), less: t('less'), close: t('close'), prev: tc('prev'), next: tc('next') }}
        />
      </div>
    </section>
  )
}
