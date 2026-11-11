interface ProductPriceProps {
  price?: number | null
  className?: string
}

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function ProductPrice({ price, className = '' }: ProductPriceProps) {
  const hasPrice =
    typeof price === 'number' && Number.isFinite(price) && price > 0

  return (
    <p className={`product-price ${className}`}>
      {hasPrice ? currency.format(price) : 'Consulte disponibilidade'}
    </p>
  )
}
