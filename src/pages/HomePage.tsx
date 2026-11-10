import { useMemo } from 'react'
import FadeContent from '../components/bits/FadeContent'
import { CategoryCard } from '../components/catalog/CategoryCard'
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

const FEATURED_PRODUCTS_LIMIT = 6

// Alterne para 'grid' para comparar o layout de grade com o carrossel.
const PRODUCTS_LAYOUT: 'carousel' | 'grid' = 'carousel'

export function HomePage() {
  const { activeProducts } = useCatalog()

  const featuredProducts = useMemo(
    () => activeProducts.slice(0, FEATURED_PRODUCTS_LIMIT),
    [activeProducts],
  )

  return (
    <>
      <main>
        <h1 className="sr-only">Orto Centro — produtos de apoio e acessibilidade</h1>

        <Hero />

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
          </section>
        </FadeContent>

        <FadeContent>
          <section
            id="catalogo"
            aria-labelledby="produtos-titulo"
            className="section-y scroll-mt-24"
          >
            <div className="container">
              <h2
                id="produtos-titulo"
                className="text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] text-neutral-900 dark:text-white xl:text-[36px]"
              >
                Produtos em destaque
              </h2>

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

            {featuredProducts.length > 0 ? (
              <div className="mt-6">
                {PRODUCTS_LAYOUT === 'carousel' ? (
                  <ProductCarousel products={featuredProducts} />
                ) : (
                  <div className="container">
                    <ProductGrid products={featuredProducts} />
                  </div>
                )}
              </div>
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
                description="Respostas rápidas sobre atendimento, escolha e produtos. As informações abaixo são provisórias e devem ser confirmadas pela loja."
              />
              <FaqSection />
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
      </main>

      <Footer />
    </>
  )
}
