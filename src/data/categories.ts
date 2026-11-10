export interface Category {
  name: string
  summary: string
  image: string
  imageAlt: string
  imageWidth: number
  imageHeight: number
}

export const categories: Category[] = [
  {
    name: 'Mobilidade',
    summary: 'Cadeiras de rodas e andadores',
    image: '/images/products/cadeira-rodas-standard.jpg',
    imageAlt: 'Cadeira de rodas e produtos de mobilidade',
    imageWidth: 800,
    imageHeight: 800,
  },
  {
    name: 'Apoio Postural',
    summary: 'Almofadas e encostos',
    image: '/images/products/almofada-postural.jpg',
    imageAlt: 'Almofada postural e apoio para o corpo',
    imageWidth: 800,
    imageHeight: 800,
  },
  {
    name: 'Banho e Higiene',
    summary: 'Barras e assentos',
    image: '/images/products/cadeira-banho-rodas.jpg',
    imageAlt: 'Cadeira de banho e itens de higiene',
    imageWidth: 800,
    imageHeight: 800,
  },
  {
    name: 'Acessórios',
    summary: 'Ponteiras e protetores',
    image: '/images/products/capa-chuva-cadeira.jpg',
    imageAlt: 'Acessórios para cadeira de rodas',
    imageWidth: 800,
    imageHeight: 800,
  },
  {
    name: 'Vida Diária',
    summary: 'Talheres e auxiliares',
    image: '/images/products/talheres-engrossados.jpg',
    imageAlt: 'Talheres com cabo engrossado para o dia a dia',
    imageWidth: 800,
    imageHeight: 800,
  },
]

export function categoryPath(name: string): string {
  return `/categoria/${encodeURIComponent(name)}`
}
