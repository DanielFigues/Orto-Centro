import { useMemo } from 'react'
import {
  ALL_CATEGORIES,
  ALL_SUBCATEGORIES,
  useCatalog,
} from '../context/CatalogContext'
import { CatalogEmptyState } from './catalog/CatalogEmptyState'
import { CatalogProductCard } from './catalog/CatalogProductCard'

export function Catalog() {
  const {
    activeProducts,
    isLoading,
    errorMessage,
    selectedCategory,
    selectedSubcategory,
    resetFilters,
    retry,
  } = useCatalog()

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
          onClick={retry}
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
          Navegue pelas categorias no menu superior para encontrar o produto ideal.
        </p>
      </header>

      <p
        className="catalog-result-count mt-4 text-sm text-neutral-500 dark:text-neutral-400"
        aria-live="polite"
      >
        {filteredProducts.length} de {activeProducts.length}{' '}
        {activeProducts.length === 1 ? 'produto' : 'produtos'}
      </p>

      <div className="product-grid mt-4 grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {filteredProducts.map((product) => (
          <CatalogProductCard key={product.id} product={product} />
        ))}

        {filteredProducts.length === 0 && (
          <CatalogEmptyState onResetFilters={resetFilters} />
        )}
      </div>
    </section>
  )
}
