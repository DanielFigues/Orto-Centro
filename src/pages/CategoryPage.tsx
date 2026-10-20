import { useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useCatalog } from '../context/catalogContextValue'
import { CatalogProductCard } from '../components/catalog/CatalogProductCard'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { Icon } from '../components/ui/Icon'

export function CategoryPage() {
  const { categoryName } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const category = categoryName ?? ''
  const subcategory = searchParams.get('subcategoria') ?? ''
  const { activeProducts, isLoading, errorMessage, retry } = useCatalog()

  const categoryProducts = useMemo(
    () => activeProducts.filter((product) => product.category === category),
    [activeProducts, category],
  )

  const subcategories = useMemo(() => {
    const labels = new Set<string>()
    for (const product of categoryProducts) {
      if (product.subcategory !== '') {
        labels.add(product.subcategory)
      }
    }
    return [...labels].sort((a, b) => a.localeCompare(b, 'pt-BR'))
  }, [categoryProducts])

  const products = useMemo(
    () =>
      subcategory === ''
        ? categoryProducts
        : categoryProducts.filter((product) => product.subcategory === subcategory),
    [categoryProducts, subcategory],
  )

  const selectSubcategory = (value: string) => {
    setSearchParams(value === '' ? {} : { subcategoria: value })
  }

  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="flex-1 px-4 pb-12 pt-36 sm:px-6 lg:pt-28">
        {isLoading ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Carregando produtos...
          </p>
        ) : errorMessage !== null ? (
          <div
            role="alert"
            className="catalog-error flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center dark:border-red-900 dark:bg-red-950"
          >
            <p className="text-sm font-medium text-red-700 dark:text-red-300">
              {errorMessage}
            </p>
            <button
              type="button"
              onClick={retry}
              className="rounded-lg border border-red-300 px-3.5 py-2 text-sm font-medium text-red-700 transition-colors hover:border-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60 dark:border-red-800 dark:text-red-300 dark:hover:border-red-600"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <>
            <nav
              aria-label="Breadcrumb"
              className="text-sm text-neutral-500 dark:text-neutral-400"
            >
              <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                  <Link
                    to="/"
                    className="transition-colors hover:text-sky-700 dark:hover:text-sky-300"
                  >
                    Início
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="font-medium text-neutral-900 dark:text-white">
                  {category}
                </li>
                {subcategory !== '' && (
                  <>
                    <li aria-hidden="true">/</li>
                    <li className="font-medium text-neutral-900 dark:text-white">
                      {subcategory}
                    </li>
                  </>
                )}
              </ol>
            </nav>

            <div className="mt-4 border-b border-neutral-200 pb-3 dark:border-neutral-800">
              <h1
                id="categoria-titulo"
                className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white"
              >
                {category}
              </h1>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                {products.length} {products.length === 1 ? 'produto' : 'produtos'}
              </p>
            </div>

            {subcategories.length > 0 && (
              <div
                className="mt-5 flex flex-wrap gap-2"
                role="group"
                aria-label="Filtrar por subcategoria"
              >
                <button
                  type="button"
                  onClick={() => selectSubcategory('')}
                  aria-pressed={subcategory === ''}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60 ${
                    subcategory === ''
                      ? 'border-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                      : 'border-neutral-300 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-500 dark:hover:text-white'
                  }`}
                >
                  Todos
                </button>
                {subcategories.map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => selectSubcategory(label)}
                    aria-pressed={subcategory === label}
                    className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60 ${
                      subcategory === label
                        ? 'border-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                        : 'border-neutral-300 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-500 dark:hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            <div className="product-grid mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
              {products.map((product) => (
                <CatalogProductCard key={product.id} product={product} />
              ))}

              {products.length === 0 && (
                <div className="catalog-empty-state col-span-full flex flex-col items-center gap-3 rounded-xl border border-dashed border-neutral-300 px-6 py-14 text-center dark:border-neutral-700">
                  <Icon
                    name="search"
                    className="h-8 w-8 text-neutral-400 dark:text-neutral-600"
                  />
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                    Nenhum produto encontrado nesta categoria.
                  </p>
                  <Link
                    to="/"
                    className="rounded-lg border border-neutral-300 px-3.5 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-sky-400 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-sky-500 dark:hover:text-sky-300"
                  >
                    Ver todos os produtos
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
