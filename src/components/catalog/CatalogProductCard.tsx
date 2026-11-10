import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../../types/product'
import { Icon } from '../ui/Icon'
import { ProductPrice } from './ProductPrice'

interface CatalogProductCardProps {
  product: Product
}

export function CatalogProductCard({ product }: CatalogProductCardProps) {
  const [hasImageError, setHasImageError] = useState(false)
  const showImage = product.image_url !== '' && !hasImageError

  return (
    <Link
      to={`/produto/${product.id}`}
      className="product-card focus-ring group flex h-full flex-col overflow-hidden rounded-card border border-neutral-200 bg-white transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:shadow-lg"
    >
      <div className="product-card-media flex aspect-square shrink-0 items-center justify-center overflow-hidden bg-neutral-100 dark:bg-neutral-800">
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
            className="h-16 w-16 text-sky-600 transition-transform duration-300 group-hover:scale-105 dark:text-sky-400"
          />
        )}
      </div>

      <div className="product-card-body flex flex-1 flex-col gap-1.5 p-4">
        <p className="product-card-category text-label font-medium uppercase tracking-wide text-sky-700 dark:text-sky-300">
          {product.category}
        </p>

        <h3 className="product-card-title text-body font-semibold leading-snug text-neutral-900 dark:text-white">
          {product.name}
        </h3>

        {product.subcategory !== '' && (
          <p className="product-card-subcategory text-label text-neutral-600 dark:text-neutral-300">
            {product.subcategory}
          </p>
        )}

        <ProductPrice
          price={product.price}
          className="mt-auto pt-2 text-body font-semibold text-neutral-900 dark:text-white"
        />
      </div>
    </Link>
  )
}
