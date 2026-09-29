export const ADMIN_TOKEN = 'change-me-to-a-secret-token'

const API_BASE = '/api'

export interface AdminProduct {
  id: number
  name: string
  category: string
  subcategory: string
  image_url: string
  is_active: boolean
}

export interface AdminProductInput {
  name: string
  category: string
  subcategory?: string
  image_url?: string
  is_active?: boolean
}

interface ApiErrorPayload {
  error?: string
}

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ADMIN_TOKEN}`,
        ...init.headers,
      },
    })
  } catch {
    throw new ApiError(0, 'Não foi possível conectar ao servidor.')
  }

  if (response.status === 204) {
    return undefined as T
  }

  const payload = (await response.json().catch(() => null)) as
    | ApiErrorPayload
    | T
    | null

  if (!response.ok) {
    const message =
      response.status === 401
        ? 'Credenciais inválidas.'
        : payload && typeof payload === 'object' && 'error' in payload && typeof payload.error === 'string'
          ? payload.error
          : `Erro ${response.status}.`
    throw new ApiError(response.status, message)
  }

  return payload as T
}

export function listActiveProducts(): Promise<AdminProduct[]> {
  return request<AdminProduct[]>('/products')
}

export function createProduct(
  input: AdminProductInput,
): Promise<{ product: AdminProduct }> {
  return request<{ product: AdminProduct }>('/products', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function deleteProduct(id: number): Promise<void> {
  return request<void>(`/products/${id}`, { method: 'DELETE' })
}