interface SectionHeadingProps {
  id?: string
  eyebrow: string
  title: string
  description: string
  className?: string
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  className = '',
}: SectionHeadingProps) {
  return (
    <header className={`max-w-3xl ${className}`}>
      <p className="text-label font-semibold uppercase tracking-widest text-sky-700 dark:text-sky-300">
        {eyebrow}
      </p>
      <h2
        id={id}
        className="mt-3 text-section-title font-semibold tracking-tight text-neutral-900 dark:text-white"
      >
        {title}
      </h2>
      <p className="mt-4 max-w-2xl text-body leading-relaxed text-neutral-600 dark:text-neutral-300">
        {description}
      </p>
    </header>
  )
}
