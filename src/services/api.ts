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

export interface ProductInput {
  name: string
  category: string
  subcategory?: string
  image_url?: string
  is_active?: boolean
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

function parseProductList(value: unknown): Product[] {
  if (!Array.isArray(value)) {
    throw new ApiError(200, 'Resposta inválida do servidor.')
  }

  return value
    .map(parseProduct)
    .filter((product): product is Product => product !== null)
}

function failureMessage(response: Response, payload: unknown, fallback: string): string {
  if (isRecord(payload) && typeof payload.error === 'string') {
    return payload.error
  }
  if (response.status === 401) {
    return 'Token de acesso inválido.'
  }
  return fallback
}

async function request<T>(
  path: string,
  options: {
    token?: string
    method?: 'POST' | 'DELETE'
    body?: unknown
    signal?: AbortSignal
    fallbackMessage: string
  },
): Promise<T> {
  const { token, method, body, signal, fallbackMessage } = options

  let response: Response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      signal,
      headers: {
        Accept: 'application/json',
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(token === undefined ? {} : { Authorization: `Bearer ${token}` }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error
    }
    throw new ApiError(0, 'Não foi possível conectar ao servidor.')
  }

  if (response.status === 204) {
    return undefined as T
  }

  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(response.status, failureMessage(response, payload, fallbackMessage))
  }

  return payload as T
}

export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  const payload = await request<unknown>(
    '/products',
    {
      signal,
      fallbackMessage: 'Não foi possível carregar o catálogo.',
    },
  )

  return parseProductList(payload)
}

export async function listAllProducts(
  token: string,
  signal?: AbortSignal,
): Promise<Product[]> {
  const payload = await request<unknown>(
    '/products/all',
    {
      token,
      signal,
      fallbackMessage: 'Não foi possível carregar os produtos.',
    },
  )

  return parseProductList(payload)
}

export async function addProduct(productData: ProductInput, token: string): Promise<Product> {
  const payload = await request<{ product?: unknown }>(
    '/products',
    {
      token,
      method: 'POST',
      body: productData,
      fallbackMessage: 'Não foi possível adicionar o produto.',
    },
  )

  const product = parseProduct(payload?.product)
  if (product === null) {
    throw new ApiError(200, 'Resposta inválida do servidor.')
  }

  return product
}

export async function deleteProduct(id: number, token: string): Promise<void> {
  await request<unknown>(`/products/${id}`, {
    token,
    method: 'DELETE',
    fallbackMessage: 'Não foi possível excluir o produto.',
  })
}
