import { Icon } from '../ui/Icon'

interface CatalogEmptyStateProps {
  onResetFilters: () => void
}

export function CatalogEmptyState({ onResetFilters }: CatalogEmptyStateProps) {
  return (
    <div className="catalog-empty-state col-span-full flex flex-col items-center gap-3 rounded-xl border border-dashed border-neutral-300 px-6 py-14 text-center dark:border-neutral-700">
      <Icon name="search" className="h-8 w-8 text-neutral-400 dark:text-neutral-600" />
      <p className="catalog-empty-state-message text-sm font-medium text-neutral-600 dark:text-neutral-300">
        Nenhum produto encontrado.
      </p>
      <button
        type="button"
        onClick={onResetFilters}
        className="rounded-lg border border-neutral-300 px-3.5 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-sky-400 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-sky-500 dark:hover:text-sky-300"
      >
        Limpar filtros
      </button>
    </div>
  )
}
