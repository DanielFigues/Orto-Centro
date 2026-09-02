import { Icon } from '../ui/Icon'

interface EmptyStateProps {
  hasQuery: boolean
  hasCategory: boolean
  onClear: () => void
}

export function EmptyState({ hasQuery, hasCategory, onClear }: EmptyStateProps) {
  const title = hasQuery
    ? 'Nenhum resultado encontrado'
    : hasCategory
      ? 'Nenhum produto nesta categoria'
      : 'Catálogo vazio'

  const message = hasQuery
    ? 'Não encontramos produtos para a sua busca. Verifique a ortografia ou tente outra palavra-chave.'
    : hasCategory
      ? 'Ainda não há produtos cadastrados nesta categoria. Explore outras categorias ou aguarde novidades.'
      : 'Nenhum produto cadastrado por enquanto. Nossas novidades chegam em breve.'

  const showClear = hasCategory || hasQuery

  return (
    <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
      <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
        <Icon name="search" className="h-8 w-8" />
        {showClear && (
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900">
            <Icon name="x" className="h-3 w-3" />
          </span>
        )}
      </span>

      <h3 className="mt-6 text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
        {message}
      </p>

      {showClear && (
        <button
          type="button"
          onClick={onClear}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50"
        >
          <Icon name="x" className="h-4 w-4" />
          Limpar filtros
        </button>
      )}
    </div>
  )
}