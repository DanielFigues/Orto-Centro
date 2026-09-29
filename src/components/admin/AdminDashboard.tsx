import { useCallback, useEffect, useState } from 'react'
import {
  ApiError,
  addProduct,
  deleteProduct,
  listAllProducts,
  type ProductInput,
} from '../../services/api'
import type { Product } from '../../types/product'
import { Icon } from '../ui/Icon'
import { ProductForm } from './ProductForm'
import { useToast } from './useToast'

interface AdminDashboardProps {
  token: string
  onLock: () => void
}

function isAuthError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
        isActive
          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
          : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300'
      }`}
    >
      {isActive ? 'Ativo' : 'Inativo'}
    </span>
  )
}

export function AdminDashboard({ token, onLock }: AdminDashboardProps) {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const refresh = useCallback(() => {
    setReloadToken((current) => current + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function loadProducts() {
      setLoading(true)
      setLoadError(null)
      try {
        setProducts(await listAllProducts(token, controller.signal))
      } catch (error) {
        if (controller.signal.aborted) return
        if (isAuthError(error)) {
          onLock()
          return
        }
        setLoadError(
          error instanceof Error ? error.message : 'Falha ao carregar os produtos.',
        )
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void loadProducts()

    return () => controller.abort()
  }, [token, reloadToken, onLock])

  const handleCreate = useCallback(
    async (input: ProductInput) => {
      try {
        const product = await addProduct(input, token)
        toast('success', `Produto "${product.name}" adicionado.`)
        refresh()
      } catch (error) {
        if (isAuthError(error)) {
          onLock()
          return
        }
        toast(
          'error',
          error instanceof Error ? error.message : 'Falha ao criar o produto.',
        )
        throw error
      }
    },
    [token, toast, refresh, onLock],
  )

  const handleDelete = useCallback(
    async (product: Product) => {
      if (!window.confirm(`Excluir o produto "${product.name}"?`)) {
        return
      }

      setDeletingId(product.id)
      try {
        await deleteProduct(product.id, token)
        toast('success', `Produto "${product.name}" excluído.`)
        refresh()
      } catch (error) {
        if (isAuthError(error)) {
          onLock()
          return
        }
        toast(
          'error',
          error instanceof Error ? error.message : 'Falha ao excluir o produto.',
        )
      } finally {
        setDeletingId(null)
      }
    },
    [token, toast, refresh, onLock],
  )

  const activeCount = products.filter((product) => product.is_active).length

  return (
    <div className="mx-auto max-w-5xl">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Gerencie o catálogo de produtos.
          </p>
        </div>
        <button
          type="button"
          onClick={onLock}
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3.5 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          <Icon name="logout" className="h-4 w-4" />
          Sair
        </button>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,340px)_1fr]">
        <ProductForm onCreate={handleCreate} />

        <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
              Produtos
            </h2>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="rounded-full bg-sky-100 px-2.5 py-1 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                {products.length} no total
              </span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                {activeCount} {activeCount === 1 ? 'ativo' : 'ativos'}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="mt-6 flex items-center justify-center gap-3 py-10 text-sm text-neutral-500 dark:text-neutral-400">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-sky-500/30 border-t-sky-600" />
              Carregando produtos...
            </div>
          ) : loadError !== null ? (
            <div className="mt-6 flex flex-col items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-8 text-center dark:border-red-900 dark:bg-red-950">
              <p className="text-sm font-medium text-red-700 dark:text-red-300">
                {loadError}
              </p>
              <button
                type="button"
                onClick={refresh}
                className="rounded-lg bg-red-600 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
              >
                Tentar novamente
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-neutral-300 px-4 py-10 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
              Nenhum produto cadastrado.
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800">
                    <th
                      scope="col"
                      className="px-2 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
                    >
                      Nome
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
                    >
                      Categoria
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
                    >
                      Subcategoria
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
                    >
                      Status
                    </th>
                    <th scope="col" className="px-2 py-2 text-right">
                      <span className="sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {products.map((product) => (
                    <tr key={product.id} className="align-middle">
                      <td className="px-2 py-3 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                        {product.id}
                      </td>
                      <td className="max-w-[220px] truncate px-2 py-3 font-medium text-neutral-900 dark:text-neutral-100">
                        {product.name}
                      </td>
                      <td className="px-2 py-3 text-neutral-600 dark:text-neutral-300">
                        {product.category}
                      </td>
                      <td className="px-2 py-3 text-neutral-500 dark:text-neutral-400">
                        {product.subcategory === '' ? '—' : product.subcategory}
                      </td>
                      <td className="px-2 py-3">
                        <StatusBadge isActive={product.is_active} />
                      </td>
                      <td className="px-2 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => void handleDelete(product)}
                          disabled={deletingId === product.id}
                          aria-label={`Excluir ${product.name}`}
                          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-red-200 px-2.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                        >
                          {deletingId === product.id ? (
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-400/30 border-t-red-500" />
                          ) : (
                            <Icon name="trash" className="h-3.5 w-3.5" />
                          )}
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
