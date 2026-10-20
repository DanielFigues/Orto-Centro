import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import { sectionLinks } from '../../data/sections'
import { useCatalog } from '../../context/catalogContextValue'
import { Icon } from '../ui/Icon'

export function Header() {
  const { theme, toggleTheme } = useTheme()
  const { pathname } = useLocation()
  const { categories } = useCatalog()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        visible
          ? 'bg-white shadow-md dark:bg-slate-900'
          : 'bg-transparent shadow-none'
      }`}
    >
      <div className="border-b border-neutral-200/70 dark:border-neutral-800/70">
        <div className="mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="Orto Centro- Voltar ao início">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-800 text-white dark:bg-blue-500 dark:text-white">
              <Icon name="heart" className="h-5 w-5" />
            </span>
            <span className="text-xl font-bold tracking-tight text-blue-800 dark:text-blue-400">
              Orto
              <span className="text-green-600 dark:text-green-500">Centro</span>
            </span>
          </Link>

          <nav
            className="hidden flex-1 items-center justify-center gap-1 lg:flex"
            aria-label="Categorias de produtos"
          >
            {categories.map(({ name, subcategories }) => {
              const categoryPath = `/categoria/${encodeURIComponent(name)}`
              const isActive = pathname === categoryPath

              return (
                <div key={name} className="group relative">
                  <Link
                    to={categoryPath}
                    aria-haspopup={subcategories.length > 0 ? 'menu' : undefined}
                    className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60 ${
                      isActive
                        ? 'text-sky-600 dark:text-sky-400'
                        : visible
                          ? 'text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white'
                          : 'text-slate-800 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white'
                    }`}
                  >
                    {name}
                    {subcategories.length > 0 && (
                      <Icon
                        name="chevron-down"
                        className="h-3.5 w-3.5 opacity-60 transition-transform duration-200 group-hover:rotate-180"
                      />
                    )}
                  </Link>

                  {subcategories.length > 0 && (
                    <div className="invisible absolute left-0 top-full z-50 translate-y-1 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                      <div className="w-60 rounded-md border border-neutral-200 bg-white p-1.5 shadow-lg dark:border-neutral-800 dark:bg-slate-900">
                        {subcategories.map((subcategory) => (
                          <Link
                            key={subcategory}
                            to={`${categoryPath}?subcategoria=${encodeURIComponent(subcategory)}`}
                            className="block w-full rounded px-3 py-2 text-left text-sm text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-slate-800 dark:hover:text-white"
                          >
                            {subcategory}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
            className={`shrink-0 rounded-lg p-2 transition-colors ${
              visible
                ? 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
                : 'text-slate-800 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white'
            }`}
          >
            {theme === 'dark' ? <Icon name="sun" /> : <Icon name="moon" />}
          </button>
        </div>

        <nav className="flex gap-1.5 overflow-x-auto px-4 pb-3 lg:hidden" aria-label="Navegação por seções">
          {sectionLinks.map(({ id, label }) => {
            const className =
              'whitespace-nowrap rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800'

            if (id === 'inicio') {
              return (
                <Link key={id} to="/" className={className}>
                  {label}
                </Link>
              )
            }

            if (pathname === '/') {
              return (
                <a key={id} href={`#${id}`} className={className}>
                  {label}
                </a>
              )
            }

            return (
              <Link key={id} to={`/#${id}`} className={className}>
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
