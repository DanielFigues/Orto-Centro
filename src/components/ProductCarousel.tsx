import { useCallback, useEffect, useMemo, useRef } from 'react'
import {
  ALL_CATEGORIES,
  ALL_SUBCATEGORIES,
  useCatalog,
} from '../context/CatalogContext'
import { CatalogEmptyState } from './catalog/CatalogEmptyState'
import { CatalogProductCard } from './catalog/CatalogProductCard'
import { Icon } from './ui/Icon'

const AUTO_SCROLL_INTERVAL_MS = 3000
const CARD_GAP_PX = 20

export function ProductCarousel() {
  const {
    activeProducts,
    selectedCategory,
    selectedSubcategory,
    resetFilters,
  } = useCatalog()

  const scrollRef = useRef<HTMLDivElement>(null)
  const isPausedRef = useRef(false)

  const filteredProducts = useMemo(
    () =>
      activeProducts.filter(
        (product) =>
          (selectedCategory === ALL_CATEGORIES ||
            product.category === selectedCategory) &&
          (selectedSubcategory === ALL_SUBCATEGORIES ||
            product.subcategory === selectedSubcategory),
      ),
    [activeProducts, selectedCategory, selectedSubcategory],
  )

  const scrollByCard = useCallback((direction: 1 | -1) => {
    const container = scrollRef.current
    if (container === null) return

    const card = container.querySelector<HTMLElement>('[data-carousel-card]')
    if (card === null) return

    container.scrollBy({
      left: direction * (card.offsetWidth + CARD_GAP_PX),
      behavior: 'smooth',
    })
  }, [])

  useEffect(() => {
    const container = scrollRef.current
    if (container === null) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timer = window.setInterval(() => {
      if (isPausedRef.current) return

      const card = container.querySelector<HTMLElement>('[data-carousel-card]')
      if (card === null) return

      const atEnd =
        container.scrollLeft + container.clientWidth >= container.scrollWidth - 8

      if (atEnd) {
        container.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        container.scrollBy({
          left: card.offsetWidth + CARD_GAP_PX,
          behavior: 'smooth',
        })
      }
    }, AUTO_SCROLL_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [filteredProducts.length])

  const pause = () => {
    isPausedRef.current = true
  }

  const resume = () => {
    isPausedRef.current = false
  }

  return (
    <section
      id="catalogo"
      aria-labelledby="produtos-titulo"
      className="scroll-mt-40"
    >
      <div className="flex items-end justify-between gap-4 border-b border-neutral-200 pb-3 dark:border-neutral-800">
        <div>
          <h2
            id="produtos-titulo"
            className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white"
          >
            Produtos
          </h2>
          <p
            className="mt-1 text-sm text-neutral-500 dark:text-neutral-400"
            aria-live="polite"
          >
            {filteredProducts.length}{' '}
            {filteredProducts.length === 1 ? 'produto' : 'produtos'} em destaque
          </p>
        </div>

        {filteredProducts.length > 1 && (
          <div className="hidden shrink-0 gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Produtos anteriores"
              className="rounded-full border border-neutral-200 bg-white p-2.5 text-neutral-600 transition-colors hover:border-sky-400 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-sky-500 dark:hover:text-sky-300"
            >
              <Icon name="chevron-left" className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Próximos produtos"
              className="rounded-full border border-neutral-200 bg-white p-2.5 text-neutral-600 transition-colors hover:border-sky-400 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-sky-500 dark:hover:text-sky-300"
            >
              <Icon name="chevron-right" className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="mt-5">
          <CatalogEmptyState onResetFilters={resetFilters} />
        </div>
      ) : (
        <div
          ref={scrollRef}
          data-carousel
          onMouseEnter={pause}
          onMouseLeave={resume}
          onFocusCapture={pause}
          onBlurCapture={resume}
          className="hide-scrollbar relative mt-5 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-1 -mx-4 px-4 sm:-mx-6 sm:px-6"
          tabIndex={0}
          aria-label="Carrossel de produtos"
        >
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              data-carousel-card
              className="w-72 shrink-0 snap-start sm:w-80"
            >
              <CatalogProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
