import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
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

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

function CategoryMenuItem({
  category,
  visible,
  isActive,
}: {
  category: Category
  visible: boolean
  isActive: boolean
}) {
  return (
    <div className="group relative flex-none">
      <Link
        to={categoryPath(category)}
        aria-haspopup={category.subcategories.length > 0 ? 'menu' : undefined}
        className={`inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60 ${
          isActive
            ? 'text-sky-700 dark:text-sky-300'
            : visible
              ? 'text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white'
              : 'text-slate-800 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white'
        }`}
      >
        <span>{category.name}</span>
        {category.subcategories.length > 0 && (
          <Icon
            name="chevron-down"
            className="h-3.5 w-3.5 opacity-60 transition-transform duration-200 group-hover:rotate-180"
          />
        )}
      </Link>

      {category.subcategories.length > 0 && (
        <div className="invisible absolute left-0 top-full z-50 translate-y-1 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
          <div className="max-h-[70svh] w-64 overflow-y-auto rounded-md border border-neutral-200 bg-white p-1.5 shadow-lg dark:border-neutral-800 dark:bg-slate-900">
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

function MobileMenu({
  open,
  onClose,
  returnFocusRef,
}: {
  open: boolean
  onClose: () => void
  returnFocusRef: React.RefObject<HTMLButtonElement | null>
}) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    const trigger = returnFocusRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 0)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const container = dialogRef.current
      if (!container) return
      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => !el.hasAttribute('disabled') && el.tabIndex !== -1)
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement as HTMLElement | null
      if (event.shiftKey) {
        if (active === first || !container.contains(active)) {
          event.preventDefault()
          last.focus()
        }
      } else if (active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.clearTimeout(focusTimer)
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      trigger?.focus()
    }
  }, [open, onClose, returnFocusRef])

  if (!open) return null

  return (
    <div
      id="mobile-menu-dialog"
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[60] flex flex-col bg-white dark:bg-neutral-950 lg:hidden"
    >
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-200 px-4 dark:border-neutral-800">
        <h2 id={titleId} className="text-base font-semibold text-neutral-900 dark:text-white">
          Menu
        </h2>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Fechar menu"
          className="focus-ring inline-flex h-11 min-h-11 w-11 min-w-11 items-center justify-center rounded-button text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
        >
          <Icon name="x" className="h-6 w-6" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto overscroll-contain px-4 py-4" aria-label="Categorias">
        <ul className="flex flex-col gap-1">
          {categories.map((category) => {
            const isOpen = expanded === category.id
            const panelId = `mobile-cat-${category.id}`
            return (
              <li key={category.id} className="border-b border-neutral-100 dark:border-neutral-900">
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : category.id)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="focus-ring flex min-h-14 w-full items-center justify-between gap-3 py-3 text-left text-base font-medium text-neutral-900 dark:text-white"
                >
                  <span>{category.name}</span>
                  <Icon
                    name="chevron-down"
                    className={`h-5 w-5 shrink-0 text-neutral-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div id={panelId} className="pb-3 pl-1">
                    <Link
                      to={categoryPath(category)}
                      onClick={onClose}
                      className="focus-ring flex min-h-11 items-center rounded-md px-3 py-2 text-sm font-semibold text-sky-700 dark:text-sky-300"
                    >
                      Ver tudo em {category.name}
                    </Link>
                    <ul className="mt-1 flex flex-col">
                      {category.subcategories.map((subcategory) => (
                        <li key={subcategory.slug}>
                          <Link
                            to={categoryPathWithSubcategory(category, subcategory)}
                            onClick={onClose}
                            className="focus-ring flex min-h-11 items-center rounded-md px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                          >
                            {subcategory.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}

export function Header() {
  const { theme, toggleTheme } = useTheme()
  const { pathname } = useLocation()
  const [visible, setVisible] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(categories.length)
  const searchButtonRef = useRef<HTMLButtonElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const navWrapRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Array<HTMLDivElement | null>>([])
  const moreMeasureRef = useRef<HTMLButtonElement | null>(null)

  const primaryCategories = categories.slice(0, visibleCount)
  const moreCategories = categories.slice(visibleCount)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeSearch = useCallback(() => {
    setSearchOpen(false)
  }, [])
  const closeMenu = useCallback(() => {
    setMenuOpen(false)
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

  useEffect(() => {
    if (!menuOpen) return
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => {
      if (mq.matches) setMenuOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [menuOpen])

  useLayoutEffect(() => {
    const wrap = navWrapRef.current
    const measure = measureRef.current
    if (!wrap || !measure) return

    const update = () => {
      const available = wrap.clientWidth
      if (available <= 0) {
        setVisibleCount(categories.length)
        return
      }

      const widths = itemRefs.current.map((el) => el?.offsetWidth ?? 0)
      const moreWidth = moreMeasureRef.current?.offsetWidth ?? 0
      const gap = 4 // gap-1
      const totalWidth =
        widths.reduce((sum, w) => sum + w, 0) + Math.max(0, widths.length - 1) * gap

      if (totalWidth <= available) {
        setVisibleCount(categories.length)
        return
      }

      let used = 0
      let count = 0
      for (let i = 0; i < widths.length; i++) {
        const w = widths[i]
        const gapW = count > 0 ? gap : 0
        const reserveMore = i < widths.length - 1 ? gap + moreWidth : 0
        if (used + gapW + w + reserveMore <= available) {
          used += gapW + w
          count++
        } else {
          break
        }
      }
      setVisibleCount(count)
    }

    update()

    const ro = new ResizeObserver(() => update())
    ro.observe(wrap)
    ro.observe(measure)
    window.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  const iconBtnClass = `focus-ring inline-flex h-11 w-11 items-center justify-center rounded-button transition-colors ${
    visible
      ? 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
      : 'text-slate-800 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white'
  }`

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          visible
            ? 'bg-white shadow-md dark:bg-neutral-800'
            : 'bg-transparent shadow-none'
        }`}
      >
        <div className="border-b border-neutral-200/70 dark:border-neutral-800/70">
          <div className="container flex h-14 items-center justify-between gap-2 lg:h-[var(--header-height)] lg:gap-4">
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
                className="h-9 w-auto object-contain lg:h-10"
              />
            </Link>

            <div
              ref={navWrapRef}
              className="relative hidden min-w-0 flex-1 lg:flex lg:items-center lg:justify-center"
            >
              <nav
                className="flex min-w-0 items-center justify-center gap-1"
                aria-label="Categorias de produtos"
              >
                {primaryCategories.map((category) => (
                  <CategoryMenuItem
                    key={category.id}
                    category={category}
                    visible={visible}
                    isActive={pathname === categoryPath(category)}
                  />
                ))}

                {moreCategories.length > 0 && (
                  <div className="group relative flex-none">
                    <button
                      type="button"
                      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60 ${
                        visible
                          ? 'text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white'
                          : 'text-slate-800 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white'
                      }`}
                      aria-haspopup="menu"
                    >
                      <span>Mais</span>
                      <Icon
                        name="chevron-down"
                        className="h-3.5 w-3.5 opacity-60 transition-transform duration-200 group-hover:rotate-180"
                      />
                    </button>

                    <div className="invisible absolute right-0 top-full z-50 translate-y-1 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                      <div className="max-h-[70svh] w-80 overflow-y-auto rounded-md border border-neutral-200 bg-white p-2 shadow-lg dark:border-neutral-800 dark:bg-slate-900">
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

              {/* Measurement copy for priority+ nav (no hardcoded counts) */}
              <div
                ref={measureRef}
                aria-hidden="true"
                className="pointer-events-none invisible absolute left-0 top-0 -z-10 flex items-center gap-1"
              >
                {categories.map((category, index) => (
                  <div
                    key={category.id}
                    ref={(el) => {
                      itemRefs.current[index] = el
                    }}
                    className="flex-none"
                  >
                    <div className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium">
                      <span>{category.name}</span>
                      {category.subcategories.length > 0 ? (
                        <Icon name="chevron-down" className="h-3.5 w-3.5" />
                      ) : null}
                    </div>
                  </div>
                ))}
                <button
                  ref={moreMeasureRef}
                  type="button"
                  tabIndex={-1}
                  className="inline-flex flex-none items-center gap-1 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium"
                >
                  <span>Mais</span>
                  <Icon name="chevron-down" className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
              <button
                ref={searchButtonRef}
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Buscar produtos"
                aria-haspopup="dialog"
                aria-keyshortcuts="/ Control+K Meta+K"
                className={iconBtnClass}
              >
                <Icon name="search" className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
                className={iconBtnClass}
              >
                {theme === 'dark' ? <Icon name="sun" /> : <Icon name="moon" />}
              </button>

              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Abrir menu"
                aria-haspopup="dialog"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu-dialog"
                className={`${iconBtnClass} lg:hidden`}
              >
                <Icon name="menu" className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} returnFocusRef={menuButtonRef} />

      {searchOpen && (
        <SearchDialog onClose={closeSearch} returnFocusRef={searchButtonRef} />
      )}
    </>
  )
}
