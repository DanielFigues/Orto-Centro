import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from 'react'
import type { Product } from '../../types/product'
import { Icon } from '../ui/Icon'
import { ProductCard } from './ProductCard'

interface ProductCarouselProps {
  products: Product[]
  ariaLabel?: string
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

export function ProductCarousel({
  products,
  ariaLabel = 'Produtos em destaque',
}: ProductCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragState>({ ...initialDragState })
  const [progress, setProgress] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const updateState = useCallback(() => {
    const track = trackRef.current
    if (!track) return

    const maxScroll = track.scrollWidth - track.clientWidth
    setProgress(maxScroll > 0 ? (track.scrollLeft / maxScroll) * 100 : 0)
    setCanScrollPrev(track.scrollLeft > 1)
    setCanScrollNext(track.scrollLeft < maxScroll - 1)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    updateState()
    track.addEventListener('scroll', updateState, { passive: true })
    window.addEventListener('resize', updateState)

    return () => {
      track.removeEventListener('scroll', updateState)
      window.removeEventListener('resize', updateState)
    }
  }, [products.length, updateState])

  const scrollByCard = (direction: -1 | 1) => {
    const track = trackRef.current
    if (!track) return

    const card = track.querySelector<HTMLElement>('[data-product-carousel-item]')
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0
    const step = card ? card.offsetWidth + gap : track.clientWidth * 0.8

    track.scrollBy({
      left: direction * step,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
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

  return (
    <div>
      <div
        ref={trackRef}
        className="product-carousel-track hide-scrollbar focus-ring cursor-grab active:cursor-grabbing"
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
      >
        {products.map((product) => (
          <div
            key={product.id}
            data-product-carousel-item
            className="product-carousel-item"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-4">
        <div
          aria-hidden="true"
          className="h-1 flex-1 overflow-hidden rounded-pill bg-neutral-200 dark:bg-neutral-800"
        >
          <div
            className="h-full rounded-pill bg-sky-700 dark:bg-sky-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canScrollPrev}
            aria-label="Ver produtos anteriores"
            className="focus-ring tap-target inline-flex items-center justify-center rounded-pill border border-neutral-300 bg-white text-neutral-700 transition-colors hover:border-neutral-400 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-500 dark:hover:text-white"
          >
            <Icon name="chevron-left" className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canScrollNext}
            aria-label="Ver próximos produtos"
            className="focus-ring tap-target inline-flex items-center justify-center rounded-pill border border-neutral-300 bg-white text-neutral-700 transition-colors hover:border-neutral-400 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-500 dark:hover:text-white"
          >
            <Icon name="chevron-right" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
