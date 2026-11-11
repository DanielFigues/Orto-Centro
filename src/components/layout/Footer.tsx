import { Link, useLocation } from 'react-router-dom'
import { categories, categoryPath } from '../../data/categories'
import { contact, sectionLinks } from '../../data/sections'
import { Icon } from '../ui/Icon'

const linkClass =
  'focus-ring inline-flex min-h-11 min-w-11 items-center rounded text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white'

export function Footer() {
  const { pathname } = useLocation()

  return (
    <footer className="border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center" aria-label="Orto Centro- Voltar ao início">
            <img
              src="/logo.png"
              alt="Orto Centro"
              width={174}
              height={154}
              loading="lazy"
              decoding="async"
              className="h-10 w-auto object-contain"
            />
          </Link>
          <p className="mt-4 max-w-[60ch] text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Produtos de apoio e acessibilidade para o dia a dia, com cuidado e
            qualidade para você e sua família.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-900 dark:text-white">
            Categorias
          </h3>
          <ul className="mt-4 space-y-1 text-sm">
            {categories.map((category) => (
              <li key={category.id}>
                <Link to={categoryPath(category)} className={linkClass}>
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-900 dark:text-white">
            Seções
          </h3>
          <ul className="mt-4 space-y-1 text-sm">
            {sectionLinks.map(({ id, label }) => (
              <li key={id}>
                {id === 'inicio' ? (
                  <Link to="/" className={linkClass}>
                    {label}
                  </Link>
                ) : pathname === '/' ? (
                  <a href={`#${id}`} className={linkClass}>
                    {label}
                  </a>
                ) : (
                  <Link to={`/#${id}`} className={linkClass}>
                    {label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-900 dark:text-white">
            Atendimento
          </h3>
          <ul className="mt-4 space-y-1 text-sm text-neutral-600 dark:text-neutral-300">
            <li>
              <a
                href={contact.phoneHref}
                className={`${linkClass} gap-2`}
              >
                <Icon name="phone" className="h-4 w-4 shrink-0 text-sky-700 dark:text-sky-300" />
                {contact.phone}
              </a>
            </li>
            <li>
              <a
                href={contact.emailHref}
                className={`${linkClass} gap-2`}
              >
                <Icon name="mail" className="h-4 w-4 shrink-0 text-sky-700 dark:text-sky-300" />
                {contact.email}
              </a>
            </li>
            <li className="flex min-h-11 items-center gap-2">
              <Icon name="clock" className="h-4 w-4 shrink-0 text-sky-700 dark:text-sky-300" />
              {contact.hours}
            </li>
            <li>
              <a
                href={contact.addressHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkClass} gap-2`}
              >
                <Icon name="pin" className="h-4 w-4 shrink-0 text-sky-700 dark:text-sky-300" />
                {contact.address}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-neutral-200 py-5 text-center text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
        © {new Date().getFullYear()} Orto Centro. Todos os direitos reservados.
      </div>
    </footer>
  )
}
