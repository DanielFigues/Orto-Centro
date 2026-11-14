import { storeInfo } from '../../data/store'
import { Icon } from '../ui/Icon'

export function LocationHours() {
  return (
    <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
      <div className="flex flex-col gap-5 rounded-card-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="text-h3 font-semibold text-neutral-900 dark:text-white">
          Visite a loja
        </h3>

        <ul className="flex flex-col gap-3">
          <li>
            <a
              href={storeInfo.addressHref}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring flex min-h-11 items-start gap-3 rounded-button px-1 py-1 text-body text-neutral-700 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
            >
              <Icon
                name="pin"
                className="mt-0.5 h-5 w-5 shrink-0 text-sky-700 dark:text-sky-300"
              />
              <span>
                <span className="block text-label font-medium text-neutral-500 dark:text-neutral-400">
                  Endereço
                </span>
                <span className="block leading-relaxed">{storeInfo.address}</span>
                <span className="mt-1 block leading-relaxed">
                  {storeInfo.parking}
                </span>
              </span>
            </a>
          </li>
          <li className="flex min-h-11 items-start gap-3 px-1 py-1 text-body text-neutral-700 dark:text-neutral-300">
            <Icon
              name="clock"
              className="mt-0.5 h-5 w-5 shrink-0 text-sky-700 dark:text-sky-300"
            />
            <span>
              <span className="block text-label font-medium text-neutral-500 dark:text-neutral-400">
                Horário de funcionamento
              </span>
              <span className="block leading-relaxed">{storeInfo.hours}</span>
            </span>
          </li>
        </ul>

        <p className="text-label text-neutral-500 dark:text-neutral-400">
          {/* TODO: confirme o horário de funcionamento no arquivo de configuração da loja. */}
          O horário de funcionamento deve ser confirmado com a loja.
        </p>
      </div>

      <div className="overflow-hidden rounded-card-lg border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800">
        <iframe
          title={storeInfo.mapTitle}
          src={storeInfo.mapEmbedSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="h-80 w-full border-0 lg:h-full lg:min-h-[360px]"
        />
      </div>
    </div>
  )
}
