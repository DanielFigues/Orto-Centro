import type { Product } from '../types/product'
import { storeInfo } from '../data/store'

function whatsAppBaseUrl(): string {
  const digits = storeInfo.whatsappNumber.replace(/\D/g, '')
  return `https://wa.me/${digits}`
}

/**
 * Link genérico do WhatsApp com uma mensagem pré-preenchida.
 */
export function buildWhatsAppMessageLink(message: string): string {
  return `${whatsAppBaseUrl()}?text=${encodeURIComponent(message)}`
}

/**
 * Link do WhatsApp para consultar a disponibilidade de um produto.
 * Abre a conversa sem mensagem pré-preenchida.
 */
export function buildWhatsAppLink(
  product: Product,
  selectedSize?: string | null,
): string {
  void product
  void selectedSize
  return whatsAppBaseUrl()
}
