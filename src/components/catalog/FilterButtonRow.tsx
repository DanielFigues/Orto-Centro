interface FilterButtonRowProps {
  /** Rótulo acessível do grupo, exibido por leitores de tela. */
  label: string
  /** Valores disponíveis, já normalizados e ordenados. */
  options: readonly string[]
  /** Valor atualmente ativo. */
  selected: string
  onSelect: (value: string) => void
  /** Modificador visual para o segundo nível de filtros. */
  variant?: 'primary' | 'secondary'
  className?: string
}

const BUTTON_BASE =
  'filter-button rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950'

const ACTIVE_STYLES = 'filter-button--active border-sky-600 bg-sky-600 text-white shadow-sm'

const IDLE_STYLES =
  'border-neutral-300 bg-white text-neutral-600 hover:border-sky-400 hover:text-sky-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-sky-500 dark:hover:text-sky-300'

const SECONDARY_ACTIVE_STYLES =
  'border-sky-400 bg-sky-50 text-sky-800 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-200'

export function FilterButtonRow({
  label,
  options,
  selected,
  onSelect,
  variant = 'primary',
  className = '',
}: FilterButtonRowProps) {
  const activeStyles = variant === 'primary' ? ACTIVE_STYLES : SECONDARY_ACTIVE_STYLES

  return (
    <div
      role="group"
      aria-label={label}
      className={`filter-row flex flex-wrap gap-2 ${className}`}
    >
      {options.map((option) => {
        const isActive = option === selected

        return (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            aria-pressed={isActive}
            className={`${BUTTON_BASE} ${isActive ? activeStyles : IDLE_STYLES}`}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}
