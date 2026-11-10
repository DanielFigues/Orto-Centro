import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import {
  categories,
  categoryPath,
  categoryPathWithSubcategory,
} from '../../data/categories'
import type { Category } from '../../data/categories'
import { SearchDialog } from '../search/SearchDialog'
import { Icon } from '../ui/Icon'

function CategoryMenuItem({
  category,
  visible,
  isActive,
}: {
  category: Category
  visible: boolean
  isActive: boolean
}) {
  const baseClass = !visible
    ? 'text-neutral-900 hover:text-neutral-700 dark:text-neutral-100 dark:hover:text-white'
    : 'text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white'

  return (
    <div className="group relative">
      <Link
        to={categoryPath(category)}
        aria-haspopup={category.subcategories.length > 0 ? 'menu' : undefined}
        className={`flex items-center gap-1 rounded-lg py-2 text-[16px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60 ${
          isActive ? 'text-sky-700 dark:text-sky-300' : baseClass
        }`}
      >
        {category.name}
        {category.subcategories.length > 0 && (
          <Icon
            name="chevron-down"
            className="h-3.5 w-3.5 opacity-80 transition-transform duration-200 group-hover:rotate-180"
          />
        )}
      </Link>

      {category.subcategories.length > 0 && (
        <div className="invisible absolute left-0 top-full z-50 translate-y-1 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
          <div className="header-glass-panel max-h-[70svh] w-64 overflow-y-auto rounded-md border border-neutral-200 p-1.5 shadow-lg dark:border-neutral-800">
            {category.subcategories.map((subcategory) => (
              <Link
                key={subcategory.slug}
                to={categoryPathWithSubcategory(category, subcategory)}
                className="block w-full rounded px-3 py-2 text-left text-sm text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                {subcategory.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function Header() {
  const { theme, toggleTheme } = useTheme()
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const searchButtonRef = useRef<HTMLButtonElement>(null)
  const inlineCount = Math.min(6, categories.length)
  const primaryCategories = categories.slice(0, inlineCount)
  const moreCategories = categories.slice(inlineCount)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeSearch = useCallback(() => {
    setSearchOpen(false)
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const tagName = target?.tagName
      const isEditable =
        target?.isContentEditable === true ||
        tagName === 'INPUT' ||
        tagName === 'TEXTAREA' ||
        tagName === 'SELECT'
      const isCommandK =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k'
      const isSlash =
        event.key === '/' &&
        !isEditable &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey

      if (!isCommandK && !isSlash) return

      event.preventDefault()
      setSearchOpen(true)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const atTop = !scrolled
  const isHome = pathname === '/'
  const overHero = atTop && isHome
  const headerLinkClass = overHero
    ? 'text-neutral-900 hover:text-neutral-700 dark:text-neutral-100 dark:hover:text-white'
    : 'text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white'
  const headerIconClass = overHero
    ? 'text-neutral-900 hover:bg-black/5 hover:text-neutral-700 dark:text-neutral-100 dark:hover:bg-white/10 dark:hover:text-white'
    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-colors duration-300 ${
          overHero ? 'bg-transparent' : 'header-glass'
        }`}
      >
        <div
          className={`border-b transition-colors duration-300 ${
            overHero
              ? 'border-transparent'
              : 'border-neutral-200 dark:border-neutral-800'
          }`}
        >
          <div className="container flex h-[64px] items-center justify-between gap-4">
            <Link
              to="/"
              className="flex shrink-0 items-center"
              aria-label="Orto Centro- Voltar ao início"
            >
              <img
                src="/logo.png"
                alt="Orto Centro"
                width={174}
                height={154}
                decoding="async"
                className="h-10 w-auto object-contain"
              />
            </Link>

            <nav
              className="hidden flex-1 items-center justify-center gap-[28px] lg:flex"
              aria-label="Categorias de produtos"
            >
              {primaryCategories.map((category) => (
                <CategoryMenuItem
                  key={category.id}
                  category={category}
                  visible={!overHero}
                  isActive={pathname === categoryPath(category)}
                />
              ))}

              {moreCategories.length > 0 && (
                <div className="group relative">
                  <button
                    type="button"
                    className={`flex items-center gap-1 rounded-lg py-2 text-[16px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60 ${headerLinkClass}`}
                    aria-haspopup="menu"
                  >
                    Mais
                    <Icon
                      name="chevron-down"
                      className="h-3.5 w-3.5 opacity-80 transition-transform duration-200 group-hover:rotate-180"
                    />
                  </button>

                  <div className="invisible absolute right-0 top-full z-50 translate-y-1 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    <div className="header-glass-panel max-h-[70svh] w-80 overflow-y-auto rounded-md border border-neutral-200 p-2 shadow-lg dark:border-neutral-800">
                      {moreCategories.map((category) => (
                        <div key={category.id} className="rounded-md p-1">
                          <Link
                            to={categoryPath(category)}
                            className="block rounded px-3 py-2 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-100 dark:text-white dark:hover:bg-slate-800"
                          >
                            {category.name}
                          </Link>
                          {category.subcategories.length > 0 && (
                            <div className="px-1 pb-1">
                              {category.subcategories.map((subcategory) => (
                                <Link
                                  key={subcategory.slug}
                                  to={categoryPathWithSubcategory(
                                    category,
                                    subcategory,
                                  )}
                                  className="block rounded px-3 py-1.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-slate-800 dark:hover:text-white"
                                >
                                  {subcategory.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </nav>

            <div className="flex shrink-0 items-center gap-1">
              <button
                ref={searchButtonRef}
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Buscar produtos"
                aria-haspopup="dialog"
                aria-keyshortcuts="/ Control+K Meta+K"
                className={`focus-ring inline-flex h-11 w-11 items-center justify-center rounded-button transition-colors ${headerIconClass}`}
              >
                <Icon name="search" className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
                className={`focus-ring inline-flex h-11 w-11 items-center justify-center rounded-button transition-colors ${headerIconClass}`}
              >
                {theme === 'dark' ? <Icon name="sun" /> : <Icon name="moon" />}
              </button>
            </div>
          </div>

          <nav
            className="container flex gap-1.5 overflow-x-auto pb-3 lg:hidden"
            aria-label="Categorias"
          >
            {categories.map((category) => {
              const path = categoryPath(category)
              const isActive = pathname === path
              return (
                <Link
                  key={category.id}
                  to={path}
                  className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive
                      ? 'border-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                      : overHero
                        ? 'border-neutral-300 bg-white/70 text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900/70 dark:text-neutral-100'
                        : 'header-glass border-neutral-200 text-neutral-700 hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  {category.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>
      {searchOpen && (
        <SearchDialog onClose={closeSearch} returnFocusRef={searchButtonRef} />
      )}
    </>
  )
}
