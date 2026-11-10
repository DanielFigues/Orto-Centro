import type { ReactNode } from 'react'

interface SectionHeadingProps {
  id?: string
  eyebrow: string
  title: string
  description: string
  action?: ReactNode
  className?: string
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  action,
  className = '',
}: SectionHeadingProps) {
  return (
    <header
      className={`flex flex-col gap-4 md:flex-row md:items-end md:justify-between ${className}`}
    >
      <div className="max-w-3xl">
        <p className="text-label font-semibold uppercase tracking-widest text-sky-700 dark:text-sky-300">
          {eyebrow}
        </p>
        <h2
          id={id}
          className="mt-3 line-clamp-3 text-section-title font-semibold leading-[1.1] tracking-[-0.02em] text-neutral-900 dark:text-white md:line-clamp-2"
        >
          {title}
        </h2>
        <p className="mt-4 max-w-[60ch] text-body leading-relaxed text-neutral-600 dark:text-neutral-300">
          {description}
        </p>
      </div>
      {action ? <div className="shrink-0 self-start md:self-auto">{action}</div> : null}
    </header>
  )
}
