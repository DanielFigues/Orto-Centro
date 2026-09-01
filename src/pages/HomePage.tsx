import { categories, products } from '../data/products'
import { contact } from '../data/sections'
import { ProductCard } from '../components/ui/ProductCard'
import FadeContent from '../components/bits/FadeContent'
import SpotlightCard from '../components/bits/SpotlightCard'
import BorderGlow from '../components/bits/BorderGlow'
import PixelCard from '../components/bits/PixelCard'
import { Icon } from '../components/ui/Icon'

function productsOf(categoryId: string) {
  return products.filter((product) => product.categoryId === categoryId)
}

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

export function HomePage() {
  return (
    <>
      {categories.map((category) => {
        const items = productsOf(category.id)
        if (items.length === 0) return null

        return (
          <section key={category.id} id={category.id} className="scroll-mt-40 pt-14">
            <FadeContent>
              <SpotlightCard className="flex items-end justify-between gap-4 p-6">
                <span
                  aria-hidden
                  className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${category.gradient} opacity-15 blur-2xl`}
                />
                <div className="relative flex items-center gap-3">
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${category.gradient} text-white shadow-lg shadow-sky-500/20`}
                  >
                    <Icon name={category.icon} className="h-6 w-6" />
                  </span>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                      {category.name}
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {category.description}
                    </p>
                    <span
                      className={`mt-2 block h-0.5 w-16 rounded-full bg-gradient-to-r ${category.gradient}`}
                    />
                  </div>
                </div>
                <span className="relative whitespace-nowrap rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-400">
                  {items.length} {items.length === 1 ? 'item' : 'itens'}
                </span>
              </SpotlightCard>
            </FadeContent>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {items.map((product, index) => {
                const card = (
                  <BorderGlow
                    className="relative h-full"
                    borderRadius={20}
                    glowColor="199 89% 55%"
                    colors={['#7dd3fc', '#38bdf8', '#0ea5e9']}
                    glowIntensity={0.9}
                    fillOpacity={0.25}
                  >
                    <ProductCard product={product} />
                  </BorderGlow>
                )

                return (
                  <FadeContent key={product.id} delay={Math.min(index, 3) * 0.08}>
                    {index === 0 ? (
                      <PixelCard variant="blue" className="h-full">
                        {card}
                      </PixelCard>
                    ) : (
                      card
                    )}
                  </FadeContent>
                )
              })}
            </div>
          </section>
        )
      })}

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

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
