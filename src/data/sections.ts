export interface SectionLink {
  id: string
  label: string
  icon: string
}

export const sectionLinks: SectionLink[] = [
  { id: 'inicio', label: 'Início', icon: 'home' },
  { id: 'catalogo', label: 'Catálogo', icon: 'tools' },
]

export const contact = {
  phone: '(38) 9240-1409',
  phoneHref: 'tel:+553892401409',
  whatsapp: '(38) 9240-1409',
  whatsappHref: 'https://wa.me/553892401409',
  email: 'contato@ortocentro.com.br',
  emailHref: 'mailto:contato@ortocentro.com.br',
  hours: 'Segunda a sexta, das 8:30h às 18h. Sábado, das 8:30h às 12h.',
  address:
    'Av. Mestra Fininha, 565 (em frente ao Laboratório da Santa Casa), Montes Claros, MG',
  addressHref:
    'https://maps.google.com/?q=Av.+Mestra+Fininha,+565,+Montes+Claros+-+MG',
}
