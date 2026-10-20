import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Carousel from '../components/bits/Carousel'
import { Hero } from '../components/layout/Hero'
import { Footer } from '../components/layout/Footer'
import { Icon } from '../components/ui/Icon'
import { useCatalog } from '../context/catalogContextValue'
import type { Product } from '../types/product'

const FEATURED_PRODUCTS_LIMIT = 6

function usePageTheme(): 'light' | 'dark' {
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  )

  useEffect(() => {
    const root = document.documentElement
    const observer = new MutationObserver(() => {
      setTheme(root.classList.contains('dark') ? 'dark' : 'light')
    })
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return theme
}

function FeaturedProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/produto/${product.id}`}
      className="group relative block h-full w-full overflow-hidden rounded-xl bg-neutral-900 text-left"
    >
      {product.image_url !== '' ? (
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="h-full w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-xl bg-neutral-800">
          <Icon name="tools" className="h-14 w-14 text-sky-500" />
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-white/80">
          {product.category}
        </p>
        <h3 className="mt-1 line-clamp-2 text-lg font-semibold leading-snug text-white">
          {product.name}
        </h3>
      </div>
    </Link>
  )
}

export function HomePage() {
  const { activeProducts } = useCatalog()
  const theme = usePageTheme()

  const featuredItems = useMemo(
    () =>
      activeProducts
        .slice(0, FEATURED_PRODUCTS_LIMIT)
        .map((product) => <FeaturedProductCard key={product.id} product={product} />),
    [activeProducts],
  )

  return (
    <>
      <Hero />

      <main className="flex-1 px-4 py-8 sm:px-6">
        <section id="catalogo" aria-labelledby="produtos-titulo" className="scroll-mt-40">
          <div className="max-w-7xl mx-auto w-full">
            <h2
              id="produtos-titulo"
              className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-8"
            >
              Produtos
            </h2>

            {featuredItems.length === 0 ? (
              <p className="rounded-xl border border-dashed border-neutral-300 px-6 py-14 text-center text-sm font-medium text-neutral-600 dark:border-neutral-700 dark:text-neutral-300">
                Nenhum produto em destaque no momento.
              </p>
            ) : (
              <Carousel
                items={featuredItems}
                className="mx-auto"
                baseWidth={640}
                aspectRatio={1.15}
                peek={80}
                gap={24}
                radius={20}
                effect="scale"
                indicator="bars"
                arrows
                autoplay
                autoplayDelay={4500}
                pauseOnHover
                loop
                draggable
                theme={theme}
              />
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
