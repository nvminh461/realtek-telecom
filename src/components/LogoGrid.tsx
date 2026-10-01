'use client'

import Image from 'next/image'
import { useRef, useState, type CSSProperties } from 'react'

import { Chevron } from '@/components/Icons'
import { Reveal } from '@/components/reveal/Reveal'

import type { CarouselLogo } from './LogoCarousel'

/** How many logos show below `lg` before "Xem tất cả"; wider screens always show the whole wall. */
const INITIAL = 24

/**
 * Logo height in % of the cell width (cqw). The logos run from square marks to 7:1 wordmarks, and one fixed height
 * makes the wide ones dominate, so the height shrinks with the square root of the aspect ratio (equal areas; a 3:1
 * wordmark is BASE tall), capped at MAX_H tall and MAX_W wide.
 */
const BASE = 24
const MAX_H = 42
const MAX_W = 74
const logoHeight = ({ width, height }: CarouselLogo) => {
  const ratio = width / height
  return Math.min(BASE * Math.sqrt(3 / ratio), MAX_H, MAX_W / ratio)
}

const card =
  'group @container flex aspect-[3/2] items-center justify-center border border-line bg-white transition-[border-color,box-shadow] duration-500 hover:border-accent hover:shadow-[0_24px_50px_-30px_rgb(7_37_82/0.45)]'

/**
 * Wall of logo cards, 3 to 8 per row by screen width, with a short last row centered. Below `lg` only the first 24
 * show until "Xem tất cả" (the rest are rendered but hidden, so they need no extra request).
 */
export function LogoGrid({ logos, labels }: { logos: CarouselLogo[]; labels: { more: string; less: string } }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState(false)

  const collapse = () => {
    setExpanded(false)
    const top = rootRef.current?.getBoundingClientRect().top ?? 0
    if (top < 0) rootRef.current?.scrollIntoView({ block: 'start' })
  }

  return (
    <div ref={rootRef} className="scroll-mt-[calc(var(--header-h)+24px)]">
      <ul
        className="flex flex-wrap justify-center gap-[var(--gap)] [--cols:3] [--gap:12px] sm:[--cols:4] md:[--gap:16px] lg:[--cols:6] xl:[--cols:8]"
        style={{ '--cell-w': 'calc((100% - (var(--cols) - 1) * var(--gap)) / var(--cols))' } as CSSProperties}
      >
        {logos.map((logo, i) => {
          const image = (
            <Image
              src={logo.src}
              alt={logo.name}
              width={logo.width}
              height={logo.height}
              unoptimized={logo.unoptimized}
              className="w-auto object-contain transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
              style={{ height: `${logoHeight(logo).toFixed(2)}cqw` }}
            />
          )
          return (
            <li key={logo.id} className={`w-[var(--cell-w)] ${expanded || i < INITIAL ? '' : 'max-lg:hidden'}`}>
              <Reveal variant="up" delay={(i % 8) * 50}>
                {logo.url ? (
                  <a href={logo.url} target="_blank" rel="noopener noreferrer" title={logo.name} className={card}>
                    {image}
                  </a>
                ) : (
                  <div title={logo.name} className={card}>
                    {image}
                  </div>
                )}
              </Reveal>
            </li>
          )
        })}
      </ul>

      {logos.length > INITIAL ? (
        <div className="mt-10 flex justify-center lg:hidden">
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => (expanded ? collapse() : setExpanded(true))}
            className="btn btn-outline text-brand"
          >
            {expanded ? labels.less : labels.more}
            <Chevron size={16} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      ) : null}
    </div>
  )
}
