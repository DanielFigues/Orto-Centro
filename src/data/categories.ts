export interface Subcategory {
  name: string
  slug: string
  label?: string
}

export interface Category {
  id: string
  slug: string
  name: string
  tagline: string
  image: string | null
  imageAlt: string
  imageIcon: string
  subcategories: Subcategory[]
}

export const categories: Category[] = [
  {
    id: 'mobilidade',
    slug: 'mobilidade',
    name: 'Mobilidade',
    tagline: 'Apoio para se deslocar com mais autonomia',
    image: '/images/products/cadeira-rodas-standard.jpg',
    imageAlt: 'Cadeira de rodas e produtos de mobilidade',
    imageIcon: 'wheelchair',
    subcategories: [
      { name: 'Cadeiras de Rodas', slug: 'cadeiras-de-rodas', label: 'Cadeiras' },
      { name: 'Andadores', slug: 'andadores' },
      { name: 'Muletas e Bengalas', slug: 'muletas-e-bengalas', label: 'Muletas' },
      { name: 'Bancos', slug: 'bancos' },
    ],
  },
  {
    id: 'ortopedia-e-suporte',
    slug: 'ortopedia-e-suporte',
    name: 'Ortopedia e Suporte',
    tagline: 'Suportes para diferentes partes do corpo',
    image: null, // TODO: substituir placeholder neutro por imagem definitiva
    imageAlt: 'Produtos de ortopedia e suporte',
    imageIcon: 'shield',
    subcategories: [
      { name: 'Pescoço e Ombro', slug: 'pescoco-e-ombro' },
      { name: 'Punho e Mãos', slug: 'punho-e-maos' },
      { name: 'Tronco e Costas', slug: 'tronco-e-costas' },
      { name: 'Joelho e Tornozelo', slug: 'joelho-e-tornozelo' },
    ],
  },
  {
    id: 'apoio-postural',
    slug: 'apoio-postural',
    name: 'Apoio Postural',
    tagline: 'Almofadas e apoios para mais conforto ao sentar',
    image: '/images/products/almofada-postural.jpg',
    imageAlt: 'Almofada postural e apoio para o corpo',
    imageIcon: 'cushion',
    subcategories: [
      { name: 'Almofadas de Espuma', slug: 'almofadas-de-espuma', label: 'Espuma' },
      { name: 'Almofadas de Gel e Silicone', slug: 'almofadas-de-gel-e-silicone', label: 'Gel e Silicone' },
      { name: 'Colchonetes', slug: 'colchonetes' },
    ],
  },
  {
    id: 'banho-e-higiene',
    slug: 'banho-e-higiene',
    name: 'Banho e Higiene',
    tagline: 'Itens para mais segurança no banho e na higiene',
    image: '/images/products/cadeira-banho-rodas.jpg',
    imageAlt: 'Cadeira de banho e itens de higiene',
    imageIcon: 'shower',
    subcategories: [
      { name: 'Barras de Segurança', slug: 'barras-de-seguranca', label: 'Barras' },
      { name: 'Assentos e Cadeiras de Banho', slug: 'assentos-e-cadeiras-de-banho', label: 'Assentos' },
    ],
  },
  {
    id: 'fisioterapia-e-exercicios',
    slug: 'fisioterapia-e-exercicios',
    name: 'Fisioterapia e Exercícios',
    tagline: 'Acessórios para exercícios e alongamentos em casa',
    image: null, // TODO: substituir placeholder neutro por imagem definitiva
    imageAlt: 'Produtos para fisioterapia e exercícios',
    imageIcon: 'tools',
    subcategories: [
      { name: 'Faixas Elásticas', slug: 'faixas-elasticas' },
      { name: 'Exercitadores de Mãos', slug: 'exercitadores-de-maos' },
      { name: 'Bolsa Térmica em Gel', slug: 'bolsa-termica-em-gel' },
    ],
  },
  {
    id: 'monitoramento',
    slug: 'monitoramento',
    name: 'Monitoramento',
    tagline: 'Equipamentos para acompanhar medidas em casa',
    image: null, // TODO: substituir placeholder neutro por imagem definitiva
    imageAlt: 'Equipamentos de monitoramento',
    imageIcon: 'clock',
    subcategories: [
      { name: 'Aparelhos de Pressão', slug: 'aparelhos-de-pressao' },
      { name: 'Balanças', slug: 'balancas' },
      { name: 'Termômetros', slug: 'termometros' },
    ],
  },
  {
    id: 'cuidados-em-casa',
    slug: 'cuidados-em-casa',
    name: 'Cuidados em Casa',
    tagline: 'Itens para apoio e conforto no ambiente doméstico',
    image: null, // TODO: substituir placeholder neutro por imagem definitiva
    imageAlt: 'Produtos para cuidados em casa',
    imageIcon: 'home',
    subcategories: [
      { name: 'Cama Hospitalar', slug: 'cama-hospitalar' },
      { name: 'Suporte para Soro', slug: 'suporte-para-soro' },
      { name: 'Incontinência', slug: 'incontinencia' },
      { name: 'Colchões', slug: 'colchoes' },
    ],
  },
  {
    id: 'acessorios',
    slug: 'acessorios',
    name: 'Acessórios',
    tagline: 'Peças e acessórios para reposição e ajuste',
    image: '/images/products/capa-chuva-cadeira.jpg',
    imageAlt: 'Acessórios e peças para produtos de apoio',
    imageIcon: 'tools',
    subcategories: [
      { name: 'Ponteiras', slug: 'ponteiras' },
      { name: 'Protetores', slug: 'protetores' },
      { name: 'Peças de Reposição', slug: 'pecas-de-reposicao' },
    ],
  },
]

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

const legacyNameToSlug: Record<string, string> = {
  mobilidade: 'mobilidade',
  'apoio postural': 'apoio-postural',
  'banho e higiene': 'banho-e-higiene',
  acessorios: 'acessorios',
  'acessorios e pecas': 'acessorios',
  'vida diaria': 'vida-diaria',
  'saude dos pes': 'saude-dos-pes',
  'compressao e circulacao': 'compressao-e-circulacao',
  testes: 'acessorios',
}

const legacySlugAliases: Record<string, string> = {
  'acessorios-e-pecas': 'acessorios',
  'vida-diaria': 'vida-diaria',
  'saude-dos-pes': 'saude-dos-pes',
  'compressao-e-circulacao': 'compressao-e-circulacao',
}

export const REMOVED_CATEGORY_REDIRECT = '/#catalogo'

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug)
}

export function getCategoryByName(name: string): Category | undefined {
  const key = normalize(name)
  const slug = legacyNameToSlug[key]
  if (slug) return getCategoryBySlug(slug)
  return categories.find((category) => normalize(category.name) === key)
}

export function resolveCategorySlug(value: string): string | undefined {
  const decoded = decodeURIComponent(value)
  if (legacySlugAliases[decoded]) return legacySlugAliases[decoded]
  if (legacySlugAliases[value]) return legacySlugAliases[value]
  if (getCategoryBySlug(value)) return value
  if (getCategoryBySlug(decoded)) return decoded
  return getCategoryByName(decoded)?.slug
}

export function isRemovedCategory(value: string): boolean {
  const decoded = decodeURIComponent(value)
  const key = normalize(decoded)
  return (
    decoded === 'vida-diaria' ||
    key === 'vida diaria' ||
    key === 'saude dos pes' ||
    key === 'compressao e circulacao' ||
    decoded === 'saude-dos-pes' ||
    decoded === 'compressao-e-circulacao'
  )
}

export function getSubcategoryBySlug(
  category: Category,
  slug: string,
): Subcategory | undefined {
  return category.subcategories.find((subcategory) => subcategory.slug === slug)
}

export function getSubcategoryByName(
  category: Category,
  name: string,
): Subcategory | undefined {
  const key = normalize(name)
  return category.subcategories.find(
    (subcategory) => normalize(subcategory.name) === key,
  )
}

export function resolveSubcategorySlug(
  category: Category,
  value: string,
): string | undefined {
  if (getSubcategoryBySlug(category, value)) return value
  return getSubcategoryByName(category, decodeURIComponent(value))?.slug
}

export function categoryPath(category: Category | string): string {
  const slug = typeof category === 'string' ? resolveCategorySlug(category) ?? category : category.slug
  return `/categoria/${slug}`
}

export function categoryPathWithSubcategory(
  category: Category | string,
  subcategory: Subcategory | string,
): string {
  const cat = typeof category === 'string' ? getCategoryBySlug(category) ?? getCategoryByName(category) : category
  const subSlug =
    typeof subcategory === 'string'
      ? cat
        ? resolveSubcategorySlug(cat, subcategory) ?? subcategory
        : subcategory
      : subcategory.slug
  const base = typeof category === 'string' ? categoryPath(category) : categoryPath(cat ?? category)
  return `${base}?subcategoria=${encodeURIComponent(subSlug)}`
}
