import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ApiError,
  addProduct,
  deleteProduct,
  listAllProducts,
  updateProduct,
  type ProductInput,
} from '../../services/api'
import type { Product } from '../../types/product'
import { Icon } from '../ui/Icon'
import { ProductForm } from './ProductForm'
import { ProductModal } from './ProductModal'
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
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm ${
        isActive
          ? 'bg-emerald-100 font-semibold text-emerald-700'
          : 'bg-slate-200 font-medium text-slate-600'
      }`}
    >
      {isActive ? 'Ativo' : 'Inativo'}
    </span>
  )
}

type FilterType = 'all' | 'category' | 'subcategory' | 'status'

interface FilterState {
  type: FilterType
  value: string
}

export function AdminDashboard({ token, onLock }: AdminDashboardProps) {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [filter, setFilter] = useState<FilterState>({ type: 'all', value: '' })
  const [openFilterMenu, setOpenFilterMenu] = useState<FilterType | null>(null)

  const refresh = useCallback(() => {
    setReloadToken((current) => current + 1)
  }, [])

  const openAddModal = useCallback(() => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }, [])

  const openEditModal = useCallback((product: Product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    setEditingProduct(null)
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

  const handleSubmit = useCallback(
    async (input: ProductInput) => {
      try {
        if (editingProduct) {
          const product = await updateProduct(editingProduct.id, input, token)
          toast('success', `Produto "${product.name}" atualizado.`)
        } else {
          const product = await addProduct(input, token)
          toast('success', `Produto "${product.name}" adicionado.`)
        }
        closeModal()
        refresh()
      } catch (error) {
        if (isAuthError(error)) {
          onLock()
          return
        }
        toast(
          'error',
          error instanceof Error
            ? error.message
            : editingProduct
              ? 'Falha ao atualizar o produto.'
              : 'Falha ao criar o produto.',
        )
        throw error
      }
    },
    [token, toast, refresh, onLock, editingProduct, closeModal],
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

  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean))).sort((a,b)=>a.localeCompare(b,'pt-BR'))
  const subcategories = Array.from(new Set(products.map((p) => p.subcategory).filter(Boolean))).sort((a,b)=>a.localeCompare(b,'pt-BR'))

  const filteredProducts = products.filter((product) => {
    if (filter.type === 'all') return true
    if (filter.type === 'category') return product.category === filter.value
    if (filter.type === 'subcategory') return product.subcategory === filter.value
    if (filter.type === 'status') return filter.value === 'ativo' ? product.is_active : !product.is_active
    return true
  })

  const handleFilterSelect = (type: FilterType, value: string) => {
    setFilter(value === '' ? { type: 'all', value: '' } : { type, value })
    setOpenFilterMenu(null)
  }

  return (
    <div className="min-h-svh bg-gray-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Administração de Produtos
            </h1>
            <p className="mt-2 text-base text-slate-500">
              Gerencie o catálogo de produtos.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-600/30 transition-all hover:-translate-y-0.5 hover:bg-cyan-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50"
            >
              ← Voltar para a Loja
            </Link>
            <button
              type="button"
              onClick={onLock}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-700 backdrop-blur-md shadow-sm transition-colors hover:bg-slate-50"
            >
              <Icon name="logout" className="h-4 w-4" />
              Sair
            </button>
          </div>
        </header>

        <div className="mt-8">
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-600/30 transition-all hover:-translate-y-0.5 hover:bg-cyan-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50"
          >
            <Icon name="plus" className="h-4 w-4" />
            + Adicionar produto
          </button>
        </div>

        <section className="mt-6 rounded-3xl border border-white/50 bg-white/70 p-6 shadow-2xl backdrop-blur-md sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              Produtos
            </h2>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700 sm:text-sm">
                {filteredProducts.length} exibidos
              </span>
              <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-600 sm:text-sm">
                {products.length} no total
              </span>
            </div>
          </div>

          {loadError !== null && (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {loadError}
            </p>
          )}

          {loading ? (
            <div className="mt-6 flex items-center justify-center py-10 text-base text-slate-500">
              Carregando produtos...
            </div>
          ) : products.length === 0 ? (
            <div className="mt-6 flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white/50 px-6 py-12 text-center shadow-sm">
              <p className="text-sm font-medium text-slate-700">
                Nenhum produto cadastrado.
              </p>
              <p className="text-sm text-slate-500">
                Adicione produtos para aparecerem aqui.
              </p>
            </div>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-slate-200/50">
                    <th className="rounded-tl-2xl py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Produto
                    </th>
                    <th className="relative py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                      <button className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-slate-600 transition-colors hover:bg-slate-100" onClick={() => setOpenFilterMenu(openFilterMenu === 'category' ? null : 'category')}>
                        Categoria
                        <Icon name="chevron-down" className="h-3 w-3" />
                      </button>
                      {openFilterMenu === 'category' && (
                        <div className="absolute z-10 mt-2 w-48 rounded-xl border border-slate-200 bg-white/95 p-2 shadow-xl backdrop-blur-lg">
                          <button onClick={() => handleFilterSelect('all', '')} className="w-full rounded-lg px-2.5 py-1.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100">Todas</button>
                          {categories.map(c => (<button key={c} onClick={() => handleFilterSelect('category', c)} className="w-full rounded-lg px-2.5 py-1.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100">{c}</button>))}
                        </div>
                      )}
                    </th>
                    <th className="relative py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 sm:table-cell">
                      <button className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-slate-600 transition-colors hover:bg-slate-100" onClick={() => setOpenFilterMenu(openFilterMenu === 'subcategory' ? null : 'subcategory')}>
                        Subcategoria
                        <Icon name="chevron-down" className="h-3 w-3" />
                      </button>
                      {openFilterMenu === 'subcategory' && (
                        <div className="absolute z-10 mt-2 w-48 rounded-xl border border-slate-200 bg-white/95 p-2 shadow-xl backdrop-blur-lg">
                          <button onClick={() => handleFilterSelect('all', '')} className="w-full rounded-lg px-2.5 py-1.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100">Todas</button>
                          {subcategories.map(s => (<button key={s} onClick={() => handleFilterSelect('subcategory', s)} className="w-full rounded-lg px-2.5 py-1.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100">{s}</button>))}
                        </div>
                      )}
                    </th>
                    <th className="relative py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                      <button className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-slate-600 transition-colors hover:bg-slate-100" onClick={() => setOpenFilterMenu(openFilterMenu === 'status' ? null : 'status')}>
                        Status
                        <Icon name="chevron-down" className="h-3 w-3" />
                      </button>
                      {openFilterMenu === 'status' && (
                        <div className="absolute z-10 mt-2 w-40 rounded-xl border border-slate-200 bg-white/95 p-2 shadow-xl backdrop-blur-lg">
                          <button onClick={() => handleFilterSelect('all', '')} className="w-full rounded-lg px-2.5 py-1.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100">Todos</button>
                          <button onClick={() => handleFilterSelect('status', 'ativo')} className="w-full rounded-lg px-2.5 py-1.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100">Ativos</button>
                          <button onClick={() => handleFilterSelect('status', 'inativo')} className="w-full rounded-lg px-2.5 py-1.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100">Inativos</button>
                        </div>
                      )}
                    </th>
                    <th className="rounded-tr-2xl py-3 px-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="transition-colors hover:bg-slate-50/50">
                      <td className="max-w-[220px] py-4 px-4 align-top">
                        <div className="flex flex-col">
                          <p className="truncate font-semibold text-slate-900">
                            {product.name}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            ID #{product.id}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4 align-top text-sm text-slate-700">
                        {product.category}
                      </td>
                      <td className="hidden py-4 px-4 align-top text-sm text-slate-700 sm:table-cell">
                        {product.subcategory || '—'}
                      </td>
                      <td className="py-4 px-4 align-top">
                        <StatusBadge isActive={product.is_active} />
                      </td>
                      <td className="py-4 px-4 text-right align-top">
                        <div className="flex justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(product)}
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
                          >
                            <Icon name="pencil" className="h-3.5 w-3.5" />
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(product)}
                            disabled={deletingId === product.id}
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {deletingId === product.id ? (
                              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-300 border-t-red-600" />
                            ) : (
                              <Icon name="trash" className="h-3.5 w-3.5" />
                            )}
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <ProductModal
          isOpen={isModalOpen}
          title={editingProduct ? 'Editar produto' : 'Adicionar produto'}
          onClose={closeModal}
        >
          <ProductForm
            product={editingProduct}
            products={products}
            onSubmit={handleSubmit}
            onCancel={closeModal}
            submitLabel={editingProduct ? 'Salvar alterações' : 'Adicionar produto'}
            submittingLabel={editingProduct ? 'Salvando...' : 'Adicionando...'}
          />
        </ProductModal>
      </div>
    </div>
  )
}
