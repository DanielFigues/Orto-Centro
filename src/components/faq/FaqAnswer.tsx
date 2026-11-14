import type { ReactNode } from 'react'
import type { FaqItem } from '../../data/faqs'

interface FaqAnswerProps {
  item: FaqItem
  children?: ReactNode
}

export function FaqAnswer({ item, children }: FaqAnswerProps) {
  return (
    <div className="space-y-3">
      {item.body.map((paragraph, index) => (
        <p
          key={index}
          className="max-w-[70ch] text-body leading-relaxed text-neutral-600 dark:text-neutral-300"
        >
          {paragraph}
        </p>
      ))}

      {item.notes && item.notes.length > 0 ? (
        <div className="space-y-2 rounded-button border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800/60">
          {item.notes.map((note) => (
            <p
              key={note.label}
              className="max-w-[70ch] text-body leading-relaxed text-neutral-700 dark:text-neutral-200"
            >
              <strong className="font-semibold text-neutral-900 dark:text-white">
                {note.label}:
              </strong>{' '}
              {note.text}
            </p>
          ))}
        </div>
      ) : null}

      {children ? <div className="pt-1">{children}</div> : null}
    </div>
  )
}
