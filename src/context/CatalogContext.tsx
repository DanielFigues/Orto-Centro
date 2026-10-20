import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { fetchProducts } from '../services/api'
import type { Product } from '../types/product'
import {
  ALL_CATEGORIES,
  ALL_SUBCATEGORIES,
  CatalogContext,
} from './catalogContextValue'
import type { CategoryNav } from './catalogContextValue'

function sortLabels(labels: Iterable<string>): string[] {
  return [...labels].sort((a, b) => a.localeCompare(b, 'pt-BR'))
}

function buildCategoryNav(products: Product[]): CategoryNav[] {
  const map = new Map<string, Set<string>>()

  for (const product of products) {
    if (!map.has(product.category)) {
      map.set(product.category, new Set())
    }
    if (product.subcategory !== '') {
      map.get(product.category)?.add(product.subcategory)
    }
  }

  return sortLabels(map.keys()).map((name) => ({
    name,
    subcategories: sortLabels(map.get(name) ?? []),
  }))
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES)
  const [selectedSubcategory, setSelectedSubcategory] = useState(ALL_SUBCATEGORIES)

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

  const categories = useMemo(() => buildCategoryNav(activeProducts), [activeProducts])

  const selectCategory = useCallback((category: string) => {
    setSelectedCategory(category)
    setSelectedSubcategory(ALL_SUBCATEGORIES)
  }, [])

  const selectSubcategory = useCallback((subcategory: string) => {
    setSelectedSubcategory(subcategory)
  }, [])

  const resetFilters = useCallback(() => {
    setSelectedCategory(ALL_CATEGORIES)
    setSelectedSubcategory(ALL_SUBCATEGORIES)
  }, [])

  const retry = useCallback(() => {
    setErrorMessage(null)
    setIsLoading(true)
    setReloadToken((token) => token + 1)
  }, [])

  const value = useMemo(
    () => ({
      activeProducts,
      categories,
      isLoading,
      errorMessage,
      selectedCategory,
      selectedSubcategory,
      selectCategory,
      selectSubcategory,
      resetFilters,
      retry,
    }),
    [
      activeProducts,
      categories,
      isLoading,
      errorMessage,
      selectedCategory,
      selectedSubcategory,
      selectCategory,
      selectSubcategory,
      resetFilters,
      retry,
    ],
  )

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}
