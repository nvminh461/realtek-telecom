import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { CertificatesSection } from '@/components/CertificatesSection'
import { MapPin, Phone } from '@/components/Icons'
import { PageHero } from '@/components/PageHero'
import { Reveal } from '@/components/reveal/Reveal'
import { RichText } from '@/components/RichText'
import { SectionHeading } from '@/components/SectionHeading'
import { isLocale } from '@/i18n/routing'
import { getAboutPage } from '@/lib/data'
import { buildMetadata } from '@/lib/metadata'

export async function generateMetadata({ params }: PageProps<'/[locale]/about'>): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const [page, t] = await Promise.all([getAboutPage(locale), getTranslations({ locale, namespace: 'nav' })])
  return buildMetadata({
    locale,
    path: '/about',
    title: page.heading || t('about'),
    description: page.lead,
    image: page.image,
    seo: page.seo,
  })
}

export default async function AboutPage({ params }: PageProps<'/[locale]/about'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  setRequestLocale(locale)
  const [page, t, tn, ta] = await Promise.all([
    getAboutPage(locale),
    getTranslations({ locale, namespace: 'home' }),
    getTranslations({ locale, namespace: 'nav' }),
    getTranslations({ locale, namespace: 'about' }),
  ])
  const title = page.heading || tn('about')

  return (
    <>
      <PageHero
        locale={locale}
        title={title}
        eyebrow={t('eyebrow')}
        crumbs={[{ label: tn('home'), href: '/' }, { label: tn('about') }]}
        placement="about"
        image={page.image}
      />

      {page.lead || page.content ? (
        <section className="py-24 md:py-32">
          <div className="container-x grid gap-12 lg:grid-cols-12">
            {page.lead ? (
              <div className="lg:col-span-5">
                {/* Stays in view while the long content column scrolls past. */}
                <div className="lg:sticky lg:top-[calc(var(--header-h)+24px)]">
                  <Reveal variant="up">
                    <p className="font-display text-[clamp(22px,2.4vw,30px)] font-semibold leading-snug text-brand">
                      {page.lead}
                    </p>
                    <span aria-hidden className="mt-8 block h-px w-24 bg-accent" />
                  </Reveal>
                </div>
              </div>
            ) : null}
            <Reveal variant="up" delay={150} className={page.lead ? 'lg:col-span-7' : 'lg:col-span-12'}>
              <RichText data={page.content} />
            </Reveal>
          </div>
        </section>
      ) : null}

      {page.values?.length ? (
        <section className="bg-brand py-24 text-white md:py-28">
          <div className="container-x">
            <ul className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {page.values.map((v, i) => (
                <li key={v.id ?? i} className="bg-brand">
                  <Reveal variant="up" delay={i * 100} innerClassName="h-full p-8 md:p-10">
                    <span className="font-display text-sm font-semibold tabular-nums text-accent">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h2 className="mt-4 font-display text-xl font-bold uppercase tracking-[0.04em]">{v.title}</h2>
                    {v.text ? <p className="mt-3 text-[15px] leading-relaxed text-white/75">{v.text}</p> : null}
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {page.milestones?.length ? (
        <section className="bg-paper py-24 md:py-32">
          <div className="container-x">
            <ol className="relative border-l border-line pl-8 md:mx-auto md:max-w-4xl md:border-l-0 md:pl-0">
              <span
                aria-hidden
                className="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-line md:block"
              />
              {page.milestones.map((m, i) => {
                const right = i % 2 === 1
                return (
                  <li key={m.id ?? i} className={`relative pb-14 last:pb-0 md:grid md:grid-cols-2 md:gap-16`}>
                    <span
                      aria-hidden
                      className="absolute -left-[37px] top-2 h-3 w-3 rounded-full border-2 border-accent bg-paper md:left-1/2 md:-translate-x-1/2"
                    />
                    <Reveal variant={right ? 'right' : 'left'} className={right ? 'md:col-start-2' : 'md:text-right'}>
                      <p className="font-display text-4xl font-bold text-accent">{m.year}</p>
                      <h3 className="mt-2 font-display text-lg font-bold uppercase tracking-[0.04em] text-brand">
                        {m.title}
                      </h3>
                      {m.text ? <p className="mt-2 text-[15px] text-ink-soft">{m.text}</p> : null}
                    </Reveal>
                  </li>
                )
              })}
            </ol>
          </div>
        </section>
      ) : null}

      {page.productLines?.length ? (
        <section className="bg-brand-deep py-24 text-white md:py-32">
          <div className="container-x">
            <Reveal variant="mask-x">
              <p className="eyebrow eyebrow--light">{t('eyebrow')}</p>
            </Reveal>
            <Reveal variant="up" delay={100}>
              <h2 className="section-title section-title--light mt-4">{ta('productsTitle')}</h2>
            </Reveal>
            <div className="mt-12 grid items-start gap-6 md:mt-14 lg:grid-cols-2">
              {page.productLines.map((line, i) => (
                <Reveal
                  key={line.id ?? i}
                  variant="up"
                  delay={i * 120}
                  innerClassName="border border-white/15 bg-white/[0.04] p-7 md:p-9"
                >
                  <span className="font-display text-sm font-semibold tabular-nums text-accent">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-3 font-display text-xl font-bold uppercase leading-snug tracking-[0.03em]">
                    {line.title}
                  </h3>
                  {line.items?.length ? (
                    <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                      {line.items.map((item, j) => (
                        <li
                          key={item.id ?? j}
                          className="flex items-start gap-3 border border-white/10 bg-white/5 px-4 py-3 text-[14.5px] leading-snug"
                        >
                          <span aria-hidden className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          {item.title}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {line.note ? <p className="mt-5 text-[14px] text-white/65">{line.note}</p> : null}
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {page.offices?.length ? (
        <section className="py-24 md:py-32">
          <div className="container-x">
            <SectionHeading eyebrow={t('eyebrow')} title={ta('networkTitle')} className="mb-12 md:mb-14" />
            <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
              {page.offices.map((office, i) => (
                <li key={office.id ?? i} className="bg-white">
                  <Reveal variant="up" delay={Math.min(i, 5) * 80} innerClassName="flex h-full gap-4 p-7 md:p-8">
                    <MapPin size={22} className="mt-0.5 shrink-0 text-accent" />
                    <div>
                      <h3 className="font-display text-base font-bold uppercase tracking-[0.04em] text-brand">
                        {office.name}
                      </h3>
                      <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-ink-soft">
                        {office.address}
                      </p>
                      {office.phone ? (
                        <a
                          href={`tel:${office.phone.replace(/[^\d+]/g, '')}`}
                          className="mt-3 inline-flex items-center gap-2 text-[15px] font-medium text-brand hover:text-accent"
                        >
                          <Phone size={15} /> {office.phone}
                        </a>
                      ) : null}
                    </div>
                  </Reveal>
                </li>
              ))}
              {/* Fills the last row's empty cells, which would otherwise show the grid's line colour. */}
              <li aria-hidden className={officeGridFiller(page.offices.length)} />
            </ul>
          </div>
        </section>
      ) : null}

      {page.teams?.length ? (
        <section className="bg-paper py-24 md:py-32">
          <div className="container-x">
            <SectionHeading eyebrow={t('eyebrow')} title={ta('teamTitle')} className="mb-12 md:mb-16">
              {page.teamIntro}
            </SectionHeading>
            <div className="space-y-16">
              {page.teams.map((team, ti) => (
                <div key={team.id ?? ti}>
                  <Reveal variant="mask-x">
                    <h3 className="flex items-baseline gap-4 border-b border-line pb-4 font-display text-lg font-bold uppercase tracking-[0.06em] text-brand md:text-xl">
                      <span className="tabular-nums text-accent">{String(ti + 1).padStart(2, '0')}</span>
                      {team.title}
                    </h3>
                  </Reveal>
                  <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {(team.members ?? []).map((member, mi) => {
                      const details = (member.details ?? '')
                        .split('\n')
                        .map((line) => line.trim())
                        .filter(Boolean)
                      return (
                        <li key={member.id ?? mi}>
                          <Reveal
                            variant="up"
                            delay={Math.min(mi, 5) * 70}
                            className="h-full"
                            innerClassName="h-full border border-line bg-white p-7"
                          >
                            <p className="font-display text-base font-bold text-brand">{member.name}</p>
                            {member.role ? <p className="mt-1 text-sm font-medium text-accent">{member.role}</p> : null}
                            {details.length ? (
                              <ul className="mt-4 space-y-2 text-[14px] leading-relaxed text-ink-soft">
                                {details.map((line, di) => (
                                  <li key={di} className="relative pl-4">
                                    <span
                                      aria-hidden
                                      className="absolute left-0 top-[0.6em] h-1 w-1 rounded-full bg-accent"
                                    />
                                    {line}
                                  </li>
                                ))}
                              </ul>
                            ) : null}
                          </Reveal>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CertificatesSection locale={locale} eyebrow={t('eyebrow')} />
    </>
  )
}

/** Classes of the cell that closes the office grid's last row: 1 column on mobile, 2 from sm, 3 from lg. */
function officeGridFiller(count: number) {
  const smEmpty = count % 2
  const lgEmpty = (3 - (count % 3)) % 3
  return [
    'hidden bg-white',
    smEmpty ? 'sm:block' : 'sm:hidden',
    lgEmpty ? 'lg:block' : 'lg:hidden',
    lgEmpty === 2 ? 'lg:col-span-2' : 'lg:col-span-1',
  ].join(' ')
}
