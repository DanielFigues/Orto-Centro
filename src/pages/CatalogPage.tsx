import { Link } from 'react-router-dom'
import { ProductGrid } from '../components/catalog/ProductGrid'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { useCatalog } from '../context/catalogContextValue'

export function CatalogPage() {
  const { activeProducts, isLoading, errorMessage, retry } = useCatalog()

  return (
    <div className="flex min-h-svh flex-col">
      <Header />

      <main className="page-gutter flex-1 pb-16 pt-36 lg:pt-28">
        <div className="content-container">
          <nav
            aria-label="Breadcrumb"
            className="text-label text-neutral-600 dark:text-neutral-300"
          >
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link
                  to="/"
                  className="focus-ring rounded transition-colors hover:text-sky-700 dark:hover:text-sky-300"
                >
                  Início
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-medium text-neutral-900 dark:text-white">
                Catálogo
              </li>
            </ol>
          </nav>

          <h1 className="mt-4 text-section-title font-semibold tracking-tight text-neutral-900 dark:text-white">
            Catálogo
          </h1>
          <p className="mt-4 max-w-2xl text-body leading-relaxed text-neutral-600 dark:text-neutral-300">
            Explore todos os produtos de apoio e acessibilidade da Orto Centro.
            Use os filtros para encontrar a categoria que você precisa.
          </p>

          <div className="mt-10">
            {isLoading ? (
              <p className="text-body text-neutral-600 dark:text-neutral-300">
                Carregando produtos...
              </p>
            ) : errorMessage !== null ? (
              <div
                role="alert"
                className="flex flex-col items-start gap-3 rounded-card border border-red-200 bg-red-50 px-6 py-8 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
              >
                <p className="text-body font-medium">{errorMessage}</p>
                <button
                  type="button"
                  onClick={retry}
                  className="focus-ring rounded-button border border-red-300 px-4 py-2 text-body font-medium transition-colors hover:border-red-500 dark:border-red-800"
                >
                  Tentar novamente
                </button>
              </div>
            ) : (
              <ProductGrid products={activeProducts} />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
