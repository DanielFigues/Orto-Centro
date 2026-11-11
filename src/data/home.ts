export interface HomeBenefit {
  id: string
  title: string
  description: string
  icon: string
  image: {
    src: string
    alt: string
    width: number
    height: number
  }
  featured?: boolean
}

export const homeBenefits: HomeBenefit[] = [
  {
    id: 'autonomia',
    title: 'Mais autonomia',
    description:
      'Soluções que facilitam a rotina e ajudam você a fazer mais com independência, dentro e fora de casa.',
    icon: 'walker',
    image: {
      src: '/images/products/andador-rodas.jpg',
      alt: 'Andador com rodas para apoio à mobilidade',
      width: 800,
      height: 1200,
    },
    featured: true,
  },
  {
    id: 'seguranca',
    title: 'Segurança no dia a dia',
    description:
      'Itens firmes, confortáveis e adequados à sua rotina para apoiar cada movimento com mais tranquilidade.',
    icon: 'shield',
    image: {
      src: '/images/products/corrimao-banheiro.jpg',
      alt: 'Corrimão de apoio instalado no banheiro',
      width: 800,
      height: 1200,
    },
  },
  {
    id: 'atendimento',
    title: 'Atendimento que orienta',
    description:
      'Orientação próxima para entender a sua rotina e indicar a solução mais adequada, antes e depois da escolha.',
    icon: 'phone',
    image: {
      src: '/images/products/acessibilidade.png',
      alt: 'Produtos de apoio e acessibilidade no dia a dia',
      width: 1470,
      height: 980,
    },
  },
]
