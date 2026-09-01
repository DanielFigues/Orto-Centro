import { useEffect, useRef, useState, type FC, type ReactNode } from 'react'
import { gsap } from 'gsap'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function isImageSource(value: string) {
  return /^(https?:\/\/|\/).+\.(avif|gif|jpe?g|png|svg|webp)(\?.*)?$/i.test(value)
}

function getGridSize() {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1280
  return width < 640 ? { columns: 5, rows: 6 } : { columns: 7, rows: 4 }
}

interface GridMotionProps {
  items?: (string | ReactNode)[]
  gradientColor?: string
}

const GridMotion: FC<GridMotionProps> = ({ items = [], gradientColor = 'white' }) => {
  const gridRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const mouseXRef = useRef<number>(
    typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
  )
  const [gridSize, setGridSize] = useState(getGridSize)

  const totalItems = 28
  const defaultItems = Array.from({ length: totalItems }, (_, index) => `Item ${index + 1}`)
  const combinedItems = items.length > 0 ? items.slice(0, totalItems) : defaultItems

  useEffect(() => {
    if (prefersReducedMotion()) return

    gsap.ticker.lagSmoothing(0)

    const handleMouseMove = (e: MouseEvent) => {
      mouseXRef.current = e.clientX
    }

    const updateMotion = () => {
      const maxMoveAmount = 300
      const baseDuration = 0.8
      const inertiaFactors = [0.6, 0.4, 0.3, 0.2]

      rowRefs.current.forEach((row, index) => {
        if (row) {
          const direction = index % 2 === 0 ? 1 : -1
          const moveAmount =
            ((mouseXRef.current / window.innerWidth) * maxMoveAmount - maxMoveAmount / 2) *
            direction

          gsap.to(row, {
            x: moveAmount,
            duration: baseDuration + inertiaFactors[index % inertiaFactors.length],
            ease: 'power3.out',
            overwrite: 'auto',
          })
        }
      })
    }

    const removeAnimationLoop = gsap.ticker.add(updateMotion)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      removeAnimationLoop()
    }
  }, [])

  useEffect(() => {
    const onResize = () => setGridSize(getGridSize())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div ref={gridRef} className="pointer-events-none h-full w-full overflow-hidden">
      <section
        className="relative flex h-full w-full items-center justify-center overflow-hidden"
        style={{
          background: `radial-gradient(circle, ${gradientColor} 0%, transparent 100%)`,
        }}
      >
        <div className="relative z-[2] grid w-[150vw] flex-none origin-center gap-4 rotate-[-15deg]">
          {Array.from({ length: gridSize.rows }, (_, rowIndex) => (
            <div
              key={rowIndex}
              ref={(el) => {
                rowRefs.current[rowIndex] = el
              }}
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${gridSize.columns}, minmax(0, 1fr))`,
                willChange: 'transform, filter',
              }}
            >
              {Array.from({ length: gridSize.columns }, (_, itemIndex) => {
                const content = combinedItems[(rowIndex * gridSize.columns + itemIndex) % combinedItems.length]
                return (
                  <div key={itemIndex} className="relative aspect-square">
                    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[10px] border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                      {typeof content === 'string' && isImageSource(content) ? (
                        <div
                          className="absolute left-0 top-0 h-full w-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${content})` }}
                        />
                      ) : (
                        <div className="z-[1] h-full w-full">{content}</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default GridMotion
