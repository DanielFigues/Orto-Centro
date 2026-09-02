import { contact, sectionLinks } from '../../data/sections'
import { Icon } from '../ui/Icon'

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto grid gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        <div>
          <a href="#inicio" className="flex items-center gap-2.5" aria-label="Orto Centro- Voltar ao início">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-800 text-white dark:bg-blue-500 dark:text-white">
              <Icon name="heart" className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold tracking-tight text-blue-800 dark:text-blue-400">
              Orto<span className="text-green-600 dark:text-green-500">Centro</span>
            </span>
          </a>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Produtos de apoio e acessibilidade para o dia a dia, com cuidado e
            qualidade para você e sua família.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-900 dark:text-white">
            Seções
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {sectionLinks.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-900 dark:text-white">
            Atendimento
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-neutral-600 dark:text-neutral-400">
            <li>
              <a href={contact.phoneHref} className="flex items-center gap-2 transition-colors hover:text-neutral-900 dark:hover:text-white">
                <Icon name="phone" className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                {contact.phone}
              </a>
            </li>
            <li>
              <a href={contact.emailHref} className="flex items-center gap-2 transition-colors hover:text-neutral-900 dark:hover:text-white">
                <Icon name="mail" className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                {contact.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Icon name="clock" className="h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" />
              {contact.hours}
            </li>
            <li>
              <a
                href={contact.addressHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-neutral-900 dark:hover:text-white"
              >
                <Icon name="pin" className="h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" />
                {contact.address}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-neutral-200 py-5 text-center text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-500">
        © {new Date().getFullYear()} Orto Centro. Todos os direitos reservados.
      </div>
    </footer>
  )
}
