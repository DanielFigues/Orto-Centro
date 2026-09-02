import { useState } from 'react'
import { motion } from 'framer-motion'
import type { CatalogProduct } from '../../lib/catalog'
import { Icon } from '../ui/Icon'
import BorderGlow from '../bits/BorderGlow'

interface CatalogCardProps {
  product: CatalogProduct
  index: number
}

const spring = {
  type: 'spring' as const,
  stiffness: 360,
  damping: 32,
  mass: 0.7,
}

export function CatalogCard({ product, index }: CatalogCardProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = product.imageUrl !== '' && !imageFailed

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 8 }}
      transition={{
        ...spring,
        delay: Math.min(index % 10, 6) * 0.04,
      }}
      className="h-full"
    >
      <BorderGlow
        className="relative h-full"
        borderRadius={20}
        glowColor="199 89% 55%"
        colors={['#7dd3fc', '#38bdf8', '#0ea5e9']}
        glowIntensity={0.9}
        fillOpacity={0.25}
      >
        <article className="group relative flex h-full flex-col overflow-hidden rounded-[20px]">
          <div className="flex h-44 shrink-0 items-center justify-center overflow-hidden bg-neutral-50 dark:bg-neutral-800">
            {showImage ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                loading="lazy"
                onError={() => setImageFailed(true)}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <Icon
                name={product.icon}
                className="h-20 w-20 text-sky-500 transition-transform duration-300 group-hover:scale-110 dark:text-sky-400"
              />
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2 p-4">
            <h3 className="text-sm font-medium leading-snug text-neutral-800 dark:text-neutral-100">
              {product.name}
            </h3>
            {product.description && (
              <p className="line-clamp-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                {product.description}
              </p>
            )}
            <span className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
              {product.category}
            </span>
          </div>
        </article>
      </BorderGlow>
    </motion.div>
  )
}