import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
import { Icon } from './Icon'

interface CardsPerView {
  base?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
}

interface ScrollRailProps {
  children: ReactNode
  ariaLabel: string
  className?: string
  trackClassName?: string
  itemClassName?: string
  /** When true, positions nav arrows centered on a square (1:1) image area at the top of items. */
  arrowsOnSquareImage?: boolean
  prevAriaLabel?: string
  nextAriaLabel?: string
  /** Override default cards-per-view (including peeking fraction) at breakpoints. */
  cardsPerView?: CardsPerView
}

interface DragState {
  active: boolean
  moved: boolean
  pointerId: number
  startX: number
  scrollLeft: number
}

const initialDragState: DragState = {
  active: false,
  moved: false,
  pointerId: -1,
  startX: 0,
  scrollLeft: 0,
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function isCoarsePointer() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: coarse)').matches
  )
}

export function ScrollRail({
  children,
  ariaLabel,
  className = '',
  trackClassName = '',
  itemClassName = '',
  arrowsOnSquareImage = false,
  prevAriaLabel = 'Ver itens anteriores',
  nextAriaLabel = 'Ver próximos itens',
  cardsPerView,
}: ScrollRailProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragState>({ ...initialDragState })
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [arrowTop, setArrowTop] = useState<number | null>(null)
  const [coarsePointer, setCoarsePointer] = useState(false)

  const updateState = useCallback(() => {
    const track = trackRef.current
    if (!track) return

    const maxScroll = track.scrollWidth - track.clientWidth
    setCanScrollPrev(track.scrollLeft > 1)
    setCanScrollNext(track.scrollLeft < maxScroll - 1)

    if (arrowsOnSquareImage) {
      const rail = track.parentElement
      const firstItem = track.querySelector<HTMLElement>('[data-scroll-rail-item]')
      if (rail && firstItem) {
        const railRect = rail.getBoundingClientRect()
        const itemRect = firstItem.getBoundingClientRect()
        // Square image area at top: center is half of item width
        setArrowTop(itemRect.top - railRect.top + itemRect.width / 2)
      }
    }
  }, [arrowsOnSquareImage])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    setCoarsePointer(isCoarsePointer())
    updateState()
    track.addEventListener('scroll', updateState, { passive: true })
    window.addEventListener('resize', updateState)

    let resizeObserver: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => updateState())
      resizeObserver.observe(track)
      const firstItem = track.querySelector<HTMLElement>('[data-scroll-rail-item]')
      if (firstItem) resizeObserver.observe(firstItem)
    }

    return () => {
      track.removeEventListener('scroll', updateState)
      window.removeEventListener('resize', updateState)
      resizeObserver?.disconnect()
    }
  }, [children, updateState])

  const scrollByItem = (direction: -1 | 1) => {
    const track = trackRef.current
    if (!track) return

    const item = track.querySelector<HTMLElement>('[data-scroll-rail-item]')
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 16
    const step = item ? item.offsetWidth + gap : track.clientWidth * 0.8

    track.scrollBy({
      left: direction * step,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    // Mouse drag only; never hijack touch (native scroll handles touch)
    if (event.pointerType !== 'mouse' || event.button !== 0) {
      dragRef.current = { ...initialDragState }
      return
    }

    const track = trackRef.current
    if (!track) return

    dragRef.current = {
      active: true,
      moved: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: track.scrollLeft,
    }
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const track = trackRef.current
    const drag = dragRef.current
    if (!track || !drag.active || drag.pointerId !== event.pointerId) return

    const distance = event.clientX - drag.startX
    if (!drag.moved && Math.abs(distance) > 4) {
      drag.moved = true
      track.setPointerCapture(event.pointerId)
      track.style.scrollSnapType = 'none'
      track.style.scrollBehavior = 'auto'
    }

    if (drag.moved) {
      event.preventDefault()
      track.scrollLeft = drag.scrollLeft - distance
    }
  }

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const track = trackRef.current
    const drag = dragRef.current
    if (!track || !drag.active || drag.pointerId !== event.pointerId) return

    drag.active = false
    track.style.scrollSnapType = ''
    track.style.scrollBehavior = ''
    if (track.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId)
    }
  }

  const handleClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!dragRef.current.moved) return

    event.preventDefault()
    event.stopPropagation()
    dragRef.current.moved = false
  }

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      scrollByItem(1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      scrollByItem(-1)
    }
  }

  const items = Children.toArray(children).filter(isValidElement)
  const showArrows = !coarsePointer && (canScrollPrev || canScrollNext)
  const trackStyle = cardsPerView
    ? ({
        ...(cardsPerView.base != null
          ? { ['--rail-cards-base' as string]: String(cardsPerView.base) }
          : {}),
        ...(cardsPerView.sm != null
          ? { ['--rail-cards-sm' as string]: String(cardsPerView.sm) }
          : {}),
        ...(cardsPerView.md != null
          ? { ['--rail-cards-md' as string]: String(cardsPerView.md) }
          : {}),
        ...(cardsPerView.lg != null
          ? { ['--rail-cards-lg' as string]: String(cardsPerView.lg) }
          : {}),
        ...(cardsPerView.xl != null
          ? { ['--rail-cards-xl' as string]: String(cardsPerView.xl) }
          : {}),
      } as CSSProperties)
    : undefined

  return (
    <div className={`scroll-rail ${className}`}>
      <div
        ref={trackRef}
        className={`scroll-rail-track hide-scrollbar focus-ring ${trackClassName}`}
        role="region"
        aria-roledescription="carrossel"
        aria-label={ariaLabel}
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={handleClickCapture}
        onDragStart={(event) => event.preventDefault()}
        onKeyDown={handleKeyDown}
        style={trackStyle}
      >
        {items.map((child, index) => (
          <div
            key={child.key ?? index}
            data-scroll-rail-item
            className={`scroll-rail-item ${itemClassName}`}
          >
            {child}
          </div>
        ))}
      </div>

      {showArrows ? (
        <>
          {canScrollPrev ? (
            <button
              type="button"
              onClick={() => scrollByItem(-1)}
              aria-label={prevAriaLabel}
              className="scroll-rail-arrow scroll-rail-arrow-prev focus-ring"
              style={arrowTop != null ? { top: arrowTop } : undefined}
            >
              <Icon name="chevron-left" className="h-5 w-5" />
            </button>
          ) : null}
          {canScrollNext ? (
            <button
              type="button"
              onClick={() => scrollByItem(1)}
              aria-label={nextAriaLabel}
              className="scroll-rail-arrow scroll-rail-arrow-next focus-ring"
              style={arrowTop != null ? { top: arrowTop } : undefined}
            >
              <Icon name="chevron-right" className="h-5 w-5" />
            </button>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
