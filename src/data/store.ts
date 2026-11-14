export interface StoreInfo {
  name: string
  address: string
  addressHref: string
  parking: string
  hours: string
  mapEmbedSrc: string
  mapTitle: string
  whatsappNumber: string
  siteUrl: string
}

// Número oficial da loja para consultas de disponibilidade (DDI+DDD+número).
const WHATSAPP_NUMBER = '553892401409'

function resolveSiteUrl(): string {
  const envUrl = (import.meta.env?.VITE_SITE_URL as string | undefined)?.trim()
  if (envUrl) {
    return envUrl.replace(/\/+$/, '')
  }
  return typeof window === 'undefined' ? '' : window.location.origin
}

export const siteUrl = resolveSiteUrl()

export const storeInfo: StoreInfo = {
  name: 'Orto Centro',
  address:
    'Av. Mestra Fininha, 565 (em frente ao Laboratório da Santa Casa), Montes Claros, MG',
  addressHref:
    'https://maps.google.com/?q=Av.+Mestra+Fininha,+565,+Montes+Claros+-+MG',
  parking:
    'estacionamento próprio atrás da loja, com entrada pela Rua Barão do Rio Branco',
  // TODO: horário de funcionamento não informado na FAQ; confirmar com a loja.
  hours:
    'Segunda a sexta, das 8:30h às 18h. Sábado, das 8:30h às 12h.',
  mapEmbedSrc:
    'https://www.google.com/maps?q=Av.+Mestra+Fininha,+565,+Montes+Claros+-+MG&output=embed',
  mapTitle: 'Localização da Orto Centro no mapa',
  whatsappNumber: WHATSAPP_NUMBER,
  siteUrl,
}

export function buildWhatsAppUrl(message: string): string {
  const digits = storeInfo.whatsappNumber.replace(/\D/g, '')
  const text = encodeURIComponent(message)
  return `https://wa.me/${digits}?text=${text}`
}
