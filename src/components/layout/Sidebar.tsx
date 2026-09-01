import { useEffect, useState } from 'react'
import { sectionLinks } from '../../data/sections'
import { categories } from '../../data/products'
import { Icon } from '../ui/Icon'

function gradientOf(id: string) {
  return categories.find((c) => c.id === id)?.gradient ?? 'from-sky-500 to-sky-600'
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [activeId, setActiveId] = useState(sectionLinks[0].id)

  useEffect(() => {
    const onScroll = () => {
      const threshold = 160
      let current = sectionLinks[0].id
      for (const { id } of sectionLinks) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= threshold) {
          current = id
        }
      }
      setActiveId(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <aside
      className={`hidden shrink-0 transition-[width] duration-300 lg:block ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      <nav
        className="sticky top-[7.5rem] max-h-[calc(100svh-8.25rem)] overflow-y-auto pb-8"
        aria-label="Navegação por seções"
      >
        <div className="overflow-hidden p-3">
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-expanded={!collapsed}
            aria-label={collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
            className={`mb-2 flex items-center rounded-xl text-xs font-semibold text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white ${
              collapsed ? 'mx-auto h-9 w-9 justify-center gap-0 p-0' : 'w-full gap-2 px-2 py-2'
            }`}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-sky-600 text-white shadow-sm shadow-sky-500/30">
              <Icon name="menu" className="h-6 w-6" />
            </span>
            <span
              className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                collapsed ? 'max-w-0 opacity-0' : 'max-w-32 opacity-100'
              }`}
            >
              Recolher menu
            </span>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              collapsed ? 'max-h-0 opacity-0' : 'mb-2 mt-4 max-h-10 opacity-100'
            }`}
          >
            <div className="flex items-center gap-2 px-1">
              <span className="h-4 w-1 rounded-full bg-gradient-to-b from-sky-400 to-sky-600" />
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Categorias
              </p>
            </div>
          </div>

          <ul className={collapsed ? 'space-y-3' : 'space-y-1.5'}>
            {sectionLinks.map(({ id, label, icon }) => {
              const gradient = gradientOf(id)
              const isActive = id === activeId

              return (
                <li key={id} className={collapsed ? 'flex justify-center' : ''}>
                  <a
                    href={`#${id}`}
                    title={collapsed ? label : undefined}
                    aria-label={collapsed ? label : undefined}
                    className={`flex items-center rounded-xl text-sm font-medium transition-all ${
                      collapsed ? 'h-9 w-9 justify-center gap-0 p-0' : 'gap-2.5 px-2 py-1.5'
                    } ${
                      isActive
                        ? 'bg-neutral-100 text-sky-700 dark:bg-neutral-800 dark:text-sky-400'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                        isActive
                          ? `bg-gradient-to-br ${gradient} text-white shadow-md shadow-sky-500/25`
                          : 'bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400'
                      }`}
                    >
                      <Icon name={icon} className="h-5 w-5" />
                    </span>
                    <span
                      className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                        collapsed ? 'max-w-0 opacity-0' : 'max-w-40 opacity-100'
                      }`}
                    >
                      {label}
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>
    </aside>
  )
}
