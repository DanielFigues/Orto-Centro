export interface StoreInfo {
  name: string
  address: string
  addressHref: string
  hours: string
  mapEmbedSrc: string
  mapTitle: string
  whatsappNumber: string
}

export const storeInfo: StoreInfo = {
  name: 'Orto Centro',
  address:
    'Av. Mestra Fininha Silveira, 565 - Centro, Montes Claros - MG, 39401-074',
  addressHref:
    'https://maps.google.com/?q=Av.+Mestra+Fininha+Silveira,+565,+Centro,+Montes+Claros+-+MG',
  hours:
    'Segunda a sexta, das 8:30h às 18h. Sábado, das 8:30h às 12h.',
  mapEmbedSrc:
    'https://www.google.com/maps?q=Av.+Mestra+Fininha+Silveira,+565,+Centro,+Montes+Claros+-+MG&output=embed',
  mapTitle: 'Localização da Orto Centro no mapa',
  whatsappNumber: '(38)3221-1409',
}

export function buildWhatsAppUrl(message: string): string {
  const digits = storeInfo.whatsappNumber.replace(/\D/g, '')
  const text = encodeURIComponent(message)
  return `https://wa.me/${digits}?text=${text}`
}
