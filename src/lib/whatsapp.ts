import type { Product } from '../types/product'
import { buildWhatsAppUrl, siteUrl } from '../data/store'

/**
 * Link do WhatsApp com mensagem pré-preenchida para consultar a
 * disponibilidade de um produto. Não inclui o preço.
 *
 * Quando o produto tem tamanhos, o tamanho escolhido entra na mensagem.
 */
export function buildWhatsAppLink(
  product: Product,
  selectedSize?: string | null,
): string {
  const size = typeof selectedSize === 'string' ? selectedSize.trim() : ''
  const sizeLine = size !== '' ? `\nTamanho: ${size}` : ''
  const message = `Olá! Gostaria de saber sobre a disponibilidade do produto: ${product.name}${sizeLine}\n${siteUrl}/produto/${product.id}`
  return buildWhatsAppUrl(message)
}
