import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Carousel from '../components/bits/Carousel'
import FadeContent from '../components/bits/FadeContent'
import { Hero } from '../components/layout/Hero'
import { Footer } from '../components/layout/Footer'
import { Icon } from '../components/ui/Icon'
import { useCatalog } from '../context/catalogContextValue'
import type { Product } from '../types/product'

const FEATURED_PRODUCTS_LIMIT = 6

interface BentoFeature {
  icon: string
  eyebrow: string
  title: string
  subtitle: string
  image: string
  className: string
}

const BENTO_FEATURES: BentoFeature[] = [
  {
    icon: 'wheelchair',
    eyebrow: 'Mobilidade',
    title: 'Mobilidade sem Limites',
    subtitle:
      'Cadeiras de rodas tecnológicas e resistentes para todas as suas jornadas.',
    image:
      'https://images.unsplash.com/photo-1580281658223-9b93f18ae9ae?q=80&w=800&auto=format&fit=crop',
    className: 'min-h-[320px] md:col-span-2 md:row-span-2',
  },
  {
    icon: 'cushion',
    eyebrow: 'Conforto',
    title: 'Conforto e Postura',
    subtitle: 'Almofadas antiescaras e apoios.',
    image:
      'https://images.unsplash.com/photo-1633526543814-9718c8922b7a?q=80&w=400&auto=format&fit=crop',
    className: 'min-h-[220px]',
  },
  {
    icon: 'shower',
    eyebrow: 'Cuidado',
    title: 'Segurança no Banho',
    subtitle: 'Prevenção e cuidado em casa.',
    image:
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop',
    className: 'min-h-[220px]',
  },
  {
    icon: 'walker',
    eyebrow: 'Rotina',
    title: 'Independência Diária',
    subtitle: 'Andadores e soluções inteligentes para a sua rotina.',
    image:
      'https://images.unsplash.com/photo-1516733968668-dbdce39c4651?q=80&w=800&auto=format&fit=crop',
    className: 'min-h-[220px] md:col-span-3',
  },
]

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

function BentoCard({ feature }: { feature: BentoFeature }) {
  return (
    <article
      className={`group relative isolate overflow-hidden rounded-3xl bg-slate-800 shadow-lg shadow-slate-950/20 transition-shadow duration-500 hover:shadow-2xl hover:shadow-sky-950/50 ${feature.className}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 ease-out group-hover:scale-105"
        style={{ backgroundImage: `url('${feature.image}')` }}
      />
      <div
        aria-hidden="true"
        className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
      />

      <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-7">
        <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white backdrop-blur-sm">
          <Icon name={feature.icon} className="h-5 w-5" />
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-300">
          {feature.eyebrow}
        </p>
        <h3 className="mt-1.5 text-lg font-semibold leading-snug text-white sm:text-xl">
          {feature.title}
        </h3>
        <p className="mt-1.5 max-w-md text-sm leading-relaxed text-slate-300">
          {feature.subtitle}
        </p>
      </div>
    </article>
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

        <FadeContent>
          <section
            aria-labelledby="diferenciais-titulo"
            className="mt-16 scroll-mt-40 sm:mt-24"
          >
            <div className="mx-auto max-w-7xl">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-600 dark:text-sky-400">
                  Por que escolher a OrtoCentro
                </p>
                <h2
                  id="diferenciais-titulo"
                  className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white"
                >
                  Cuidado, conforto e tecnologia em cada detalhe
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                  Soluções de mobilidade e acessibilidade selecionadas para
                  devolver autonomia e trazer segurança para o seu dia a dia.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 md:auto-rows-[220px] md:grid-cols-3 lg:gap-6">
                {BENTO_FEATURES.map((feature) => (
                  <BentoCard key={feature.title} feature={feature} />
                ))}
              </div>
            </div>
          </section>
        </FadeContent>
      </main>

      <Footer />
    </>
  )
}
