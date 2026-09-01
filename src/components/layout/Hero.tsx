import type { ReactNode } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { products } from '../../data/products'
import GridMotion from '../bits/GridMotion'
import GradientText from '../bits/GradientText'
import SpecularButton from '../bits/SpecularButton'
import SplitText from '../bits/SplitText'
import { Icon } from '../ui/Icon'

function buildGridItems(): ReactNode[] {
  const tiles = products.map((product) =>
    product.imageUrl
      ? product.imageUrl
      : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 p-2">
            <Icon
              name={product.image}
              className="h-6 w-6 text-sky-600 dark:text-sky-400"
            />
            <span className="line-clamp-1 max-w-full text-xs font-medium text-neutral-700 dark:text-neutral-300">
              {product.name}
            </span>
          </div>
        ),
  )

  return Array.from({ length: 28 }, (_, index) => tiles[index % tiles.length])
}

export function Hero() {
  const { theme } = useTheme()
  const gradientColor =
    theme === 'dark' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(56, 189, 248, 0.25)'

  return (
    <section
      id="inicio"
      className="relative flex min-h-svh items-center overflow-hidden scroll-mt-40"
    >
      <div className="absolute inset-0 isolate" aria-hidden="true">
        <GridMotion items={buildGridItems()} gradientColor={gradientColor} />
      </div>
      <div
        className="absolute inset-0 bg-neutral-50/50 dark:bg-neutral-950/50"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full px-4 py-20 sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h1>
            <GradientText colors={['#7dd3fc', '#38bdf8', '#0284c7']} animationSpeed={3}>
              <span className="flex flex-wrap items-baseline justify-center gap-x-3">
                <SplitText
                  text="Cuidar"
                  tag="span"
                  className="text-6xl font-bold leading-none tracking-tight sm:text-8xl"
                  splitType="words, chars"
                  duration={0.9}
                  delay={45}
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                />
                <SplitText
                  text="Bem"
                  tag="span"
                  className="text-6xl font-bold leading-none tracking-tight sm:text-8xl"
                  splitType="words, chars"
                  duration={0.9}
                  delay={120}
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                />
              </span>
            </GradientText>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-neutral-600 dark:text-neutral-300">
            Produtos de apoio e acessibilidade para o seu dia a dia
          </p>
          <p className="mt-2 max-w-xl text-neutral-500 dark:text-neutral-400">
            Cadeiras de rodas, andadores, auxiliares de higiene e itens de apoio
            cotidiano. Navegue pelas categorias e encontre o produto ideal para
            cada necessidade.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <SpecularButton
              href="#mobilidade"
              size="md"
              tint="#0284c7"
              tintOpacity={1}
              baseColor="#ffffff"
              lineColor="#ffffff"
              textColor="#ffffff"
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
              baseColor="#e5e5e5"
              lineColor="#38bdf8"
              textColor="#404040"
              radius={14}
            >
              <span className="inline-flex items-center gap-2">
                <Icon name="phone" className="h-4 w-4 text-sky-600" />
                Falar conosco
              </span>
            </SpecularButton>
          </div>
        </div>
      </div>

      <a
        href="#mobilidade"
        className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-neutral-500 transition-colors hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
        aria-label="Ver produtos"
      >
        <Icon name="chevron-down" className="h-8 w-8 animate-bounce text-sky-600 dark:text-sky-400" />
      </a>
    </section>
  )
}
