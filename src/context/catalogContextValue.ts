import { createContext, useContext } from 'react'
import type { Product } from '../types/product'

export const ALL_CATEGORIES = 'Todos'
export const ALL_SUBCATEGORIES = 'Todas'

export interface CategoryNav {
  name: string
  subcategories: string[]
}

export interface CatalogContextValue {
  activeProducts: Product[]
  categories: CategoryNav[]
  isLoading: boolean
  errorMessage: string | null
  selectedCategory: string
  selectedSubcategory: string
  selectCategory: (category: string) => void
  selectSubcategory: (subcategory: string) => void
  resetFilters: () => void
  retry: () => void
}

export const CatalogContext = createContext<CatalogContextValue | null>(null)

export function useCatalog(): CatalogContextValue {
  const context = useContext(CatalogContext)
  if (context === null) {
    throw new Error('useCatalog deve ser usado dentro de um CatalogProvider.')
  }
  return context
}
