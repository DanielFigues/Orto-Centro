import type { Product } from '../types/product'
import { buildWhatsAppUrl, siteUrl } from '../data/store'

/**
 * Link do WhatsApp com mensagem pré-preenchida para consultar a
 * disponibilidade de um produto. Não inclui o preço.
 */
export function buildWhatsAppLink(product: Product): string {
  const message = `Olá! Gostaria de saber sobre a disponibilidade do produto: ${product.name}\n${siteUrl}/produto/${product.id}`
  return buildWhatsAppUrl(message)
}
