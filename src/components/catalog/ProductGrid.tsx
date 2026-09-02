import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import {
  categoryOptions,
  filterCatalog,
  loadCatalog,
  type CatalogProduct,
  type CatalogSource,
} from '../../lib/catalog'
import { categories } from '../../data/products'
import FadeContent from '../bits/FadeContent'
import SpotlightCard from '../bits/SpotlightCard'
import { Icon } from '../ui/Icon'
import { CatalogCard } from './CatalogCard'
import { EmptyState } from './EmptyState'
import { SkeletonCard } from './SkeletonCard'

function categorySlugFromHash(): string {
  const match = window.location.hash.match(/^#categoria-(.+)$/)
  return match ? match[1] : ''
}

function categoryNameFromHash(): string {
  const slug = categorySlugFromHash()
  if (slug === '') return 'all'
  return categories.find((c) => c.id === slug)?.name ?? slug
}

const GRID_CLASSES =
  'mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'

export function ProductGrid() {
  const [products, setProducts] = useState<CatalogProduct[]>([])
  const [source, setSource] = useState<CatalogSource | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [activeCategory, setActiveCategory] = useState<string>(categoryNameFromHash)
  const [query, setQuery] = useState('')
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (categorySlugFromHash() !== '') {
      sectionRef.current?.scrollIntoView({ block: 'start' })
    }
  }, [])

  useEffect(() => {
    const onHashChange = () => {
      setActiveCategory(categoryNameFromHash())
      if (categorySlugFromHash() !== '') {
        sectionRef.current?.scrollIntoView({ block: 'start' })
      }
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const options = useMemo(() => categoryOptions(products), [products])

  const filtered = useMemo(
    () => filterCatalog(products, activeCategory, query),
    [products, activeCategory, query],
  )

  useEffect(() => {
    let active = true
    void (async () => {
      try {
        const result = await loadCatalog()
        if (!active) return
        setProducts(result.products)
        setSource(result.source)
      } catch {
        if (!active) return
        setLoadError(true)
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [reloadKey])

  const pills = useMemo(
    () => [
      { key: 'all', label: 'Todos', value: 'all' },
      ...options.map((o) => ({ key: o.id, label: o.name, value: o.name })),
    ],
    [options],
  )

  function handlePickCategory(value: string) {
    setActiveCategory(value)
    if (value === 'all') {
      if (categorySlugFromHash() !== '') {
        history.replaceState(null, '', window.location.pathname + window.location.search)
      }
      return
    }
    const slug = categories.find((c) => c.name === value)?.id
    if (slug) {
      history.replaceState(null, '', `#categoria-${slug}`)
    }
  }

  function handleClearFilters() {
    setActiveCategory('all')
    setQuery('')
    if (categorySlugFromHash() !== '') {
      history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }

  function handleRetry() {
    setLoadError(false)
    setLoading(true)
    setReloadKey((key) => key + 1)
  }

  return (
    <section id="catalogo" ref={sectionRef} className="scroll-mt-40">
      <FadeContent>
        <SpotlightCard className="flex flex-wrap items-end justify-between gap-4 p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
              <Icon name="tools" className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Catálogo de produtos
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Filtre por categoria ou busque pelo nome.
              </p>
            </div>
          </div>
          <span
            title={source === 'api' ? 'Catálogo online' : 'Catálogo local (offline)'}
            className="whitespace-nowrap text-sm text-neutral-400 dark:text-neutral-500"
          >
            {loading ? '…' : `${filtered.length} de ${products.length} itens`}
          </span>
        </SpotlightCard>
      </FadeContent>

      <div className="mt-5 flex flex-col gap-4">
        <div className="relative">
          <Icon
            name="search"
            className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar produtos..."
            aria-label="Buscar produtos"
            className="w-full rounded-xl border border-neutral-300 bg-white py-2.5 pl-11 pr-10 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-600"
          />
          {query !== '' && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Limpar busca"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-400 transition-colors hover:text-neutral-700 dark:hover:text-neutral-200"
            >
              <Icon name="x" className="h-4 w-4" />
            </button>
          )}
        </div>

        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filtrar por categoria"
        >
          {pills.map((pill) => {
            const active = activeCategory === pill.value
            return (
              <button
                key={pill.key}
                type="button"
                onClick={() => handlePickCategory(pill.value)}
                aria-pressed={active}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? 'border-sky-600 bg-sky-600 text-white shadow-sm'
                    : 'border-neutral-300 bg-white text-neutral-600 hover:border-sky-400 hover:text-sky-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-sky-500 dark:hover:text-sky-300'
                }`}
              >
                {pill.label}
              </button>
            )
          })}
        </div>
      </div>

      {loading ? (
        <div className={GRID_CLASSES}>
          {Array.from({ length: 8 }, (_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : loadError ? (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-12 text-center dark:border-red-900 dark:bg-red-950">
          <p className="text-sm font-medium text-red-700 dark:text-red-300">
            Não foi possível carregar o catálogo.
          </p>
          <button
            type="button"
            onClick={handleRetry}
            className="rounded-lg bg-red-600 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <MotionConfig reducedMotion="user">
          <div className={GRID_CLASSES}>
            <AnimatePresence mode="popLayout" initial={false}>
              {filtered.map((product, index) => (
                <CatalogCard key={product.id} product={product} index={index} />
              ))}
            </AnimatePresence>

            {filtered.length === 0 && (
              <EmptyState
                hasQuery={query.trim() !== ''}
                hasCategory={activeCategory !== 'all'}
                onClear={handleClearFilters}
              />
            )}
          </div>
        </MotionConfig>
      )}
    </section>
  )
}