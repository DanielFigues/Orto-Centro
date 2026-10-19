import SplitText from '../bits/SplitText'
import SpecularButton from '../bits/SpecularButton'
import { Icon } from '../ui/Icon'

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex h-[70vh] items-center overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-700 via-slate-900 to-black scroll-mt-40"
    >
      <div className="relative z-10 mx-auto w-full px-4 py-16 sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h1 className="flex flex-wrap items-baseline justify-center gap-x-4">
            <SplitText
              text="Orto"
              tag="span"
              className="text-6xl font-bold leading-none tracking-[0.08em] text-white sm:text-8xl"
              splitType="words, chars"
              duration={0.9}
              delay={45}
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
            />
            <SplitText
              text="Centro"
              tag="span"
              className="text-6xl font-bold leading-none tracking-[0.08em] text-green-400 sm:text-8xl"
              splitType="words, chars"
              duration={0.9}
              delay={120}
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
            />
          </h1>
          <p className="mt-7 max-w-xl text-xs font-light uppercase tracking-[0.35em] text-slate-300 sm:text-sm">
            Produtos de apoio e acessibilidade para o seu dia a dia
          </p>
          <p className="mt-4 max-w-xl font-light leading-relaxed text-slate-400">
            Cadeiras de rodas, andadores, auxiliares de higiene e itens de apoio
            cotidiano. Navegue pelas categorias e encontre o produto ideal para
            cada necessidade.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <SpecularButton
              href="#catalogo"
              size="md"
              tint="#0284c7"
              tintOpacity={1}
              baseColor="#ffffff"
              lineColor="#0f172a"
              textColor="#0f172a"
              radius={14}
            >
              <span className="inline-flex items-center gap-2">
                Ver produtos
                <Icon name="arrow-right" className="h-4 w-4" />
              </span>
            </SpecularButton>
            <SpecularButton
              href="#contato"
              size="md"
              tint="#ffffff"
              tintOpacity={1}
              baseColor="#f8fafc"
              lineColor="#0f172a"
              textColor="#0f172a"
              radius={14}
            >
              <span className="inline-flex items-center gap-2">
                <Icon name="phone" className="h-4 w-4 text-sky-700" />
                Falar conosco
              </span>
            </SpecularButton>
          </div>
        </div>
      </div>

      <a
        href="#catalogo"
        className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-neutral-500 transition-colors hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
        aria-label="Ver produtos"
      >
        <Icon name="chevron-down" className="h-8 w-8 animate-bounce text-sky-400" />
      </a>
    </section>
  )
}
