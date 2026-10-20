import { useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useCatalog } from '../context/catalogContextValue'
import { CatalogProductCard } from '../components/catalog/CatalogProductCard'
import { Icon } from '../components/ui/Icon'

export function CategoryPage() {
  const { nome } = useParams()
  const [searchParams] = useSearchParams()
  const category = nome ?? ''
  const subcategory = searchParams.get('subcategoria') ?? ''
  const { activeProducts, isLoading, errorMessage } = useCatalog()

  const products = useMemo(
    () =>
      activeProducts.filter(
        (product) =>
          product.category === category &&
          (subcategory === '' || product.subcategory === subcategory),
      ),
    [activeProducts, category, subcategory],
  )

  if (isLoading) {
    return <div className="loading-state">Carregando produtos...</div>
  }

  if (errorMessage !== null) {
    return (
      <div
        role="alert"
        className="catalog-error flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center dark:border-red-900 dark:bg-red-950"
      >
        <p className="text-sm font-medium text-red-700 dark:text-red-300">
          {errorMessage}
        </p>
      </div>
    )
  }

  return (
    <section aria-labelledby="categoria-titulo">
      <nav aria-label="Breadcrumb" className="text-sm text-neutral-500 dark:text-neutral-400">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link to="/" className="transition-colors hover:text-sky-700 dark:hover:text-sky-300">
              Início
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-neutral-900 dark:text-white">{category}</li>
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
          {subcategory !== '' ? `Categoria: ${category} / ${subcategory}` : `Categoria: ${category}`}
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {products.length} {products.length === 1 ? 'produto' : 'produtos'}
          {subcategory !== '' && ` em ${category}`}
        </p>
      </div>

      <div className="product-grid mt-5 grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {products.map((product) => (
          <CatalogProductCard key={product.id} product={product} />
        ))}

        {products.length === 0 && (
          <div className="catalog-empty-state col-span-full flex flex-col items-center gap-3 rounded-xl border border-dashed border-neutral-300 px-6 py-14 text-center dark:border-neutral-700">
            <Icon name="search" className="h-8 w-8 text-neutral-400 dark:text-neutral-600" />
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
    </section>
  )
}
