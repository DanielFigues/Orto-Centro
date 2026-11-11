import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../../types/product'
import { formatPrice } from '../../lib/formatPrice'
import { Icon } from '../ui/Icon'

const DURATION = 7000

type InteractionSource = 'manual'

interface FeaturedShowcaseProps {
  products: Product[]
  ariaLabel?: string
}

function displayName(name: string): string {
  return name.replace(/Todo-Terreno/g, 'Todo\u2011Terreno')
}

function getFocalPoint(product: Product): string {
  if (product.focalPoint) return product.focalPoint
  const key = `${product.name} ${product.image_url}`.toLowerCase()
  if (key.includes('cadeira-rodas') || key.includes('cadeira de rodas')) {
    return 'center 40%'
  }
  if (key.includes('andador') || key.includes('walker')) {
    return 'center 45%'
  }
  if (key.includes('banho') || key.includes('assento') || key.includes('assento-banho')) {
    return 'center 45%'
  }
  if (key.includes('barra') || key.includes('corrimao') || key.includes('apoio para banheiro')) {
    return 'center 50%'
  }
  if (key.includes('talher') || key.includes('cutlery')) {
    return 'center 50%'
  }
  if (key.includes('almofada') || key.includes('pillow') || key.includes('travesseiro')) {
    return 'center 50%'
  }
  return 'center'
}

export function FeaturedShowcase({
  products,
  ariaLabel = 'Produtos em destaque',
}: FeaturedShowcaseProps) {
  const items = products.slice(0, 6)
  const [activeIndex, setActiveIndex] = useState(0)
  const [stoppedForever, setStoppedForever] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocusWithin, setIsFocusWithin] = useState(false)
  const [isTouching, setIsTouching] = useState(false)
  const [isTabHidden, setIsTabHidden] = useState(
    typeof document === 'undefined' ? false : document.hidden,
  )
  const [isInView, setIsInView] = useState(true)
  const [reduceMotion, setReduceMotion] = useState(false)

  const rootRef = useRef<HTMLElement | null>(null)
  const activeFillRef = useRef<HTMLSpanElement | null>(null)
  const elapsedRef = useRef(0)
  const lastTimestampRef = useRef<number | null>(null)
  const rafIdRef = useRef<number | null>(null)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const instanceId = useId()

  const count = items.length
  const safeActive = count === 0 ? 0 : Math.min(activeIndex, count - 1)
  const nextIndex = count <= 1 ? 0 : (safeActive + 1) % count

  useEffect(() => {
    if (import.meta.env.DEV && typeof window !== 'undefined') {
      // Requested diagnostic: OS-level reduced-motion preference
      console.log(
        '[FeaturedShowcase] prefers-reduced-motion:',
        window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      )
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    const onVisibility = () => setIsTabHidden(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const node = rootRef.current
    if (!node || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.35 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const shouldRun =
    !isHovered &&
    !isFocusWithin &&
    !isTouching &&
    !isTabHidden &&
    isInView &&
    !stoppedForever &&
    !reduceMotion &&
    count > 1

  const setFillProgress = useCallback((progress: number) => {
    const el = activeFillRef.current
    if (!el) return
    el.style.transform = `scaleX(${progress})`
  }, [])

  const resetProgressForActive = useCallback(() => {
    elapsedRef.current = 0
    lastTimestampRef.current = null
    if (stoppedForever || reduceMotion) {
      setFillProgress(1)
    } else {
      setFillProgress(0)
    }
  }, [stoppedForever, reduceMotion, setFillProgress])

  useEffect(() => {
    // Reset progress when the active slide changes or autoplay becomes permanently stopped/reduced.
    resetProgressForActive()
  }, [safeActive, resetProgressForActive])

  useEffect(() => {
    if (!shouldRun) {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
      lastTimestampRef.current = null
      return
    }

    const tick = (now: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = now
      }
      const delta = now - lastTimestampRef.current
      lastTimestampRef.current = now
      elapsedRef.current = Math.min(elapsedRef.current + delta, DURATION)
      const progress = Math.min(elapsedRef.current / DURATION, 1)
      setFillProgress(progress)

      if (progress >= 1) {
        rafIdRef.current = null
        elapsedRef.current = 0
        lastTimestampRef.current = null
        setActiveIndex((i) => (count === 0 ? 0 : (i + 1) % count))
        return
      }

      rafIdRef.current = requestAnimationFrame(tick)
    }

    // Reset timestamp on resume to avoid a jump (elapsed is preserved).
    lastTimestampRef.current = null
    rafIdRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
      lastTimestampRef.current = null
    }
  }, [shouldRun, count, setFillProgress])

  const goTo = useCallback(
    (index: number, source?: InteractionSource) => {
      if (count === 0) return
      const next = ((index % count) + count) % count
      setActiveIndex(next)
      elapsedRef.current = 0
      lastTimestampRef.current = null
      if (source === 'manual') {
        setStoppedForever(true)
      }
    },
    [count],
  )

  const goNext = useCallback(
    (source?: InteractionSource) => goTo(safeActive + 1, source),
    [goTo, safeActive],
  )

  const goPrev = useCallback(
    (source?: InteractionSource) => goTo(safeActive - 1, source),
    [goTo, safeActive],
  )

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goNext('manual')
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goPrev('manual')
    }
  }

  const onTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    setIsTouching(true)
    const touch = event.touches[0]
    touchStartX.current = touch?.clientX ?? null
    touchStartY.current = touch?.clientY ?? null
  }

  const onTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    setIsTouching(false)
    const startX = touchStartX.current
    const startY = touchStartY.current
    touchStartX.current = null
    touchStartY.current = null
    if (startX === null || startY === null) return
    const touch = event.changedTouches[0]
    if (!touch) return
    const dx = touch.clientX - startX
    const dy = touch.clientY - startY
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return
    if (dx < 0) goNext('manual')
    else goPrev('manual')
  }

  const onTouchCancel = () => {
    setIsTouching(false)
    touchStartX.current = null
    touchStartY.current = null
  }

  const liveMode = shouldRun ? 'off' : 'polite'
  const ariaNote = reduceMotion ? ' Movimento reduzido: avanço automático desativado.' : ''
  const sectionLabel = `${ariaLabel}.${ariaNote}`

  if (count === 0) return null

  return (
    <section
      ref={rootRef}
      role="group"
      aria-roledescription="carousel"
      aria-label={sectionLabel}
      className="container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocusWithin(true)}
      onBlur={(event) => {
        const next = event.relatedTarget as Node | null
        if (!next || !event.currentTarget.contains(next)) {
          setIsFocusWithin(false)
        }
      }}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchCancel}
      tabIndex={0}
    >
      <div
        className="relative flex overflow-hidden rounded-[12px] border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
        style={{ height: 'clamp(420px, 56svh, 620px)' }}
      >
        {items.map((product, index) => {
          const isActive = index === safeActive
          const isNext = index === nextIndex
          const description = (product.short_description ?? product.description ?? '')
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
          const title = displayName(product.name)
          const slideId = `${instanceId}-slide-${product.id}`
          const labelId = `${instanceId}-label-${product.id}`
          const inertProps = !isActive ? ({ inert: '' } as Record<string, string>) : {}
          const formattedPrice = formatPrice(product.price)
          const focalPoint = getFocalPoint(product)

          return (
            <article
              key={product.id}
              id={slideId}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} de ${count}: ${product.name}`}
              aria-hidden={!isActive}
              {...inertProps}
              className={`absolute inset-0 grid h-full min-h-0 grid-cols-1 lg:grid-cols-[40%_60%] ${
                reduceMotion ? '' : 'transition-opacity duration-[400ms]'
              } ${isActive ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            >
              <div className="flex h-full min-h-0 flex-col justify-center gap-4 [padding:clamp(24px,3vw,56px)] lg:order-1">
                <p className="text-label font-medium uppercase tracking-wide text-sky-700 dark:text-sky-300">
                  {product.category}
                </p>
                <h3
                  id={labelId}
                  className="max-w-[20ch] text-[clamp(1.5rem,2.4vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-neutral-900 [hyphens:manual] [text-wrap:balance] dark:text-white"
                >
                  {title}
                </h3>
                {description ? (
                  <p className="max-w-[60ch] text-body leading-relaxed text-neutral-600 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden dark:text-neutral-300">
                    {description}
                  </p>
                ) : null}
                {formattedPrice ? (
                  <p className="text-[22px] font-semibold text-neutral-900 dark:text-white">
                    {formattedPrice}
                  </p>
                ) : null}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Link
                    to={`/produto/${product.id}`}
                    className="focus-ring inline-flex min-h-12 items-center justify-center rounded-button bg-sky-700 px-5 text-body font-medium text-white transition-colors hover:bg-sky-800 dark:bg-sky-300 dark:text-neutral-950 dark:hover:bg-sky-200"
                  >
                    Ver produto
                  </Link>
                </div>
              </div>

              <Link
                to={`/produto/${product.id}`}
                className="focus-ring relative order-first block h-full min-h-0 w-full overflow-hidden lg:order-2"
                aria-label={`Ver produto ${product.name}`}
                tabIndex={isActive ? 0 : -1}
              >
                <div className="relative aspect-[4/3] h-full min-h-0 w-full lg:aspect-auto">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      width={1200}
                      height={900}
                      loading={isActive || isNext ? 'eager' : 'lazy'}
                      decoding="async"
                      fetchPriority={isActive ? 'high' : 'auto'}
                      className="absolute inset-0 h-full w-full object-cover"
                      style={{ objectPosition: focalPoint }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800">
                      <Icon
                        name="tools"
                        className="h-20 w-20 text-sky-600 dark:text-sky-400"
                      />
                    </div>
                  )}
                </div>
              </Link>
            </article>
          )
        })}
      </div>

      <div className="mt-4 w-full">
        <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6" aria-label="Selecionar produto em destaque">
          {items.map((product, index) => {
            const isActive = index === safeActive
            const isPast = index < safeActive

            return (
              <button
                key={product.id}
                type="button"
                aria-current={isActive ? 'true' : undefined}
                aria-label={`Ver ${product.name}`}
                aria-controls={`${instanceId}-slide-${product.id}`}
                onClick={() => goTo(index, 'manual')}
                className="focus-ring group flex min-h-11 flex-col items-stretch justify-center gap-1 text-left"
              >
                <span className="relative block h-1 w-full overflow-hidden rounded-[2px] bg-neutral-300 dark:bg-neutral-700">
                  {isPast ? (
                    <span
                      className="absolute inset-y-0 left-0 w-full origin-left rounded-[2px] bg-sky-700 opacity-55 dark:bg-sky-400"
                      style={{ transform: 'scaleX(1)', transformOrigin: 'left', willChange: 'transform', transition: 'none' }}
                    />
                  ) : isActive ? (
                    <span
                      ref={activeFillRef}
                      className="absolute inset-y-0 left-0 w-full origin-left rounded-[2px] bg-sky-700 dark:bg-sky-400"
                      style={{
                        transform: stoppedForever || reduceMotion ? 'scaleX(1)' : 'scaleX(0)',
                        transformOrigin: 'left',
                        willChange: 'transform',
                        transition: 'none',
                      }}
                    />
                  ) : (
                    <span
                      className="absolute inset-y-0 left-0 w-full origin-left rounded-[2px] bg-sky-700 dark:bg-sky-400"
                      style={{ transform: 'scaleX(0)', transformOrigin: 'left', willChange: 'transform', transition: 'none' }}
                    />
                  )}
                </span>
                <span
                  className={`hidden truncate text-label font-medium lg:block ${
                    isActive
                      ? 'text-neutral-900 dark:text-white'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  {displayName(product.name)}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <p className="sr-only" aria-live={liveMode} aria-atomic="true">
        {`Produto ${safeActive + 1} de ${count}: ${items[safeActive]?.name ?? ''}`}
      </p>
    </section>
  )
}
