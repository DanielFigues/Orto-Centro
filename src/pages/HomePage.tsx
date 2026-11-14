import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import FadeContent from '../components/bits/FadeContent'
import { CategoryCard } from '../components/catalog/CategoryCard'
import { FeaturedShowcase } from '../components/catalog/FeaturedShowcase'
import { ProductCarousel } from '../components/catalog/ProductCarousel'
import { ProductGrid } from '../components/catalog/ProductGrid'
import { FaqSection } from '../components/home/FaqSection'
import { LocationHours } from '../components/home/LocationHours'
import { Footer } from '../components/layout/Footer'
import { Hero } from '../components/layout/Hero'
import { SectionHeading } from '../components/layout/SectionHeading'
import { ScrollRail } from '../components/ui/ScrollRail'
import { useCatalog } from '../context/catalogContextValue'
import { categories } from '../data/categories'
import { homeBenefits } from '../data/home'
import { Icon } from '../components/ui/Icon'
import { useMediaQuery } from '../hooks/useMediaQuery'

const FEATURED_PRODUCTS_LIMIT = 6

// Layout dos produtos em destaque: 'showcase' | 'carousel' | 'grid'
const PRODUCTS_LAYOUT: 'showcase' | 'carousel' | 'grid' = 'showcase'

const mobileActionClass =
  'focus-ring inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-button border border-neutral-300 px-4 py-3 text-body font-medium text-neutral-900 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-900'

export function HomePage() {
  const { activeProducts } = useCatalog()
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const featuredProducts = useMemo(
    () => activeProducts.slice(0, FEATURED_PRODUCTS_LIMIT),
    [activeProducts],
  )

  const categoriesAction = (
    <Link
      to="/#catalogo"
      className={
        isDesktop
          ? 'focus-ring inline-flex min-h-11 shrink-0 items-center gap-2 rounded-button text-body font-medium text-sky-700 transition-colors hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-200'
          : mobileActionClass
      }
    >
      Ver todas as categorias
      <Icon name="arrow-right" className="h-4 w-4" />
    </Link>
  )

  const productsAction = (
    <Link
      to="/catalogo"
      className={
        isDesktop
          ? 'focus-ring inline-flex min-h-11 shrink-0 items-center gap-2 rounded-button text-body font-medium text-sky-700 transition-colors hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-200'
          : mobileActionClass
      }
    >
      Ver todos os produtos
      <Icon name="arrow-right" className="h-4 w-4" />
    </Link>
  )

  const faqAction = (
    <Link
      to="/perguntas-frequentes"
      className={
        isDesktop
          ? 'focus-ring inline-flex min-h-11 shrink-0 items-center gap-2 rounded-button text-body font-medium text-sky-700 transition-colors hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-200'
          : mobileActionClass
      }
    >
      Ver todas as perguntas
      <Icon name="arrow-right" className="h-4 w-4" />
    </Link>
  )

  return (
    <>
      <main>
        <h1 className="sr-only">Orto Centro — produtos de apoio e acessibilidade</h1>

        <Hero />

        <div className="font-sans">
          <FadeContent>
            <section
              id="categorias"
              aria-labelledby="categorias-titulo"
              className="section-y scroll-mt-24"
            >
            <div className="container">
              <h2
                id="categorias-titulo"
                className="text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] text-neutral-900 dark:text-white xl:text-[36px]"
              >
                Categorias
              </h2>
            </div>

            <div className="mt-6">
              <ScrollRail
                ariaLabel="Categorias de produtos"
                arrowsOnSquareImage
                prevAriaLabel="Ver categorias anteriores"
                nextAriaLabel="Ver próximas categorias"
              >
                {categories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </ScrollRail>
            </div>

            {!isDesktop ? (
              <div className="container mt-6">{categoriesAction}</div>
            ) : null}
          </section>
        </FadeContent>

        <FadeContent>
          <section
            id="catalogo"
            aria-labelledby="produtos-titulo"
            className="section-y scroll-mt-24"
          >
            <div className="container">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2
                  id="produtos-titulo"
                  className="text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] text-neutral-900 dark:text-white xl:text-[36px]"
                >
                  Produtos em destaque
                </h2>
                <Link
                  to="/catalogo"
                  className="focus-ring inline-flex min-h-11 items-center rounded-button text-body font-medium text-sky-700 underline-offset-4 transition-colors hover:text-sky-800 hover:underline dark:text-sky-300 dark:hover:text-sky-200"
                >
                  Ver todos os produtos
                </Link>
              </div>

              {featuredProducts.length === 0 ? (
                <div className="mt-6 rounded-card border border-dashed border-neutral-300 px-6 py-14 text-center dark:border-neutral-700">
                  <Icon
                    name="tools"
                    className="mx-auto h-8 w-8 text-neutral-500 dark:text-neutral-400"
                  />
                  <p className="mt-3 text-body font-medium text-neutral-600 dark:text-neutral-300">
                    Nenhum produto em destaque no momento.
                  </p>
                </div>
              ) : null}
            </div>

<div className="mt-6">
       {PRODUCTS_LAYOUT === 'showcase' ? (
         <FeaturedShowcase products={featuredProducts} />
       ) : PRODUCTS_LAYOUT === 'carousel' ? (
         <ProductCarousel products={featuredProducts} />
       ) : (
         <div className="container">
           <ProductGrid products={featuredProducts} />
         </div>
       )}
     </div>
     {!isDesktop ? (
       <div className="container mt-6">{productsAction}</div>
     ) : null}
          </section>
        </FadeContent>

        <div className="container">
          <FadeContent>
            <section
              aria-labelledby="diferenciais-titulo"
              className="section-y scroll-mt-24"
            >
              <SectionHeading
                id="diferenciais-titulo"
                eyebrow="Por que escolher a Orto Centro"
                title="Cuidado em cada escolha"
                description="Três compromissos que guiam cada escolha: mais autonomia, segurança no dia a dia e orientação próxima."
              />

              <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                {homeBenefits.map((benefit) => (
                  <li
                    key={benefit.id}
                    className={
                      benefit.featured
                        ? 'md:col-span-2 lg:col-span-2 lg:row-span-2'
                        : ''
                    }
                  >
                    <article
                      className={`relative isolate h-full overflow-hidden rounded-card-lg bg-neutral-900 ${
                        benefit.featured
                          ? 'min-h-[360px] lg:min-h-0'
                          : 'min-h-[260px]'
                      }`}
                    >
                      <img
                        src={benefit.image.src}
                        alt={benefit.image.alt}
                        width={benefit.image.width}
                        height={benefit.image.height}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/30"
                      />

                      <div className="relative flex h-full flex-col justify-end p-6 sm:p-7">
                        <span
                          aria-hidden="true"
                          className="inline-flex h-12 w-12 items-center justify-center rounded-button border border-white/20 bg-black/25 text-white backdrop-blur-sm"
                        >
                          <Icon name={benefit.icon} className="h-6 w-6" />
                        </span>
                        <h3 className="mt-4 text-h3 font-semibold leading-snug text-white">
                          {benefit.title}
                        </h3>
                        <p className="mt-2 max-w-lg text-body leading-relaxed text-neutral-100">
                          {benefit.description}
                        </p>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            </section>
          </FadeContent>

          <FadeContent>
            <section
              id="perguntas-frequentes"
              aria-labelledby="faq-titulo"
              className="section-y scroll-mt-24"
            >
              <SectionHeading
                id="faq-titulo"
                eyebrow="Perguntas frequentes"
                title="Dúvidas comuns"
                description="Respostas rápidas sobre atendimento, escolha e produtos."
                action={isDesktop ? faqAction : undefined}
              />
              <FaqSection />
              {!isDesktop ? (
                <div className="mt-6">{faqAction}</div>
              ) : null}
            </section>
          </FadeContent>

          <FadeContent>
            <section
              id="localizacao"
              aria-labelledby="localizacao-titulo"
              className="section-y scroll-mt-24"
            >
              <SectionHeading
                id="localizacao-titulo"
                eyebrow="Localização e horário"
                title="Onde estamos"
                description="Confira o endereço, o horário de funcionamento e a localização no mapa."
              />
              <LocationHours />
            </section>
          </FadeContent>
        </div>
        </div>
      </main>

      <div className="font-sans">
        <Footer />
      </div>
    </>
  )
}
