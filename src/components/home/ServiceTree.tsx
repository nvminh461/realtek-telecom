'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'

import { ArrowRight, Chevron } from '@/components/Icons'
import { Link } from '@/i18n/navigation'
import type { ResolvedImage } from '@/lib/media'

export type ServiceNode = { title: string; items: string[] }
export type ServiceTreeCard = {
  id: string
  href: string
  title: string
  excerpt?: string | null
  image: ResolvedImage | null
  nodes: ServiceNode[]
  /** e.g. "10 hạng mục": shown on the card and in the fan's centre. */
  nodesLabel?: string
}

/**
 * The home page's service lines. Desktop: cards side by side; hovering (or focusing) a card fans its categories
 * out as nodes above or below the card, whichever side of the viewport has room, and hovering a node shows its
 * sub-items in the fan's centre. Mobile/tablet: the cards are stacked landscape rows that open level by level
 * (card → categories → sub-items) on tap.
 */
export function ServiceTree({ cards, detailLabel }: { cards: ServiceTreeCard[]; detailLabel: string }) {
  return (
    <>
      <ul className="hidden gap-6 lg:grid" style={{ gridTemplateColumns: `repeat(${cards.length}, minmax(0, 1fr))` }}>
        {cards.map((card, i) => (
          <li key={card.id}>
            <FanCard card={card} index={i} detailLabel={detailLabel} />
          </li>
        ))}
      </ul>
      <ul className="space-y-4 lg:hidden">
        {cards.map((card, i) => (
          <li key={card.id}>
            <MobileCard card={card} index={i} detailLabel={detailLabel} />
          </li>
        ))}
      </ul>
    </>
  )
}

const number = (i: number) => String(i + 1).padStart(2, '0')

/* ---------- Desktop: fan of nodes ---------- */

const NODE = 112 // node diameter (px)
const GAP = 12 // minimum space between two nodes
const SPAN = 150 // opening angle of the fan (degrees)
const EDGE = 12 // space kept from the viewport edges

type Point = { x: number; y: number }
type FanLayout = { points: Point[]; inner: number; radius: number }
type Placement = { up: boolean; inset: number; shift: number }

const rad = (deg: number) => (deg * Math.PI) / 180

/**
 * Node centres relative to the hub on the card edge (`y` points away from the card). Nodes are spread evenly over
 * the fan in their order, one spoke each. Up to six share one arc; more alternate between an inner and an outer arc
 * (interleaved, never one behind another) so labels don't collide and every spoke passes between the inner nodes.
 * With sub-items the arc is wider, because the fan's empty centre (`inner` radius) lists the hovered node's
 * sub-items. `radius` is the fan's outer extent.
 */
function fanLayout(count: number, withItems: boolean): FanLayout {
  const twoArcs = count > 6
  const step = count > 1 ? SPAN / (count - 1) : 0
  const space = NODE + GAP
  // Neighbours on the same arc are one step apart, or two when the arcs alternate.
  const sameArc = rad(twoArcs ? 2 * step : step)
  const fit = count > 1 ? space / (2 * Math.sin(sameArc / 2)) : 0
  const r1 = Math.max(fit, withItems ? 290 : 170)
  // Smallest outer radius keeping `space` between an outer node and its inner neighbours one step away.
  const offset = r1 * Math.sin(rad(step))
  const r2 = r1 * Math.cos(rad(step)) + Math.sqrt(Math.max(space * space - offset * offset, 0))
  const points = Array.from({ length: count }, (_, i) => {
    const angle = rad((i - (count - 1) / 2) * step)
    const r = twoArcs && i % 2 ? r2 : r1
    return { x: r * Math.sin(angle), y: r * Math.cos(angle) }
  })
  return { points, inner: r1 - NODE / 2 - GAP, radius: (twoArcs ? r2 : r1) + NODE / 2 + GAP }
}

/**
 * Opens the fan on the side of the card with room for it (the fixed header doesn't count as room). If neither side
 * has enough, the hub moves into the card by the missing height (at most 45% of the card); the fan is also shifted
 * sideways to stay inside the viewport, keeping the hub on the card.
 */
function place(card: DOMRect, radius: number): Placement {
  const header = Math.max(document.querySelector('header')?.getBoundingClientRect().bottom ?? 0, 0)
  const above = card.top - header
  const below = window.innerHeight - card.bottom
  const up = above >= radius || (below < radius && above >= below)
  const inset = Math.min(Math.max(radius - (up ? above : below), 0), card.height * 0.45)

  const width = document.documentElement.clientWidth
  const hub = card.left + card.width / 2
  let shift = 0
  if (hub - radius < EDGE) shift = EDGE - (hub - radius)
  else if (hub + radius > width - EDGE) shift = width - EDGE - (hub + radius)
  const limit = card.width / 2 - 24
  return { up, inset, shift: Math.max(-limit, Math.min(limit, shift)) }
}

function FanCard({ card, index, detailLabel }: { card: ServiceTreeCard; index: number; detailLabel: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<number | undefined>(undefined)
  const pointer = useRef('mouse')
  const [open, setOpen] = useState(false)
  const [placement, setPlacement] = useState<Placement>({ up: true, inset: 0, shift: 0 })
  const [active, setActive] = useState<number | null>(null)
  const layout = useMemo(
    () =>
      fanLayout(
        card.nodes.length,
        card.nodes.some((n) => n.items.length > 0),
      ),
    [card.nodes],
  )
  const hasFan = card.nodes.length > 0
  const panelId = `fan-${card.id}`

  const show = () => {
    window.clearTimeout(closeTimer.current)
    if (open || !hasFan || !ref.current) return
    setPlacement(place(ref.current.getBoundingClientRect(), layout.radius))
    setOpen(true)
  }
  const hide = (delay = 0) => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => {
      setOpen(false)
      setActive(null)
    }, delay)
  }

  // A tap or click anywhere else closes the fan (a finger lifted off the screen sends no useful pointerleave).
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (ref.current?.contains(e.target as Node)) return
      setOpen(false)
      setActive(null)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])
  useEffect(() => () => window.clearTimeout(closeTimer.current), [])

  const { up, inset, shift } = placement
  const sign = up ? -1 : 1
  const R = layout.radius
  const current = active === null ? null : card.nodes[active]

  return (
    <div
      ref={ref}
      className={`relative h-full ${open ? 'z-30' : ''}`}
      onPointerDown={(e) => (pointer.current = e.pointerType)}
      onPointerEnter={(e) => e.pointerType !== 'touch' && show()}
      onPointerLeave={(e) => e.pointerType !== 'touch' && hide(150)}
      onFocus={show}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node | null) && hide()}
      onKeyDown={(e) => e.key === 'Escape' && hide()}
    >
      <article
        onClick={(e) => {
          // Touch screens have no hover: a tap on the card (not on a link) toggles the fan.
          if (pointer.current !== 'touch' || (e.target as Element).closest('a, button')) return
          if (open) hide()
          else show()
        }}
        className="relative flex h-full min-h-[440px] flex-col justify-end overflow-hidden bg-brand-deep p-10 text-white xl:p-12"
      >
        {card.image ? (
          <Image
            src={card.image.url}
            alt={card.image.alt || card.title}
            fill
            sizes="50vw"
            className={`object-cover transition-transform duration-[1600ms] ease-[var(--ease-out-expo)] ${open ? 'scale-105' : ''}`}
            style={card.image.focal ? { objectPosition: card.image.focal } : undefined}
          />
        ) : null}
        <span
          aria-hidden
          className={`absolute inset-0 bg-gradient-to-t from-brand-deep to-brand-deep/20 transition-colors duration-700 ${open ? 'via-brand-deep/90' : 'via-brand-deep/75'}`}
        />

        <div className="relative">
          <span className="font-display text-sm font-semibold tabular-nums text-accent">{number(index)}</span>
          <h3 className="mt-3 font-display text-[clamp(22px,2vw,30px)] font-bold uppercase leading-tight tracking-[0.02em]">
            <Link href={card.href} className="hover:text-accent">
              {card.title}
            </Link>
          </h3>
          {card.excerpt ? (
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/75">{card.excerpt}</p>
          ) : null}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
            <Link
              href={card.href}
              className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-accent"
            >
              <span className="underline-grow">{detailLabel}</span> <ArrowRight size={15} />
            </Link>
            {hasFan && card.nodesLabel ? (
              <span className="inline-flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/60">
                <FanGlyph />
                {card.nodesLabel}
              </span>
            ) : null}
          </div>
        </div>
      </article>

      {hasFan ? (
        // Zero-size box on the hub; everything inside is positioned from it.
        <div
          className="absolute left-1/2 h-0 w-0"
          style={{ top: up ? inset : `calc(100% - ${inset}px)`, transform: `translateX(${shift}px)` }}
        >
          {/* Half-disc backdrop: keeps the fan legible over any content and keeps the pointer "inside" the card */}
          <span
            aria-hidden
            className={`absolute left-0 border border-line bg-paper/95 shadow-[0_30px_80px_-40px_rgb(7_37_82/0.55)] backdrop-blur-md transition-[opacity,transform] duration-500 ease-[var(--ease-out-expo)] ${
              up ? 'bottom-0 origin-bottom rounded-t-full border-b-0' : 'top-0 origin-top rounded-b-full border-t-0'
            } ${open ? 'scale-100 opacity-100' : 'pointer-events-none scale-50 opacity-0'}`}
            style={{ width: 2 * R, height: R, marginLeft: -R }}
          />

          <svg aria-hidden className="pointer-events-none absolute left-0 top-0 overflow-visible" width="1" height="1">
            {layout.points.map((p, i) => (
              <line
                key={i}
                x1={0}
                y1={0}
                x2={p.x}
                y2={sign * p.y}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={open ? 0 : 1}
                className={`transition-[stroke-dashoffset] duration-700 ease-[var(--ease-out-expo)] ${active === i ? 'stroke-accent' : 'stroke-brand/20'}`}
                style={{ transitionDelay: open ? `${i * 35}ms` : '0ms' }}
              />
            ))}
          </svg>

          <span
            aria-hidden
            className={`absolute left-0 top-0 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent ring-4 ring-accent/25 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* Centre: the hovered node's sub-items, otherwise the category count */}
          <div
            id={panelId}
            aria-live="polite"
            className={`absolute left-0 flex -translate-x-1/2 flex-col items-center text-center transition-opacity duration-300 ${
              up ? 'bottom-6 justify-end' : 'top-6 justify-start'
            } ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            style={{ width: Math.min(340, layout.inner * 1.7), maxHeight: layout.inner * 0.95 }}
          >
            {current?.items.length ? (
              <div key={active} className="fan-panel">
                <p className="font-display text-[13px] font-bold uppercase tracking-[0.08em] text-brand">
                  {current.title}
                </p>
                <ul className="mt-3 flex flex-wrap justify-center gap-1.5">
                  {current.items.map((item, j) => (
                    <li
                      key={j}
                      className="rounded-full border border-brand/15 bg-white px-3 py-1 text-[12.5px] leading-snug text-ink"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : card.nodesLabel ? (
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-soft">{card.nodesLabel}</p>
            ) : null}
          </div>

          <ul aria-label={card.title} className="absolute left-0 top-0">
            {card.nodes.map((node, i) => {
              const p = layout.points[i]
              const hasItems = node.items.length > 0
              const on = active === i
              const style: CSSProperties = {
                width: NODE,
                height: NODE,
                transform: open
                  ? `translate(${p.x}px, ${sign * p.y}px) translate(-50%, -50%)`
                  : 'translate(-50%, -50%) scale(0.4)',
                transitionDelay: open ? `${i * 35}ms` : '0ms',
              }
              const face = `flex h-full w-full flex-col items-center justify-center rounded-full border px-3.5 text-center text-[12.5px] font-semibold leading-snug shadow-[0_12px_28px_-16px_rgb(7_37_82/0.6)] transition-colors duration-300 ${
                on ? 'border-brand bg-brand text-white' : 'border-line bg-white text-brand'
              }`
              return (
                <li
                  key={i}
                  style={style}
                  onPointerEnter={() => setActive(i)}
                  className={`absolute left-0 top-0 transition-[transform,opacity] duration-500 ease-[var(--ease-out-expo)] ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
                >
                  {hasItems ? (
                    <button
                      type="button"
                      aria-expanded={on}
                      aria-controls={panelId}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      className={`${face} cursor-default`}
                    >
                      {node.title}
                      <span className={`mt-1 text-[11px] tabular-nums ${on ? 'text-accent-soft' : 'text-accent'}`}>
                        {node.items.length}
                      </span>
                    </button>
                  ) : (
                    <span className={face}>{node.title}</span>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

/** Small fan icon next to the category count. */
function FanGlyph() {
  return (
    <svg aria-hidden width="18" height="12" viewBox="0 0 18 12" fill="currentColor" className="text-accent">
      <circle cx="9" cy="11" r="1.6" />
      <circle cx="2" cy="7" r="1.6" />
      <circle cx="5.5" cy="2.5" r="1.6" />
      <circle cx="12.5" cy="2.5" r="1.6" />
      <circle cx="16" cy="7" r="1.6" />
    </svg>
  )
}

function MobileCard({ card, index, detailLabel }: { card: ServiceTreeCard; index: number; detailLabel: string }) {
  const [open, setOpen] = useState(false)
  const [openNode, setOpenNode] = useState<number | null>(null)
  const panelId = `service-${card.id}`
  return (
    <article className="overflow-hidden border border-line bg-white">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-stretch text-left"
      >
        <span className="relative w-28 shrink-0 bg-brand-deep sm:w-44">
          {card.image ? (
            <Image
              src={card.image.url}
              alt=""
              fill
              sizes="176px"
              className="object-cover"
              style={card.image.focal ? { objectPosition: card.image.focal } : undefined}
            />
          ) : null}
        </span>
        <span className="flex min-h-28 flex-1 items-center gap-3 p-4 sm:p-5">
          <span className="flex-1">
            <span className="block font-display text-xs font-semibold tabular-nums text-accent">{number(index)}</span>
            <span className="mt-1 block font-display text-[15px] font-bold uppercase leading-snug text-brand sm:text-base">
              {card.title}
            </span>
          </span>
          <Chevron size={18} className={`shrink-0 text-brand transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>

      <div
        id={panelId}
        className={`grid transition-[grid-template-rows] duration-500 ease-[var(--ease-out-expo)] ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-line p-4 sm:p-5">
            {card.excerpt ? <p className="text-[14px] leading-relaxed text-ink-soft">{card.excerpt}</p> : null}
            {card.nodes.length ? (
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {card.nodes.map((node, i) => {
                  const hasItems = node.items.length > 0
                  const nodeOpen = openNode === i
                  return (
                    <li key={i}>
                      {hasItems ? (
                        <button
                          type="button"
                          aria-expanded={nodeOpen}
                          onClick={() => setOpenNode(nodeOpen ? null : i)}
                          tabIndex={open ? undefined : -1}
                          className="flex w-full items-center gap-3 py-3 text-left text-[14px] font-semibold text-brand"
                        >
                          <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          <span className="flex-1">{node.title}</span>
                          <Chevron
                            size={15}
                            className={`shrink-0 transition-transform ${nodeOpen ? 'rotate-180' : ''}`}
                          />
                        </button>
                      ) : (
                        <p className="flex items-center gap-3 py-3 text-[14px] font-medium text-ink">
                          <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          {node.title}
                        </p>
                      )}
                      {hasItems ? (
                        <div
                          className={`grid transition-[grid-template-rows] duration-500 ease-[var(--ease-out-expo)] ${nodeOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                        >
                          <ul className="overflow-hidden">
                            {node.items.map((item, j) => (
                              <li
                                key={j}
                                className="relative ml-[3px] border-l border-line py-1.5 pl-5 text-[13.5px] text-ink-soft first:mt-0 last:mb-3"
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </li>
                  )
                })}
              </ul>
            ) : null}
            <Link
              href={card.href}
              tabIndex={open ? undefined : -1}
              className="mt-4 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-brand"
            >
              {detailLabel} <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
