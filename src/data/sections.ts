export interface SectionLink {
  id: string
  label: string
  icon: string
}

export const sectionLinks: SectionLink[] = [
  { id: 'inicio', label: 'Início', icon: 'home' },
  { id: 'mobilidade', label: 'Mobilidade', icon: 'wheelchair' },
  { id: 'banho-higiene', label: 'Banho e Higiene', icon: 'shower' },
  { id: 'vida-diaria', label: 'Vida Diária', icon: 'spoon' },
  { id: 'aposio-postural', label: 'Apoio Postural', icon: 'cushion' },
  { id: 'acessorios', label: 'Acessórios', icon: 'tools' },
  { id: 'contato', label: 'Contato', icon: 'phone' },
]

export const contact = {
  phone: '(11) 4000-0000',
  phoneHref: 'tel:+551140000000',
  whatsapp: '(11) 98765-4321',
  whatsappHref: 'https://wa.me/5511987654321',
  email: 'contato@cuidarbem.com.br',
  emailHref: 'mailto:contato@cuidarbem.com.br',
  hours: 'Segunda a sexta, das 8h às 18h. Sábado, das 8h às 12h.',
}
