import { useState } from 'react'
import { sectionLinks } from '../../data/sections'
import { Icon } from '../ui/Icon'

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`hidden shrink-0 transition-[width] duration-300 lg:block ${
        collapsed ? 'w-14' : 'w-56'
      }`}
    >
      <nav
        className="sticky top-[6.25rem] max-h-[calc(100svh-7rem)] overflow-y-auto pb-8"
        aria-label="Navegação por seções"
      >
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-expanded={!collapsed}
          aria-label={collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
          className={`mb-3 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white ${
            collapsed ? 'justify-center px-0' : ''
          }`}
        >
          <Icon name="menu" className="h-4 w-4 text-sky-600 dark:text-sky-400" />
          {!collapsed && <span>Recolher menu</span>}
        </button>

        {!collapsed && (
          <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
            Categorias
          </p>
        )}

        <ul className={collapsed ? 'space-y-2' : 'space-y-0.5'}>
          {sectionLinks.map(({ id, label, icon }) => (
            <li key={id} className={collapsed ? 'flex justify-center' : ''}>
              <a
                href={`#${id}`}
                title={collapsed ? label : undefined}
                aria-label={collapsed ? label : undefined}
                className={`flex items-center gap-2.5 rounded-lg text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white ${
                  collapsed
                    ? 'w-10 justify-center px-0 py-2.5'
                    : 'px-2 py-2'
                }`}
              >
                <span
                  className={`flex items-center justify-center rounded-md bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400 ${
                    collapsed ? 'h-9 w-9' : 'h-7 w-7'
                  }`}
                >
                  <Icon name={icon} className="h-4 w-4" />
                </span>
                {!collapsed && <span>{label}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
