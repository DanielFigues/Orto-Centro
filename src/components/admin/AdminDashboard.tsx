import { useEffect, useState, type FormEvent } from 'react'
import {
  createProduct,
  deleteProduct,
  listActiveProducts,
  type AdminProduct,
} from '../../lib/adminApi'
import { Icon } from '../ui/Icon'
import { useToast } from './useToast'

interface AdminDashboardProps {
  onLock: () => void
}

interface FormState {
  name: string
  category: string
  imageUrl: string
  isActive: boolean
}

const EMPTY_FORM: FormState = {
  name: '',
  category: '',
  imageUrl: '',
  isActive: true,
}

export function AdminDashboard({ onLock }: AdminDashboardProps) {
  const { toast } = useToast()
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    let active = true
    void (async () => {
      try {
        const products = await listActiveProducts()
        if (active) setProducts(products)
      } catch (err) {
        if (!active) return
        const message = err instanceof Error ? err.message : 'Falha ao carregar os produtos.'
        setLoadError(message)
        toast('error', message)
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [toast])

  async function handleRetry() {
    setLoadError(null)
    setLoading(true)
    try {
      setProducts(await listActiveProducts())
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha ao carregar os produtos.'
      setLoadError(message)
      toast('error', message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = form.name.trim()
    const category = form.category.trim()
    if (name === '' || category === '') {
      toast('error', 'Preencha ao menos nome e categoria.')
      return
    }

    setSubmitting(true)
    try {
      const { product } = await createProduct({
        name,
        category,
        image_url: form.imageUrl.trim() || undefined,
        is_active: form.isActive,
      })
      setProducts((prev) => [...prev, product].sort((a, b) => a.id - b.id))
      setForm(EMPTY_FORM)
      toast('success', `Produto "${product.name}" adicionado.`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha ao criar o produto.'
      toast('error', message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(product: AdminProduct) {
    if (!window.confirm(`Excluir o produto "${product.name}"?`)) {
      return
    }

    setDeletingId(product.id)
    try {
      await deleteProduct(product.id)
      setProducts((prev) => prev.filter((p) => p.id !== product.id))
      toast('success', `Produto "${product.name}" excluído.`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha ao excluir o produto.'
      toast('error', message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Gerencie o catálogo de produtos ativos.
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
        <section className="h-fit rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="flex items-center gap-2 text-base font-semibold text-neutral-900 dark:text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
              <Icon name="plus" className="h-4 w-4" />
            </span>
            Adicionar produto
          </h2>

          <form onSubmit={handleCreate} className="mt-4 flex flex-col gap-3.5">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Nome *
              </span>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Ex.: Cadeira de rodas leve"
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-600"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Categoria *
              </span>
              <input
                type="text"
                required
                value={form.category}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, category: e.target.value }))
                }
                placeholder="Ex.: Mobilidade"
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-600"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                URL da imagem
              </span>
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, imageUrl: e.target.value }))
                }
                placeholder="https://..."
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-600"
              />
            </label>

            <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, isActive: e.target.checked }))
                }
                className="h-4 w-4 rounded border-neutral-300 accent-sky-600"
              />
              Ativo (visível no site)
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Adicionando...
                </>
              ) : (
                <>
                  <Icon name="plus" className="h-4 w-4" />
                  Adicionar
                </>
              )}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
              Catálogo ativo
            </h2>
            <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
              {products.length} {products.length === 1 ? 'produto' : 'produtos'}
            </span>
          </div>

          {loading ? (
            <div className="mt-6 flex items-center justify-center gap-3 py-10 text-sm text-neutral-500 dark:text-neutral-400">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-sky-500/30 border-t-sky-600" />
              Carregando produtos...
            </div>
          ) : loadError ? (
            <div className="mt-6 flex flex-col items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-8 text-center dark:border-red-900 dark:bg-red-950">
              <p className="text-sm font-medium text-red-700 dark:text-red-300">
                {loadError}
              </p>
              <button
                type="button"
                onClick={() => void handleRetry()}
                className="rounded-lg bg-red-600 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
              >
                Tentar novamente
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-neutral-300 px-4 py-10 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
              Nenhum produto ativo no catálogo.
            </div>
          ) : (
            <ul className="mt-4 flex flex-col divide-y divide-neutral-100 dark:divide-neutral-800">
              {products.map((product) => (
                <li
                  key={product.id}
                  className="flex items-center gap-4 py-3 first:pt-1 last:pb-1"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Icon name="home" className="h-6 w-6 text-sky-500 dark:text-sky-400" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {product.name}
                    </p>
                    <p className="mt-0.5 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                      <span className="truncate">#{product.id} · {product.category}</span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 font-semibold ${
                          product.is_active
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        {product.is_active ? 'ativo' : 'inativo'}
                      </span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => void handleDelete(product)}
                    disabled={deletingId === product.id}
                    aria-label={`Excluir ${product.name}`}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-200 text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                  >
                    {deletingId === product.id ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-400/30 border-t-red-500" />
                    ) : (
                      <Icon name="trash" className="h-4 w-4" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}