import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../../types/product'
import { Icon } from '../ui/Icon'

interface ProductCardProps {
  product: Product
}

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function ProductCard({ product }: ProductCardProps) {
  const [hasImageError, setHasImageError] = useState(false)
  const showImage = product.image_url !== '' && !hasImageError
  const hasPrice =
    typeof product.price === 'number' &&
    Number.isFinite(product.price) &&
    product.price > 0

  return (
    <Link
      to={`/produto/${product.id}`}
      className="product-card focus-ring group flex h-full flex-col overflow-hidden rounded-card border border-neutral-200 bg-white transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:shadow-lg"
    >
      <div className="product-card-media flex shrink-0 items-center justify-center overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        {showImage ? (
          <img
            src={product.image_url}
            alt={product.name}
            width={800}
            height={1000}
            loading="lazy"
            decoding="async"
            draggable={false}
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

      <div className="product-card-body flex flex-1 flex-col gap-1.5 p-4 pt-5">
        <h3 className="product-card-title text-[22px] font-medium leading-snug tracking-[-0.01em] text-neutral-900 dark:text-white xl:text-[24px]">
          {product.name}
        </h3>

        <p className="product-card-category text-[14px] font-medium uppercase tracking-wide text-sky-700 dark:text-sky-300">
          {product.category}
        </p>

        {hasPrice ? (
          <p className="mt-auto pt-2 text-[17px] font-medium text-neutral-900 dark:text-white">
            {currency.format(product.price as number)}
          </p>
        ) : null}
      </div>
    </Link>
  )
}
