import { useMemo, useState } from 'react'
import type { Product } from '../../types/product'
import { categories as canonicalCategories } from '../../data/categories'
import { CatalogEmptyState } from './CatalogEmptyState'
import { ProductCard } from './ProductCard'

const ALL_CATEGORIES = 'Todos'

interface ProductGridProps {
  products: Product[]
  className?: string
}

export function ProductGrid({ products, className = '' }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES)

  const categoryOptions = useMemo(() => {
    const present = new Set(products.map((product) => product.category))
    const canonical = canonicalCategories
      .map(({ name }) => name)
      .filter((name) => present.has(name))
    const known = new Set(canonical)
    const extras = [...present]
      .filter((name) => !known.has(name))
      .sort((a, b) => a.localeCompare(b, 'pt-BR'))

    return [ALL_CATEGORIES, ...canonical, ...extras]
  }, [products])

  const selectedCategory = categoryOptions.includes(activeCategory)
    ? activeCategory
    : ALL_CATEGORIES

  const visibleProducts = useMemo(
    () =>
      selectedCategory === ALL_CATEGORIES
        ? products
        : products.filter((product) => product.category === selectedCategory),
    [products, selectedCategory],
  )

  return (
    <div className={className}>
      <div
        role="group"
        aria-label="Filtrar por categoria"
        className="flex flex-wrap gap-2"
      >
        {categoryOptions.map((category) => {
          const isSelected = category === selectedCategory

          return (
            <button
              key={category}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setActiveCategory(category)}
              className={`focus-ring min-h-11 rounded-pill border px-4 text-label font-medium transition-colors ${
                isSelected
                  ? 'border-sky-700 bg-sky-700 text-white dark:border-sky-300 dark:bg-sky-300 dark:text-neutral-950'
                  : 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-white'
              }`}
            >
              {category}
            </button>
          )
        })}
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {visibleProducts.length}{' '}
        {visibleProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}

        {visibleProducts.length === 0 && (
          <CatalogEmptyState onResetFilters={() => setActiveCategory(ALL_CATEGORIES)} />
        )}
      </div>
    </div>
  )
}
