import SplitText from '../bits/SplitText'
import { Icon } from '../ui/Icon'

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative isolate flex min-h-svh flex-col overflow-hidden bg-cover bg-center md:bg-fixed"
      style={{ backgroundImage: 'url(/acessibilidade.png)' }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-black/55"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 z-0 h-3/4 bg-gradient-to-t from-black/90 via-black/45 to-transparent"
      />

      <div className="relative z-10 flex flex-1 items-center justify-center px-[var(--page-gutter)] pb-10 pt-36 sm:pt-32 lg:pt-24">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
          <div className="flex gap-4 text-5xl font-black sm:text-6xl md:text-8xl">
            <div className="text-blue-500">
              <SplitText
                text="Orto"
                tag="span"
                splitType="chars"
                duration={0.5}
                delay={25}
                from={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
                to={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              />
            </div>
            <div className="text-green-500">
              <SplitText
                text="Centro"
                tag="span"
                splitType="chars"
                duration={0.5}
                delay={25}
                from={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
                to={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              />
            </div>
          </div>

          <p className="mt-6 max-w-xl text-body font-medium uppercase tracking-widest text-white motion-safe:animate-hero-subtitle sm:mt-7 sm:text-body-lg">
            Produtos de apoio e acessibilidade para o seu dia a dia
          </p>
        </div>
      </div>

      <div className="relative z-10 flex justify-center pb-8">
        <a
          href="#categorias"
          className="focus-ring group inline-flex min-h-11 items-center gap-2 rounded-pill px-4 text-label font-medium uppercase tracking-widest text-white/90 transition-colors hover:text-white"
        >
          Ver categorias
          <Icon
            name="chevron-down"
            className="h-4 w-4 motion-safe:animate-hero-cue"
          />
        </a>
      </div>
    </section>
  )
}
