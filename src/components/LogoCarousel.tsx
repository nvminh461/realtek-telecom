'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'

export type CarouselLogo = {
  id: string
  name: string
  url?: string | null
  src: string
  width: number
  height: number
  unoptimized?: boolean
}

/** Pixels per second of the automatic scroll. */
const SPEED = 36
/** A pointer that moved further than this was a drag, not a click. */
const DRAG_THRESHOLD = 6

/**
 * Endless row of logo cards that scrolls on its own and can be dragged with the mouse or swiped on touch screens
 * (with a short glide after a flick). The position is written straight to the DOM from a rAF loop, never React state.
 * `reverse` scrolls left-to-right. Hovering pauses it; so does being off-screen or prefers-reduced-motion.
 */
export function LogoCarousel({ logos, reverse = false }: { logos: CarouselLogo[]; reverse?: boolean }) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const dragged = useRef(false)

  // Repeat until one copy is wide enough, then render it twice so wrapping at half the width is seamless.
  const copy = Array.from({ length: Math.max(1, Math.ceil(10 / logos.length)) }, () => logos).flat()

  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const direction = reverse ? 1 : -1

    let half = track.scrollWidth / 2
    let offset = reverse ? -half : 0
    let velocity = 0 // px per ms, after a flick
    let hovered = false
    let visible = true
    let pointer: { id: number; startX: number; startOffset: number; lastX: number; lastT: number } | null = null
    let frame = 0
    let last = performance.now()

    const wrap = () => {
      if (half <= 0) return
      offset = ((offset % half) - half) % half // keep within (-half, 0]
    }
    const render = () => {
      track.style.transform = `translate3d(${Math.round(offset)}px,0,0)`
    }

    const tick = (now: number) => {
      const dt = Math.min(now - last, 64)
      last = now
      if (!pointer) {
        if (Math.abs(velocity) > 0.02) {
          offset += velocity * dt
          velocity *= Math.pow(0.94, dt / 16)
        } else if (!hovered && visible && !reduceMotion) {
          offset += (direction * SPEED * dt) / 1000
        }
      }
      wrap()
      render()
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      pointer = { id: e.pointerId, startX: e.clientX, startOffset: offset, lastX: e.clientX, lastT: e.timeStamp }
      velocity = 0
      dragged.current = false
    }
    const onMove = (e: PointerEvent) => {
      if (!pointer || e.pointerId !== pointer.id) return
      const dx = e.clientX - pointer.startX
      if (!dragged.current && Math.abs(dx) > DRAG_THRESHOLD) {
        dragged.current = true
        viewport.setPointerCapture(e.pointerId)
      }
      if (!dragged.current) return
      const dt = Math.max(1, e.timeStamp - pointer.lastT)
      velocity = (e.clientX - pointer.lastX) / dt
      pointer.lastX = e.clientX
      pointer.lastT = e.timeStamp
      offset = pointer.startOffset + dx
      wrap()
      render()
    }
    const onUp = (e: PointerEvent) => {
      if (!pointer || e.pointerId !== pointer.id) return
      if (viewport.hasPointerCapture(e.pointerId)) viewport.releasePointerCapture(e.pointerId)
      // A drag that ended still (no flick) should not glide.
      if (e.timeStamp - pointer.lastT > 80) velocity = 0
      pointer = null
    }
    const onEnter = () => (hovered = true)
    const onLeave = () => (hovered = false)

    viewport.addEventListener('pointerdown', onDown)
    viewport.addEventListener('pointermove', onMove)
    viewport.addEventListener('pointerup', onUp)
    viewport.addEventListener('pointercancel', onUp)
    viewport.addEventListener('mouseenter', onEnter)
    viewport.addEventListener('mouseleave', onLeave)
    const ro = new ResizeObserver(() => {
      half = track.scrollWidth / 2
      wrap()
    })
    ro.observe(track)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    io.observe(viewport)

    return () => {
      cancelAnimationFrame(frame)
      viewport.removeEventListener('pointerdown', onDown)
      viewport.removeEventListener('pointermove', onMove)
      viewport.removeEventListener('pointerup', onUp)
      viewport.removeEventListener('pointercancel', onUp)
      viewport.removeEventListener('mouseenter', onEnter)
      viewport.removeEventListener('mouseleave', onLeave)
      ro.disconnect()
      io.disconnect()
    }
  }, [reverse])

  const card =
    'flex h-24 w-44 items-center justify-center border border-line bg-white px-5 shadow-[0_8px_24px_-16px_rgb(7_37_82/0.35)] transition-colors duration-300 hover:border-accent md:h-28 md:w-52'

  return (
    <div
      ref={viewportRef}
      className="logo-carousel relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]"
      // A drag must not open the logo's link.
      onClickCapture={(e) => {
        if (dragged.current) {
          e.preventDefault()
          e.stopPropagation()
        }
      }}
    >
      <ul ref={trackRef} className="flex w-max items-center py-2 will-change-transform">
        {[0, 1].map((round) =>
          copy.map((logo, i) => {
            const hidden = round === 1 || i >= logos.length
            const image = (
              <Image
                src={logo.src}
                alt={logo.name}
                width={logo.width}
                height={logo.height}
                unoptimized={logo.unoptimized}
                draggable={false}
                className="pointer-events-none h-12 w-auto max-w-[128px] object-contain md:h-14 md:max-w-[148px]"
              />
            )
            return (
              <li key={`${round}-${i}-${logo.id}`} className="px-2.5 md:px-3" aria-hidden={hidden}>
                {logo.url ? (
                  <a
                    href={logo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    draggable={false}
                    tabIndex={hidden ? -1 : undefined}
                    className={card}
                  >
                    {image}
                  </a>
                ) : (
                  <div className={card}>{image}</div>
                )}
              </li>
            )
          }),
        )}
      </ul>
    </div>
  )
}
