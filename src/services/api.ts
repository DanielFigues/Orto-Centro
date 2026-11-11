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
  image_url?: string | File
  image_url_2?: string | File
  image_url_3?: string | File
  image_url_4?: string | File
  image_url_5?: string | File
  description?: string
  short_description?: string
  technical_specs?: string
  brand?: string
  sizes?: string
  price?: number | null
  is_active?: boolean
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function toText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function toPrice(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const raw = value.trim()
    const normalized = raw.includes(',')
      ? raw.replace(/\./g, '').replace(',', '.')
      : raw
    const parsed = Number(normalized)
    return Number.isFinite(parsed) ? parsed : null
  }

  return null
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
    image_url_2: toText(value.image_url_2),
    image_url_3: toText(value.image_url_3),
    image_url_4: toText(value.image_url_4),
    image_url_5: toText(value.image_url_5),
    description: toText(value.description),
    short_description: toText(value.short_description),
    technical_specs: toText(value.technical_specs),
    brand: toText(value.brand),
    sizes: toText(value.sizes),
    price: toPrice(value.price),
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

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function prepareBody(body: unknown): Promise<{ body: BodyInit | undefined; contentType: string | undefined }> {
  if (body === undefined) {
    return { body: undefined, contentType: undefined }
  }

  const hasFile = (obj: unknown): boolean => {
    if (obj instanceof File) return true
    if (Array.isArray(obj)) return obj.some(hasFile)
    if (isRecord(obj)) {
      return Object.values(obj).some(hasFile)
    }
    return false
  }

  if (hasFile(body)) {
    const processed = await processObject(body)
    return { body: JSON.stringify(processed), contentType: 'application/json' }
  }

  return { body: JSON.stringify(body), contentType: 'application/json' }
}

async function processObject(obj: unknown): Promise<unknown> {
  if (obj instanceof File) {
    return await fileToBase64(obj)
  }
  if (Array.isArray(obj)) {
    return await Promise.all(obj.map(processObject))
  }
  if (isRecord(obj)) {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj)) {
      result[key] = await processObject(value)
    }
    return result
  }
  return obj
}

async function request<T>(
  path: string,
  options: {
    token?: string
    method?: 'POST' | 'DELETE' | 'PUT'
    body?: unknown
    signal?: AbortSignal
    fallbackMessage: string
  },
): Promise<T> {
  const { token, method, body, signal, fallbackMessage } = options

  const { body: preparedBody, contentType } = await prepareBody(body)

  let response: Response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      signal,
      headers: {
        Accept: 'application/json',
        ...(contentType === undefined ? {} : { 'Content-Type': contentType }),
        ...(token === undefined ? {} : { Authorization: `Bearer ${token}` }),
      },
      body: preparedBody,
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

export async function updateProduct(
  id: number,
  data: Partial<ProductInput>,
  token: string,
): Promise<Product> {
  const payload = await request<{ product?: unknown }>(
    `/products/${id}`,
    {
      token,
      method: 'PUT',
      body: data,
      fallbackMessage: 'Não foi possível atualizar o produto.',
    },
  )

  const product = parseProduct(payload?.product)
  if (product === null) {
    throw new ApiError(200, 'Resposta inválida do servidor.')
  }

  return product
}
