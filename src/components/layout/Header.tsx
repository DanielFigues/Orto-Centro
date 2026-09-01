import { useEffect, useState } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { contact, sectionLinks } from '../../data/sections'
import { Icon } from '../ui/Icon'

export function Header() {
  const { theme, toggleTheme } = useTheme()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY >= window.innerHeight)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`flex h-9 items-center justify-between gap-4 border-b px-4 text-xs transition-colors duration-300 sm:px-6 ${
          visible
            ? 'border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900'
            : 'border-transparent bg-transparent'
        }`}
      >
        <p className="hidden truncate text-neutral-600 sm:block dark:text-neutral-400">
          Cuidado, conforto e acessibilidade para o seu dia a dia.
        </p>
        <a
          href={contact.phoneHref}
          className="ml-auto flex items-center gap-1.5 font-medium text-neutral-700 hover:text-neutral-900 sm:ml-0 dark:text-neutral-300 dark:hover:text-white"
        >
          <Icon name="phone" className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
          {contact.phone}
        </a>
      </div>

      <div
        className={`border-b transition-colors duration-300 ${
          visible
            ? 'border-neutral-200 bg-white/90 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/90'
            : 'border-transparent bg-transparent backdrop-blur-none'
        }`}
      >
        <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <a href="#inicio" className="flex items-center gap-2.5" aria-label="Cuidar Bem - Voltar ao início">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-600 text-white dark:bg-sky-500 dark:text-white">
              <Icon name="heart" className="h-5 w-5" />
            </span>
            <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Cuidar
              <span className="text-neutral-400 dark:text-neutral-500">Bem</span>
            </span>
          </a>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
            className="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            {theme === 'dark' ? <Icon name="sun" /> : <Icon name="moon" />}
          </button>
        </div>

        <nav className="flex gap-1.5 overflow-x-auto px-4 pb-3 lg:hidden" aria-label="Navegação por seções">
          {sectionLinks.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className="whitespace-nowrap rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
