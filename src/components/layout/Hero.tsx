import SplitText from '../bits/SplitText'

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-[70vh] flex items-center justify-center bg-fixed bg-cover bg-center overflow-hidden scroll-mt-40"
      style={{ backgroundImage: 'url(/acessibilidade.png)' }}
    >
      <div className="absolute inset-0 bg-black/70 z-0" />

      <div className="relative z-10 mx-auto w-full px-4 py-16 sm:px-6">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <div className="flex gap-4 text-6xl md:text-8xl font-black">
            <div className="text-blue-500">
              <SplitText
                text="Orto"
                tag="span"
                splitType="chars"
                duration={2}
                delay={55}
                from={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                to={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              />
            </div>
            <div className="text-green-500">
              <SplitText
                text="Centro"
                tag="span"
                splitType="chars"
                duration={2}
                delay={55}
                from={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                to={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              />
            </div>
          </div>
          <p className="mt-7 max-w-xl text-xs font-light uppercase tracking-[0.35em] text-slate-200 sm:text-sm">
            PRODUTOS DE APOIO E ACESSIBILIDADE PARA O SEU DIA A DIA
          </p>
        </div>
      </div>
    </section>
  )
}
