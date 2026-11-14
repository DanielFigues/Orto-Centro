import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaqAnswer } from '../components/faq/FaqAnswer'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { Icon } from '../components/ui/Icon'
import { WhatsAppIcon } from '../components/ui/whatsapp'
import {
  whatsAppButtonBaseClass,
  whatsAppButtonVariantClass,
} from '../components/ui/whatsappButtonStyles'
import { categoryPath } from '../data/categories'
import { faqGroups, faqs } from '../data/faqs'
import { buildWhatsAppMessageLink } from '../lib/whatsapp'

const PAGE_TITLE = 'Perguntas frequentes | Orto Centro'
const PAGE_DESCRIPTION =
  'Tire suas dúvidas sobre produtos, tamanhos, nota fiscal, entrega, trocas, garantia, manutenção e a loja Orto Centro em Montes Claros.'

const answerLinks: Record<string, { label: string; to: string }> = {
  'produtos-para-locacao': {
    label: 'Ver equipamentos para locação',
    to: categoryPath('locacao-de-equipamentos'),
  },
  'endereco-e-estacionamento': {
    label: 'Ver no mapa',
    to: '/#localizacao',
  },
}

export function FaqPage() {
  const { hash, key } = useLocation()

  useEffect(() => {
    const previousTitle = document.title
    const meta = document.querySelector('meta[name="description"]')
    const previousDescription = meta?.getAttribute('content')

    document.title = PAGE_TITLE
    if (meta) {
      meta.setAttribute('content', PAGE_DESCRIPTION)
    }

    return () => {
      document.title = previousTitle
      if (meta && typeof previousDescription === 'string') {
        meta.setAttribute('content', previousDescription)
      }
    }
  }, [])

  useEffect(() => {
    if (!hash) return

    const id = decodeURIComponent(hash.slice(1))
    const target = document.getElementById(id)
    const highlighted = target?.closest<HTMLElement>('[data-faq-highlight]')

    if (!highlighted) return

    highlighted.classList.add('faq-highlight')
    const timeout = window.setTimeout(() => {
      highlighted.classList.remove('faq-highlight')
    }, 1800)

    return () => {
      window.clearTimeout(timeout)
      highlighted.classList.remove('faq-highlight')
    }
  }, [hash, key])

  return (
    <div className="flex min-h-svh flex-col">
      <Header />

      <main className="container flex-1 pb-16 pt-36 lg:pt-28">
        <div className="mx-auto w-full max-w-[70ch]">
          <h1 className="text-section-title font-semibold leading-[1.1] tracking-[-0.02em] text-neutral-900 dark:text-white">
            Perguntas frequentes
          </h1>
          <p className="mt-4 max-w-[60ch] text-body leading-relaxed text-neutral-600 dark:text-neutral-300">
            Respostas sobre produtos, pagamento, entrega, pós-venda e a nossa
            loja.
          </p>

          <nav aria-label="Grupos de perguntas" className="mt-6">
            <ul className="flex flex-wrap gap-2">
              {faqGroups.map((group) => (
                <li key={group.id}>
                  <Link
                    to={`/perguntas-frequentes#${group.id}`}
                    className="focus-ring inline-flex min-h-11 items-center rounded-pill border border-neutral-300 px-4 text-label font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-500 dark:hover:bg-neutral-900"
                  >
                    {group.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-10 space-y-12">
            {faqGroups.map((group) => {
              const groupFaqs = faqs.filter((faq) => faq.group === group.id)

              if (groupFaqs.length === 0) {
                return null
              }

              return (
                <section
                  key={group.id}
                  id={group.id}
                  data-faq-highlight
                  aria-labelledby={`${group.id}-titulo`}
                  className="scroll-mt-28 rounded-card"
                >
                  <h2
                    id={`${group.id}-titulo`}
                    className="text-h2 font-semibold leading-[1.1] tracking-[-0.02em] text-neutral-900 dark:text-white"
                  >
                    {group.title}
                  </h2>

                  <div className="mt-6 space-y-6">
                    {groupFaqs.map((item) => {
                      const answerLink = answerLinks[item.id]

                      return (
                        <article
                          key={item.id}
                          data-faq-highlight
                          className="rounded-card-lg border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 sm:p-6"
                        >
                          <h3
                            id={item.id}
                            className="scroll-mt-28 text-h3 font-semibold leading-snug text-neutral-900 dark:text-white"
                          >
                            {item.question}
                          </h3>

                          <div className="mt-3">
                            <FaqAnswer item={item}>
                              {answerLink ? (
                                <Link
                                  to={answerLink.to}
                                  className="focus-ring inline-flex min-h-11 items-center gap-2 rounded text-body font-medium text-sky-700 underline-offset-4 transition-colors hover:text-sky-800 hover:underline dark:text-sky-300 dark:hover:text-sky-200"
                                >
                                  {answerLink.label}
                                  <Icon
                                    name="arrow-right"
                                    className="h-4 w-4"
                                  />
                                </Link>
                              ) : null}
                            </FaqAnswer>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </div>

          <section
            aria-labelledby="faq-cta-titulo"
            className="mt-12 rounded-card-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 sm:p-8"
          >
            <h2
              id="faq-cta-titulo"
              className="text-h3 font-semibold leading-snug text-neutral-900 dark:text-white"
            >
              Não encontrou sua dúvida?
            </h2>
            <p className="mt-2 max-w-[60ch] text-body leading-relaxed text-neutral-600 dark:text-neutral-300">
              Fale com a nossa equipe pelo WhatsApp.
            </p>
            <a
              href={buildWhatsAppMessageLink(
                'Olá! Tenho uma dúvida sobre os produtos.',
              )}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Falar com a Orto Centro pelo WhatsApp sobre dúvidas (abre em nova aba)"
              className={`${whatsAppButtonBaseClass} ${whatsAppButtonVariantClass.primary} mt-5 w-full sm:w-auto`}
            >
              <WhatsAppIcon className="h-5 w-5 shrink-0" />
              Falar pelo WhatsApp
            </a>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
