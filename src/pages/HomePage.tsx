import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Carousel from '../components/bits/Carousel'
import FadeContent from '../components/bits/FadeContent'
import SpotlightCard from '../components/bits/SpotlightCard'
import { CatalogEmptyState } from '../components/catalog/CatalogEmptyState'
import { Icon } from '../components/ui/Icon'
import { useCatalog } from '../context/catalogContextValue'
import { contact } from '../data/sections'
import type { Product } from '../types/product'

const FEATURED_PRODUCTS_LIMIT = 6

const contactItems = [
  {
    icon: 'phone',
    title: 'Telefone',
    value: contact.phone,
    href: contact.phoneHref,
  },
  {
    icon: 'phone',
    title: 'WhatsApp',
    value: contact.whatsapp,
    href: contact.whatsappHref,
  },
  {
    icon: 'mail',
    title: 'E-mail',
    value: contact.email,
    href: contact.emailHref,
  },
  {
    icon: 'clock',
    title: 'Atendimento',
    value: contact.hours,
    href: undefined,
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
      className="group flex h-full w-full flex-col overflow-hidden bg-white text-left dark:bg-neutral-900"
    >
      <div className="relative min-h-0 flex-1 overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        {product.image_url !== '' ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Icon name="tools" className="h-14 w-14 text-blue-500 dark:text-blue-400" />
          </div>
        )}
      </div>
      <div className="shrink-0 p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400">
          {product.category}
        </p>
        <h3 className="mt-1 line-clamp-2 text-lg font-semibold leading-snug text-neutral-900 dark:text-white">
          {product.name}
        </h3>
        {product.subcategory !== '' && (
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {product.subcategory}
          </p>
        )}
      </div>
    </Link>
  )
}

export function HomePage() {
  const { activeProducts, resetFilters } = useCatalog()
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
      <section id="catalogo" aria-labelledby="produtos-titulo" className="scroll-mt-40">
        <div className="max-w-7xl mx-auto w-full">
          <h2
            id="produtos-titulo"
            className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-8"
          >
            Produtos
          </h2>

          {featuredItems.length === 0 ? (
            <CatalogEmptyState onResetFilters={resetFilters} />
          ) : (
            <Carousel
              items={featuredItems}
              className="mx-auto"
              baseWidth={960}
              aspectRatio={1.1}
              peek={150}
              gap={24}
              radius={20}
              effect="slide"
              indicator="dots"
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

      <section id="contato" className="scroll-mt-40 pt-14">
        <FadeContent>
          <div className="border-b border-neutral-200 pb-3 dark:border-neutral-800">
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Contato
            </h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Tire dúvidas ou solicite um orçamento. Estamos prontos para ajudar.
            </p>
          </div>
        </FadeContent>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contactItems.map((item, index) => {
            const inner = (
              <>
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
                  <Icon name={item.icon} className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-sm text-neutral-600 dark:text-neutral-400">
                    {item.value}
                  </p>
                </div>
              </>
            )

            return (
              <FadeContent key={item.title} delay={index * 0.08}>
                <SpotlightCard className="h-full p-5">
                  {item.href ? (
                    <a
                      href={item.href}
                      className="flex h-full items-start gap-3 transition-colors hover:text-neutral-700 dark:hover:text-neutral-200"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className="flex h-full items-start gap-3">{inner}</div>
                  )}
                </SpotlightCard>
              </FadeContent>
            )
          })}
        </div>
      </section>
    </>
  )
}
