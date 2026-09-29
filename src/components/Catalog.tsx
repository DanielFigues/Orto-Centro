import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchProducts } from '../services/api'
import type { Product } from '../types/product'
import { CatalogEmptyState } from './catalog/CatalogEmptyState'
import { CatalogProductCard } from './catalog/CatalogProductCard'
import { FilterButtonRow } from './catalog/FilterButtonRow'

const ALL_CATEGORIES = 'Todos'
const ALL_SUBCATEGORIES = 'Todas'

function sortLabels(labels: Iterable<string>): string[] {
  return [...labels].sort((a, b) => a.localeCompare(b, 'pt-BR'))
}

export function Catalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORIES)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(ALL_SUBCATEGORIES)

  useEffect(() => {
    const controller = new AbortController()

    async function loadProducts() {
      try {
        setProducts(await fetchProducts(controller.signal))
      } catch (error) {
        if (controller.signal.aborted) return
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar o catálogo.',
        )
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void loadProducts()

    return () => controller.abort()
  }, [reloadToken])

  const activeProducts = useMemo(
    () => products.filter((product) => product.is_active),
    [products],
  )

  const categories = useMemo(
    () => sortLabels(new Set(activeProducts.map((product) => product.category))),
    [activeProducts],
  )

  const productsInCategory = useMemo(
    () =>
      selectedCategory === ALL_CATEGORIES
        ? activeProducts
        : activeProducts.filter((product) => product.category === selectedCategory),
    [activeProducts, selectedCategory],
  )

  const subcategories = useMemo(
    () =>
      sortLabels(
        new Set(
          productsInCategory
            .map((product) => product.subcategory)
            .filter((subcategory) => subcategory !== ''),
        ),
      ),
    [productsInCategory],
  )

  const filteredProducts = useMemo(
    () =>
      productsInCategory.filter(
        (product) =>
          selectedSubcategory === ALL_SUBCATEGORIES ||
          product.subcategory === selectedSubcategory,
      ),
    [productsInCategory, selectedSubcategory],
  )

  const handleSelectCategory = useCallback((category: string) => {
    setSelectedCategory(category)
    setSelectedSubcategory(ALL_SUBCATEGORIES)
  }, [])

  const handleSelectSubcategory = useCallback((subcategory: string) => {
    setSelectedSubcategory(subcategory)
  }, [])

  const handleResetFilters = useCallback(() => {
    setSelectedCategory(ALL_CATEGORIES)
    setSelectedSubcategory(ALL_SUBCATEGORIES)
  }, [])

  const handleRetry = useCallback(() => {
    setErrorMessage(null)
    setIsLoading(true)
    setReloadToken((token) => token + 1)
  }, [])

  if (isLoading) {
    return <div className="loading-state">Carregando catálogo...</div>
  }

  if (errorMessage !== null) {
    return (
      <div
        role="alert"
        className="catalog-error flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center dark:border-red-900 dark:bg-red-950"
      >
        <p className="text-sm font-medium text-red-700 dark:text-red-300">
          {errorMessage}
        </p>
        <button
          type="button"
          onClick={handleRetry}
          className="rounded-lg bg-red-600 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  return (
    <section
      id="catalogo"
      aria-labelledby="catalogo-titulo"
      className="catalog-container scroll-mt-40"
    >
      <header className="catalog-header">
        <h2
          id="catalogo-titulo"
          className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white"
        >
          Catálogo de produtos
        </h2>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Filtre por categoria e subcategoria para encontrar o produto ideal.
        </p>
      </header>

      <div className="catalog-filters mt-5 flex flex-col gap-3">
        <FilterButtonRow
          label="Filtrar por categoria"
          options={[ALL_CATEGORIES, ...categories]}
          selected={selectedCategory}
          onSelect={handleSelectCategory}
        />

        {selectedCategory !== ALL_CATEGORIES && subcategories.length > 0 && (
          <FilterButtonRow
            label="Filtrar por subcategoria"
            options={[ALL_SUBCATEGORIES, ...subcategories]}
            selected={selectedSubcategory}
            onSelect={handleSelectSubcategory}
            variant="secondary"
            className="catalog-filters-subcategories"
          />
        )}
      </div>

      <p
        className="catalog-result-count mt-4 text-sm text-neutral-500 dark:text-neutral-400"
        aria-live="polite"
      >
        {filteredProducts.length} de {activeProducts.length}{' '}
        {activeProducts.length === 1 ? 'produto' : 'produtos'}
      </p>

      <div className="product-grid mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <CatalogProductCard key={product.id} product={product} />
        ))}

        {filteredProducts.length === 0 && (
          <CatalogEmptyState onResetFilters={handleResetFilters} />
        )}
      </div>
    </section>
  )
}
