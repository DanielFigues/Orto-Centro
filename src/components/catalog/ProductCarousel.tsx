import type { Product } from '../../types/product'
import { ScrollRail } from '../ui/ScrollRail'
import { ProductCard } from './ProductCard'

interface ProductCarouselProps {
  products: Product[]
  ariaLabel?: string
}

export function ProductCarousel({
  products,
  ariaLabel = 'Produtos em destaque',
}: ProductCarouselProps) {
  return (
    <ScrollRail
      ariaLabel={ariaLabel}
      prevAriaLabel="Ver produtos anteriores"
      nextAriaLabel="Ver próximos produtos"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ScrollRail>
  )
}
