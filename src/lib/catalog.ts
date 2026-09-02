import { categories, products as localProducts } from '../data/products'
import type { Product } from '../types/product'

export interface CatalogProduct {
  id: string
  name: string
  category: string
  description?: string
  imageUrl: string
  icon: string
}

interface ApiProduct {
  id: number
  name: string
  category: string
  image_url: string
  is_active: boolean
}

export type CatalogSource = 'api' | 'local'

function toCatalogProduct(product: Product): CatalogProduct {
  const category = categories.find((c) => c.id === product.categoryId)
  return {
    id: product.id,
    name: product.name,
    category: category?.name ?? product.categoryId,
    description: product.description,
    imageUrl: product.imageUrl ?? '',
    icon: product.image,
  }
}

const API_BASE = '/api'

const SKELETON_MIN_MS = 500

export async function loadCatalog(): Promise<{
  products: CatalogProduct[]
  source: CatalogSource
}> {
  const startedAt = performance.now()

  try {
    const response = await fetch(`${API_BASE}/products`)
    if (!response.ok) {
      throw new Error(`API respondeu com status ${response.status}`)
    }
    const data = (await response.json()) as ApiProduct[]
    const products = data.map<CatalogProduct>((p) => ({
      id: String(p.id),
      name: p.name,
      category: p.category,
      imageUrl: p.image_url,
      icon: 'wheelchair',
    }))
    return { products, source: 'api' }
  } catch {
    const products = localProducts.map(toCatalogProduct)
    return { products, source: 'local' }
  } finally {
    const elapsed = performance.now() - startedAt
    if (elapsed < SKELETON_MIN_MS) {
      await new Promise((resolve) => setTimeout(resolve, SKELETON_MIN_MS - elapsed))
    }
  }
}

export function categoryOptions(
  products: CatalogProduct[],
): { id: string; name: string }[] {
  const known = categories.map((c) => c.name)
  const fromData = Array.from(new Set(products.map((p) => p.category)))
  const sorted = [...known, ...fromData.filter((c) => !known.includes(c))]
  return sorted.map((name) => ({ id: name, name }))
}

export function filterCatalog(
  products: CatalogProduct[],
  category: string,
  query: string,
): CatalogProduct[] {
  const normalizedQuery = query.trim().toLowerCase()
  return products.filter((product) => {
    const matchesCategory = category === 'all' || product.category === category
    if (!matchesCategory) return false
    if (normalizedQuery === '') return true
    return (
      product.name.toLowerCase().includes(normalizedQuery) ||
      (product.description ?? '').toLowerCase().includes(normalizedQuery)
    )
  })
}