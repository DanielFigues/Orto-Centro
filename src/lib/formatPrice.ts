const brlFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function formatPrice(value: number | null | undefined): string | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null
  }

  return brlFormatter.format(value)
}
