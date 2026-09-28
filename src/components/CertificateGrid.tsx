'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type CSSProperties } from 'react'

import { ArrowLeft, ArrowRight, Chevron, Close } from '@/components/Icons'
import { Reveal } from '@/components/reveal/Reveal'
import type { ResolvedImage } from '@/lib/media'

export type CertificateItem = {
  id: string
  title: string
  orientation: 'portrait' | 'landscape'
  image: ResolvedImage
}

type Labels = { more: string; less: string; close: string; prev: string; next: string }

const dialogButton =
  'grid h-10 w-10 place-items-center rounded-full border border-white/30 text-white transition-colors hover:border-accent hover:bg-accent hover:text-brand-deep'

/** How many certificates show before "Xem thêm". */
const INITIAL = 20

/**
 * Certificates in an even grid: every tile has the same height (a 3:4 portrait cell, computed from the column width
 * with container units), portrait certificates take one column and landscape ones two, and `grid-flow-dense` fills
 * the gaps a landscape tile would leave at the end of a row. The first 20 show; "Xem thêm" reveals the rest (they are
 * rendered but hidden, so they need no extra request). A tile opens the certificate large in a dialog.
 */
export function CertificateGrid({ items, labels }: { items: CertificateItem[]; labels: Labels }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [current, setCurrent] = useState<number | null>(null)
  const visible = expanded ? items.length : Math.min(items.length, INITIAL)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (current === null) {
      if (dialog.open) dialog.close()
    } else if (!dialog.open) dialog.showModal()
  }, [current])

  const step = (delta: number) => setCurrent((i) => (i === null ? i : (i + delta + visible) % visible))

  const collapse = () => {
    setExpanded(false)
    const top = rootRef.current?.getBoundingClientRect().top ?? 0
    if (top < 0) rootRef.current?.scrollIntoView({ block: 'start' })
  }

  const open = current === null ? null : items[current]

  return (
    <div ref={rootRef} className="@container scroll-mt-[calc(var(--header-h)+24px)]">
      <ul
        className="grid grid-flow-row-dense grid-cols-[repeat(var(--cols),minmax(0,1fr))] gap-[var(--gap)] [--cols:2] [--gap:16px] sm:[--cols:3] md:[--cols:4] md:[--gap:24px] lg:[--cols:6]"
        style={{ '--cell-h': 'calc((100cqw - (var(--cols) - 1) * var(--gap)) / var(--cols) * 4 / 3)' } as CSSProperties}
      >
        {items.map((item, i) => (
          <li
            key={item.id}
            className={`${item.orientation === 'landscape' ? 'col-span-2' : ''} ${i < visible ? '' : 'hidden'}`}
          >
            <Reveal variant="up" delay={(i % 6) * 70}>
              <button
                type="button"
                onClick={() => setCurrent(i)}
                aria-haspopup="dialog"
                className="group block w-full text-left"
              >
                <span className="relative block h-[var(--cell-h)] border border-line bg-white transition-[border-color,box-shadow] duration-500 group-hover:border-accent group-hover:shadow-[0_24px_50px_-30px_rgb(7_37_82/0.45)]">
                  <Image
                    src={item.image.url}
                    alt={item.image.alt || item.title}
                    fill
                    sizes={
                      item.orientation === 'landscape'
                        ? '(min-width: 1024px) 33vw, 100vw'
                        : '(min-width: 1024px) 17vw, 50vw'
                    }
                    className="object-contain p-3 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03] md:p-4"
                  />
                </span>
                <span className="mt-3 line-clamp-2 min-h-[2lh] text-[13.5px] font-semibold leading-snug text-brand group-hover:text-accent">
                  {item.title}
                </span>
              </button>
            </Reveal>
          </li>
        ))}
      </ul>

      {items.length > INITIAL ? (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => (expanded ? collapse() : setExpanded(true))}
            className="btn btn-outline text-brand"
          >
            {expanded ? labels.less : `${labels.more} (${items.length - INITIAL})`}
            <Chevron size={16} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      ) : null}

      <dialog
        ref={dialogRef}
        aria-label={open?.title}
        onClose={() => setCurrent(null)}
        onClick={(e) => e.target === e.currentTarget && setCurrent(null)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') step(1)
          if (e.key === 'ArrowLeft') step(-1)
        }}
        className="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-brand-deep/85 backdrop:backdrop-blur-sm"
      >
        {open ? (
          <figure className="flex max-h-[92svh] w-[min(92vw,1100px)] flex-col items-center gap-4">
            <Image
              key={open.id}
              src={open.image.url}
              alt={open.image.alt || open.title}
              width={open.image.width}
              height={open.image.height}
              sizes="92vw"
              className="max-h-[78svh] w-auto bg-white object-contain p-3 shadow-2xl"
            />
            <figcaption className="flex w-full items-center justify-between gap-4 text-white">
              <span className="text-[15px] font-semibold">{open.title}</span>
              <span className="flex shrink-0 items-center gap-2">
                {visible > 1 ? (
                  <>
                    <span className="mr-2 text-[13px] tabular-nums text-white/60">
                      {(current ?? 0) + 1} / {visible}
                    </span>
                    <button type="button" onClick={() => step(-1)} aria-label={labels.prev} className={dialogButton}>
                      <ArrowLeft size={18} />
                    </button>
                    <button type="button" onClick={() => step(1)} aria-label={labels.next} className={dialogButton}>
                      <ArrowRight size={18} />
                    </button>
                  </>
                ) : null}
                <button
                  type="button"
                  onClick={() => setCurrent(null)}
                  aria-label={labels.close}
                  className={dialogButton}
                >
                  <Close size={18} />
                </button>
              </span>
            </figcaption>
          </figure>
        ) : null}
      </dialog>
    </div>
  )
}
