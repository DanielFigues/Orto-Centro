import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import FadeContent from '../components/bits/FadeContent'
import { CategoryCard } from '../components/catalog/CategoryCard'
import { ProductCarousel } from '../components/catalog/ProductCarousel'
import { ProductGrid } from '../components/catalog/ProductGrid'
import { Footer } from '../components/layout/Footer'
import { Hero } from '../components/layout/Hero'
import { SectionHeading } from '../components/layout/SectionHeading'
import { Icon } from '../components/ui/Icon'
import { useCatalog } from '../context/catalogContextValue'
import { categories } from '../data/categories'
import { contact } from '../data/sections'

const FEATURED_PRODUCTS_LIMIT = 6

// Alterne para 'grid' para comparar o layout de grade com o carrossel.
const PRODUCTS_LAYOUT: 'carousel' | 'grid' = 'carousel'

interface Pillar {
  icon: string
  title: string
  description: string
}

const PILLARS: Pillar[] = [
  {
    icon: 'phone',
    title: 'Orientação sem pressa',
    description:
      'Atendimento próximo para entender a sua rotina e indicar o produto mais adequado.',
  },
  {
    icon: 'shield',
    title: 'Produtos selecionados',
    description:
      'Itens escolhidos com atenção à segurança, ao conforto e à durabilidade no uso diário.',
  },
  {
    icon: 'heart',
    title: 'Suporte que acompanha',
    description:
      'Ajuda antes e depois da escolha, com uma equipe que conhece cada solução do catálogo.',
  },
]

const STEPS = [
  {
    title: 'Explore as categorias',
    description: 'Navegue pelo catálogo e encontre o que combina com a sua necessidade.',
  },
  {
    title: 'Conheça o produto',
    description: 'Veja detalhes, tamanhos e informações técnicas de cada item.',
  },
  {
    title: 'Fale com a loja',
    description: 'Tire dúvidas e confirme a disponibilidade com a nossa equipe.',
  },
]

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

        <div className="page-gutter">
          <div className="content-container">
            <FadeContent>
              <section
                id="categorias"
                aria-labelledby="categorias-titulo"
                className="section-y scroll-mt-40"
              >
                <SectionHeading
                  id="categorias-titulo"
                  eyebrow="Categorias"
                  title="Encontre pelo que você precisa"
                  description="Navegue por categorias pensadas para a rotina, o conforto e a segurança de quem você cuida."
                />

                <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-5 xl:grid-cols-5">
                  {categories.map((category) => (
                    <CategoryCard key={category.name} category={category} />
                  ))}
                </div>
              </section>
            </FadeContent>

            <FadeContent>
              <section
                id="catalogo"
                aria-labelledby="produtos-titulo"
                className="section-y scroll-mt-40"
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                  <SectionHeading
                    id="produtos-titulo"
                    eyebrow="Destaques"
                    title="Produtos em destaque"
                    description="Uma seleção do catálogo para começar a explorar. Todos os itens têm informações detalhadas para você escolher com calma."
                    className="md:max-w-2xl"
                  />

                  <Link
                    to="/catalogo"
                    className="focus-ring inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-button text-body font-medium text-sky-700 transition-colors hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-200 md:self-auto"
                  >
                    Ver todos os produtos
                    <Icon name="arrow-right" className="h-4 w-4" />
                  </Link>
                </div>

                {featuredProducts.length === 0 ? (
                  <div className="mt-10 rounded-card border border-dashed border-neutral-300 px-6 py-14 text-center dark:border-neutral-700">
                    <Icon
                      name="tools"
                      className="mx-auto h-8 w-8 text-neutral-400 dark:text-neutral-600"
                    />
                    <p className="mt-3 text-body font-medium text-neutral-600 dark:text-neutral-300">
                      Nenhum produto em destaque no momento.
                    </p>
                  </div>
                ) : (
                  <div className="mt-10">
                    {PRODUCTS_LAYOUT === 'carousel' ? (
                      <ProductCarousel products={featuredProducts} />
                    ) : (
                      <ProductGrid products={featuredProducts} />
                    )}
                  </div>
                )}
              </section>
            </FadeContent>

            <FadeContent>
              <section
                aria-labelledby="diferenciais-titulo"
                className="section-y scroll-mt-40"
              >
                <SectionHeading
                  id="diferenciais-titulo"
                  eyebrow="Por que escolher a Orto Centro"
                  title="Cuidado em cada escolha"
                  description="Orientação próxima, produtos selecionados e suporte para você decidir com tranquilidade."
                />

                <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-5">
                  {PILLARS.map((pillar) => (
                    <li
                      key={pillar.title}
                      className="flex flex-col gap-3 rounded-card border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
                    >
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-button bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                        <Icon name={pillar.icon} className="h-6 w-6" />
                      </span>
                      <h3 className="text-h3 font-semibold leading-snug text-neutral-900 dark:text-white">
                        {pillar.title}
                      </h3>
                      <p className="text-body leading-relaxed text-neutral-600 dark:text-neutral-300">
                        {pillar.description}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            </FadeContent>

            <FadeContent>
              <section
                aria-labelledby="como-funciona-titulo"
                className="section-y scroll-mt-40"
              >
                <SectionHeading
                  id="como-funciona-titulo"
                  eyebrow="Como funciona"
                  title="Do primeiro passo ao atendimento"
                  description="Encontre o que precisa no catálogo e fale com a loja quando quiser ajuda."
                />

                <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
                  <ol className="flex flex-col gap-4">
                    {STEPS.map((step, index) => (
                      <li
                        key={step.title}
                        className="flex gap-4 rounded-card border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
                      >
                        <span
                          aria-hidden="true"
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-sky-700 text-body font-semibold text-white dark:bg-sky-300 dark:text-neutral-950"
                        >
                          {index + 1}
                        </span>
                        <div>
                          <h3 className="text-body font-semibold text-neutral-900 dark:text-white">
                            {step.title}
                          </h3>
                          <p className="mt-1 text-body leading-relaxed text-neutral-600 dark:text-neutral-300">
                            {step.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>

                  <div className="flex flex-col gap-4 rounded-card-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
                    <h3 className="text-h3 font-semibold text-neutral-900 dark:text-white">
                      Fale com a Orto Centro
                    </h3>
                    <p className="text-body leading-relaxed text-neutral-600 dark:text-neutral-300">
                      Nossa equipe ajuda você a escolher e a confirmar a disponibilidade
                      dos produtos.
                    </p>

                    <ul className="flex flex-col gap-2">
                      <li>
                        <a
                          href={contact.phoneHref}
                          className="focus-ring flex min-h-11 items-center gap-3 rounded-button px-1 text-body text-neutral-700 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                        >
                          <Icon name="phone" className="h-5 w-5 shrink-0 text-sky-700 dark:text-sky-300" />
                          {contact.phone}
                        </a>
                      </li>
                      <li>
                        <a
                          href={contact.whatsappHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="focus-ring flex min-h-11 items-center gap-3 rounded-button px-1 text-body text-neutral-700 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                        >
                          <Icon name="phone" className="h-5 w-5 shrink-0 text-sky-700 dark:text-sky-300" />
                          WhatsApp: {contact.whatsapp}
                        </a>
                      </li>
                      <li>
                        <a
                          href={contact.emailHref}
                          className="focus-ring flex min-h-11 items-center gap-3 rounded-button px-1 text-body text-neutral-700 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                        >
                          <Icon name="mail" className="h-5 w-5 shrink-0 text-sky-700 dark:text-sky-300" />
                          {contact.email}
                        </a>
                      </li>
                      <li className="flex min-h-11 items-center gap-3 px-1 text-body text-neutral-600 dark:text-neutral-300">
                        <Icon name="clock" className="h-5 w-5 shrink-0 text-sky-700 dark:text-sky-300" />
                        {contact.hours}
                      </li>
                      <li>
                        <a
                          href={contact.addressHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="focus-ring flex min-h-11 items-center gap-3 rounded-button px-1 text-body text-neutral-700 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                        >
                          <Icon name="pin" className="h-5 w-5 shrink-0 text-sky-700 dark:text-sky-300" />
                          {contact.address}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>
            </FadeContent>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
