import { useState } from 'react'
import type { Product } from '../../types/product'
import { categories } from '../../data/products'
import { Icon } from './Icon'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const category = categories.find((c) => c.id === product.categoryId)
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = product.imageUrl && !imageFailed

  return (
    <article className="group relative flex h-full flex-col overflow-hidden">
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
            name={product.image}
            className="h-20 w-20 text-sky-500 transition-transform duration-300 group-hover:scale-110 dark:text-sky-400"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-sm font-medium leading-snug text-neutral-800 dark:text-neutral-100">
          {product.name}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
          {product.description}
        </p>
        <span className="mt-auto text-xs text-neutral-400 dark:text-neutral-500">
          {category?.name}
        </span>
      </div>
    </article>
  )
}
