import type { Product } from '../types/product'

const API_BASE = '/api'

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function toText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function parseProduct(value: unknown): Product | null {
  if (!isRecord(value)) return null
  if (typeof value.id !== 'number' || !Number.isFinite(value.id)) return null

  const name = toText(value.name)
  const category = toText(value.category)
  if (name === '' || category === '') return null

  return {
    id: value.id,
    name,
    category,
    subcategory: toText(value.subcategory),
    image_url: toText(value.image_url),
    is_active: value.is_active === true || value.is_active === 1,
  }
}

export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  let response: Response

  try {
    response = await fetch(`${API_BASE}/products`, {
      headers: { Accept: 'application/json' },
      signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error
    }
    throw new ApiError(0, 'Não foi possível conectar ao servidor.')
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `Não foi possível carregar o catálogo (erro ${response.status}).`,
    )
  }

  const payload: unknown = await response.json().catch(() => null)
  if (!Array.isArray(payload)) {
    throw new ApiError(response.status, 'Resposta inválida do servidor.')
  }

  return payload
    .map(parseProduct)
    .filter((product): product is Product => product !== null)
}
