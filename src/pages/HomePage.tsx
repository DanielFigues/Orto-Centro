import { ProductGrid } from '../components/catalog/ProductGrid'
import FadeContent from '../components/bits/FadeContent'
import SpotlightCard from '../components/bits/SpotlightCard'
import { Icon } from '../components/ui/Icon'
import { contact } from '../data/sections'

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
      <ProductGrid />

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