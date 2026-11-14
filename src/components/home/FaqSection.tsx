import { useState } from 'react'
import { featuredFaqs } from '../../data/faqs'
import { FaqAnswer } from '../faq/FaqAnswer'
import { Icon } from '../ui/Icon'

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div className="mt-10 divide-y divide-neutral-200 rounded-card-lg border border-neutral-200 bg-white dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900">
      {featuredFaqs.map((item, index) => {
        const isOpen = openId === item.id
        const panelId = `faq-panel-${item.id}`
        const buttonId = `faq-button-${item.id}`
        const teaserId = `faq-teaser-${item.id}`
        const isFirst = index === 0

        return (
          <div key={item.id}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                aria-describedby={isOpen ? undefined : teaserId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className={`focus-ring flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left text-body font-semibold text-neutral-900 transition-colors hover:bg-neutral-50 dark:text-white dark:hover:bg-neutral-800/60 sm:px-6 ${
                  isFirst ? 'rounded-t-card-lg' : ''
                }`}
              >
                <span>{item.question}</span>
                <Icon
                  name="chevron-down"
                  className={`h-5 w-5 shrink-0 text-neutral-500 transition-transform duration-200 dark:text-neutral-400 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </h3>

            {!isOpen ? (
              <p
                id={teaserId}
                className="max-w-[70ch] px-5 pb-5 pt-3 text-body leading-relaxed text-neutral-600 dark:text-neutral-300 sm:px-6"
              >
                {item.lead}
              </p>
            ) : null}

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="px-5 pb-5 pt-3 sm:px-6"
            >
              <FaqAnswer item={item} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
