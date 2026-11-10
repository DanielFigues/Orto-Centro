import type { ReactNode } from 'react'

interface SectionHeadingProps {
  id?: string
  eyebrow: string
  title: string
  description?: string
  action?: ReactNode
  className?: string
  titleClassName?: string
  descriptionClassName?: string
  actionClassName?: string
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  action,
  className = '',
  titleClassName = '',
  descriptionClassName = '',
  actionClassName = '',
}: SectionHeadingProps) {
  return (
    <header
      className={`flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between ${className}`}
    >
      <div className="min-w-0">
        <p className="text-label font-semibold uppercase tracking-widest text-sky-700 dark:text-sky-300">
          {eyebrow}
        </p>
        <h2
          id={id}
          className={`mt-3 text-section-title font-semibold leading-[1.1] tracking-[-0.02em] text-balance text-neutral-900 dark:text-white ${titleClassName}`}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={`mt-4 max-w-[60ch] text-body leading-relaxed text-neutral-600 dark:text-neutral-300 ${descriptionClassName}`}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <div className={`shrink-0 self-start lg:self-auto ${actionClassName}`}>
          {action}
        </div>
      ) : null}
    </header>
  )
}
