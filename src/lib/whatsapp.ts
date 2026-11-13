import type { Product } from '../types/product'
import { storeInfo } from '../data/store'

/**
 * Link do WhatsApp para consultar a disponibilidade de um produto.
 * Abre a conversa sem mensagem pré-preenchida.
 */
export function buildWhatsAppLink(
  _product: Product,
  _selectedSize?: string | null,
): string {
  const digits = storeInfo.whatsappNumber.replace(/\D/g, '')
  return `https://wa.me/${digits}`
}
