export interface SectionLink {
  id: string
  label: string
  icon: string
}

export const sectionLinks: SectionLink[] = [
  { id: 'inicio', label: 'Início', icon: 'home' },
  { id: 'catalogo', label: 'Catálogo', icon: 'tools' },
  { id: 'contato', label: 'Contato', icon: 'phone' },
]

export const contact = {
  phone: '(11) 4000-0000',
  phoneHref: 'tel:+551140000000',
  whatsapp: '(38) 3221-1409',
  whatsappHref: 'https://wa.me/553832211409',
  email: 'contato@ortocentro.com.br',
  emailHref: 'mailto:contato@ortocentro.com.br',
  hours: 'Segunda a sexta, das 8:30h às 18h. Sábado, das 8:30h às 12h.',
  address: 'Av. Mestra Fininha Silveira, 565 - Centro, Montes Claros - MG, 39401-074',
  addressHref: 'https://maps.google.com/?q=Av.+Mestra+Fininha+Silveira,+565,+Centro,+Montes+Claros+-+MG',
}
