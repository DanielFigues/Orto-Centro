import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import type { KeyboardEvent, RefObject } from 'react'
import { useCatalog } from '../../context/catalogContextValue'
import { categories, categoryPath } from '../../data/categories'
import { searchSuggestionTerms } from '../../data/search'
import type { Product } from '../../types/product'
import { Icon } from '../ui/Icon'

interface SearchDialogProps {
  onClose: () => void
  returnFocusRef?: RefObject<HTMLButtonElement | null>
}

interface SearchResultOptionProps {
  product: Product
  index: number
  isActive: boolean
  onSelect: () => void
  onHover: () => void
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, ' ')
}

function getSearchText(product: Product): string {
  return normalizeText(
    [
      product.name,
      product.category,
      product.subcategory,
      product.short_description ?? '',
      stripHtml(product.description ?? ''),
    ].join(' '),
  )
}

function scoreProduct(product: Product, query: string, tokens: string[]): number {
  const name = normalizeText(product.name)
  const category = normalizeText(product.category)
  const searchText = getSearchText(product)

  if (!tokens.every((token) => searchText.includes(token))) return -1

  let score = 0
  if (name === query) score += 8
  if (name.startsWith(query)) score += 4
  if (name.includes(query)) score += 3
  if (category.includes(query)) score += 2
  if (searchText.includes(query)) score += 1

  return score
}

function SearchResultOption({
  product,
  index,
  isActive,
  onSelect,
  onHover,
}: SearchResultOptionProps) {
  const [hasImageError, setHasImageError] = useState(false)
  const showImage = product.image_url !== '' && !hasImageError

  return (
    <li
      id={`product-search-result-${index}`}
      role="option"
      aria-selected={isActive}
      onClick={onSelect}
      onMouseEnter={onHover}
      className={`flex cursor-pointer items-center gap-3 rounded-button px-3 py-2.5 transition-colors ${
        isActive
          ? 'bg-sky-50 dark:bg-sky-950'
          : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
      }`}
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-button bg-neutral-100 dark:bg-neutral-800">
        {showImage ? (
          <img
            src={product.image_url}
            alt=""
            aria-hidden="true"
            width={48}
            height={48}
            loading="lazy"
            decoding="async"
            draggable={false}
            onError={() => setHasImageError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <Icon name="tools" className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-body font-semibold text-neutral-900 dark:text-white">
          {product.name}
        </span>
        <span className="block truncate text-label font-medium text-neutral-600 dark:text-neutral-400">
          {product.category}
          {product.subcategory !== '' ? ` · ${product.subcategory}` : ''}
        </span>
      </span>

      {isActive && (
        <Icon name="arrow-right" className="h-4 w-4 shrink-0 text-sky-700 dark:text-sky-300" />
      )}
    </li>
  )
}

export function SearchDialog({ onClose, returnFocusRef }: SearchDialogProps) {
  const { activeProducts, isLoading, errorMessage } = useCatalog()
  const navigate = useNavigate()
  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const hasQuery = query.trim() !== ''
  const normalizedQuery = normalizeText(debouncedQuery).trim()

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null
    const triggerButton = returnFocusRef?.current ?? null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus())

    return () => {
      window.cancelAnimationFrame(frame)
      document.body.style.overflow = previousOverflow

      const focusTarget =
        previousFocus !== null &&
        previousFocus !== document.body &&
        previousFocus.isConnected
          ? previousFocus
          : triggerButton

      focusTarget?.focus()
    }
  }, [returnFocusRef])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(query)
      setActiveIndex(0)
    }, 200)

    return () => window.clearTimeout(timeout)
  }, [query])

  const results = useMemo(() => {
    if (normalizedQuery === '') return []

    const tokens = normalizedQuery.split(/\s+/).filter(Boolean)

    return activeProducts
      .map((product) => ({
        product,
        score: scoreProduct(product, normalizedQuery, tokens),
      }))
      .filter((entry) => entry.score >= 0)
      .sort(
        (a, b) =>
          b.score - a.score ||
          a.product.name.localeCompare(b.product.name, 'pt-BR'),
      )
      .map((entry) => entry.product)
  }, [activeProducts, normalizedQuery])

  const safeActiveIndex =
    results.length === 0 ? -1 : Math.min(activeIndex, results.length - 1)

  useEffect(() => {
    if (safeActiveIndex < 0) return

    listRef.current
      ?.querySelector<HTMLElement>(`#product-search-result-${safeActiveIndex}`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [safeActiveIndex])

  const selectProduct = useCallback(
    (product: Product) => {
      onClose()
      navigate(`/produto/${product.id}`)
    },
    [navigate, onClose],
  )

  useEffect(() => {
    const onDocumentKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        FOCUSABLE_SELECTOR,
      )
      if (!focusable || focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onDocumentKeyDown)
    return () => document.removeEventListener('keydown', onDocumentKeyDown)
  }, [onClose])

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (normalizedQuery === '' || results.length === 0) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => (index + 1) % results.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => (index - 1 + results.length) % results.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const product = results[safeActiveIndex]
      if (product) selectProduct(product)
    }
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <p className="px-1 py-8 text-center text-body text-neutral-600 dark:text-neutral-300">
          Carregando catálogo...
        </p>
      )
    }

    if (errorMessage !== null) {
      return (
        <p className="px-1 py-8 text-center text-body text-neutral-600 dark:text-neutral-300">
          Não foi possível carregar o catálogo agora. Tente novamente em instantes.
        </p>
      )
    }

    if (!hasQuery) {
      return (
        <div>
          <p className="px-1 pb-2 text-label font-medium text-neutral-500 dark:text-neutral-400">
            Categorias
          </p>
          <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  to={categoryPath(category)}
                  onClick={onClose}
                  className="focus-ring flex min-h-11 items-center gap-3 rounded-button px-3 py-2.5 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-body font-medium text-neutral-900 dark:text-white">
                      {category.name}
                    </span>
                    <span className="block truncate text-label text-neutral-600 dark:text-neutral-400">
                      {category.tagline}
                    </span>
                  </span>
                  <Icon
                    name="chevron-right"
                    className="h-4 w-4 shrink-0 text-neutral-500 dark:text-neutral-400"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )
    }

    if (query.trim() !== debouncedQuery.trim()) {
      return (
        <p className="px-1 py-8 text-center text-body text-neutral-600 dark:text-neutral-300">
          Buscando...
        </p>
      )
    }

    if (results.length === 0) {
      return (
        <div className="px-1 py-8 text-center">
          <Icon
            name="search"
            className="mx-auto h-8 w-8 text-neutral-500 dark:text-neutral-400"
          />
          <p className="mt-3 text-body font-medium text-neutral-900 dark:text-white">
            Nenhum resultado. Tente: {searchSuggestionTerms.join(', ')}.
          </p>
          <p className="mt-2 text-label text-neutral-600 dark:text-neutral-400">
            Ou escolha uma sugestão:
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {searchSuggestionTerms.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setQuery(term)
                  setActiveIndex(0)
                }}
                className="focus-ring min-h-11 rounded-pill border border-neutral-300 px-4 text-label font-medium text-neutral-700 transition-colors hover:border-sky-600 hover:text-sky-700 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-sky-400 dark:hover:text-sky-300"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )
    }

    return (
      <>
        <p role="status" aria-live="polite" className="sr-only">
          {results.length}{' '}
          {results.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
        </p>
        <ul
          ref={listRef}
          id="product-search-results"
          role="listbox"
          aria-label="Resultados da busca"
          className="flex flex-col gap-0.5"
        >
          {results.map((product, index) => (
            <SearchResultOption
              key={product.id}
              product={product}
              index={index}
              isActive={index === safeActiveIndex}
              onSelect={() => selectProduct(product)}
              onHover={() => setActiveIndex(index)}
            />
          ))}
        </ul>
      </>
    )
  }

  return createPortal(
    <div className="fixed inset-0 z-[60] flex sm:items-start sm:justify-center sm:p-4 sm:pt-[10vh]">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-search-title"
        className="relative flex h-svh w-full flex-col overflow-hidden bg-white shadow-2xl dark:bg-neutral-900 sm:h-auto sm:max-h-[80svh] sm:max-w-xl sm:rounded-card-lg sm:border sm:border-neutral-200 dark:sm:border-neutral-800"
      >
        <div className="flex items-center justify-between gap-3 border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <h2
            id="product-search-title"
            className="text-body font-semibold text-neutral-900 dark:text-white"
          >
            Buscar produtos
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar busca"
            className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-button text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <div className="flex items-center gap-3 rounded-button border border-neutral-300 bg-neutral-50 px-3 transition-colors focus-within:border-sky-600 focus-within:ring-2 focus-within:ring-sky-600/20 dark:border-neutral-700 dark:bg-neutral-950 dark:focus-within:border-sky-400">
            <Icon
              name="search"
              className="h-5 w-5 shrink-0 text-neutral-500 dark:text-neutral-400"
            />
            <input
              ref={inputRef}
              id="product-search-input"
              type="search"
              role="combobox"
              aria-label="Buscar produtos"
              aria-autocomplete="list"
              aria-expanded={hasQuery && results.length > 0}
              aria-controls={hasQuery ? 'product-search-results' : undefined}
              aria-activedescendant={
                safeActiveIndex >= 0
                  ? `product-search-result-${safeActiveIndex}`
                  : undefined
              }
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setActiveIndex(0)
              }}
              onKeyDown={handleInputKeyDown}
              placeholder="Busque por nome, categoria ou descrição"
              autoComplete="off"
              spellCheck={false}
              className="h-12 w-full bg-transparent text-body text-neutral-900 outline-none placeholder:text-neutral-500 dark:text-white dark:placeholder:text-neutral-400"
            />
            <kbd className="hidden shrink-0 rounded border border-neutral-300 px-1.5 py-0.5 text-xs text-neutral-500 dark:border-neutral-700 dark:text-neutral-400 sm:inline">
              Esc
            </kbd>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3">
          {renderContent()}
        </div>

        <div className="hidden items-center justify-between gap-3 border-t border-neutral-200 px-4 py-2.5 text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400 sm:flex">
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-neutral-300 px-1.5 py-0.5 dark:border-neutral-700">
              ↑
            </kbd>
            <kbd className="rounded border border-neutral-300 px-1.5 py-0.5 dark:border-neutral-700">
              ↓
            </kbd>
            navegar
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-neutral-300 px-1.5 py-0.5 dark:border-neutral-700">
              Enter
            </kbd>
            abrir
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-neutral-300 px-1.5 py-0.5 dark:border-neutral-700">
              Esc
            </kbd>
            fechar
          </span>
        </div>
      </div>
    </div>,
    document.body,
  )
}
