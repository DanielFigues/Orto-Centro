import { useState } from 'react'
import type { Product } from '../../types/product'
import { Icon } from '../ui/Icon'

interface CatalogProductCardProps {
  product: Product
}

export function CatalogProductCard({ product }: CatalogProductCardProps) {
  const [hasImageError, setHasImageError] = useState(false)
  const showImage = product.image_url !== '' && !hasImageError

  const handleClick = () => {
    window.location.href = `/produto/${product.id}`
  }

  return (
    <article
      className="product-card group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:shadow-lg"
      onClick={handleClick}
    >
      <div className="product-card-media flex h-48 shrink-0 items-center justify-center overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        {showImage ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={() => setHasImageError(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <Icon
            name="tools"
            className="h-16 w-16 text-sky-500 transition-transform duration-300 group-hover:scale-105 dark:text-sky-400"
          />
        )}
      </div>

      <div className="product-card-body flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="product-card-title text-base font-semibold leading-snug text-neutral-900 dark:text-white">
          {product.name}
        </h3>

        <p className="product-card-category text-xs font-medium uppercase tracking-wide text-sky-700 dark:text-sky-400">
          {product.category}
        </p>

        {product.subcategory !== '' && (
          <p className="product-card-subcategory text-xs text-neutral-500 dark:text-neutral-400">
            {product.subcategory}
          </p>
        )}
      </div>
    </article>
  )
}
