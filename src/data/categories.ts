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
      { name: 'Muletas e Bengalas', slug: 'muletas-e-bengalas', label: 'Muletas' },
      { name: 'Andadores', slug: 'andadores' },
      { name: 'Acessórios e Peças', slug: 'acessorios-e-pecas', label: 'Acessórios' },
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
      { name: 'Pernas e Pés', slug: 'pernas-e-pes', label: 'Pernas' },
      { name: 'Tronco e Costas', slug: 'tronco-e-costas', label: 'Tronco' },
      { name: 'Braço e Punho', slug: 'braco-e-punho', label: 'Braço' },
      { name: 'Pescoço e Ombro', slug: 'pescoco-e-ombro', label: 'Pescoço' },
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
      { name: 'Travesseiros e Apoios de Cama', slug: 'travesseiros-e-apoios-de-cama', label: 'Travesseiros' },
      { name: 'Almofadas de Água', slug: 'almofadas-de-agua', label: 'Água' },
      { name: 'Almofadas para Articulações', slug: 'almofadas-para-articulacoes', label: 'Articulações' },
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
      { name: 'Assentos e Cadeiras de Banho', slug: 'assentos-e-cadeiras-de-banho', label: 'Assentos' },
      { name: 'Elevadores de Vaso', slug: 'elevadores-de-vaso', label: 'Elevadores' },
      { name: 'Barras de Segurança', slug: 'barras-de-seguranca', label: 'Barras' },
    ],
  },
  {
    id: 'compressao-e-circulacao',
    slug: 'compressao-e-circulacao',
    name: 'Compressão e Circulação',
    tagline: 'Meias e sistemas de compressão para o dia a dia',
    image: null, // TODO: substituir placeholder neutro por imagem definitiva
    imageAlt: 'Meias e sistemas de compressão',
    imageIcon: 'heart',
    subcategories: [
      { name: 'Meias de Panturrilha', slug: 'meias-de-panturrilha', label: 'Panturrilha' },
      { name: 'Meias Coxa', slug: 'meias-coxa', label: 'Coxa' },
      { name: 'Meias Calça', slug: 'meias-calca', label: 'Calça' },
      { name: 'Sistemas Ajustáveis', slug: 'sistemas-ajustaveis', label: 'Ajustáveis' },
    ],
  },
  {
    id: 'saude-dos-pes',
    slug: 'saude-dos-pes',
    name: 'Saúde dos Pés',
    tagline: 'Palmilhas, calcanheiras e calçados para o conforto dos pés',
    image: null, // TODO: substituir placeholder neutro por imagem definitiva
    imageAlt: 'Palmilhas, calcanheiras e calçados ortopédicos',
    imageIcon: 'footprints',
    subcategories: [
      { name: 'Palmilhas', slug: 'palmilhas' },
      { name: 'Calçados Ortopédicos', slug: 'calcados-ortopedicos', label: 'Calçados' },
      { name: 'Calcanheiras', slug: 'calcanheiras' },
      { name: 'Protetores e Corretivos', slug: 'protetores-e-corretivos', label: 'Protetores' },
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
      { name: 'Bolas e Colchonetes', slug: 'bolas-e-colchonetes', label: 'Bolas' },
      { name: 'Faixas e Alças', slug: 'faixas-e-alcas', label: 'Faixas' },
      { name: 'Exercitadores de Mãos', slug: 'exercitadores-de-maos', label: 'Mãos' },
      { name: 'Pesos e Caneleiras', slug: 'pesos-e-caneleiras', label: 'Pesos' },
    ],
  },
  {
    id: 'bem-estar-e-terapia',
    slug: 'bem-estar-e-terapia',
    name: 'Bem-estar e Terapia',
    tagline: 'Massagens, calor e recursos para relaxar em casa',
    image: null, // TODO: substituir placeholder neutro por imagem definitiva
    imageAlt: 'Produtos para bem-estar e terapia',
    imageIcon: 'star',
    subcategories: [
      { name: 'Massageadores', slug: 'massageadores' },
      { name: 'Terapia Térmica', slug: 'terapia-termica', label: 'Térmica' },
      { name: 'Eletroterapia', slug: 'eletroterapia' },
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
      { name: 'Higiene e Proteção', slug: 'higiene-e-protecao', label: 'Higiene' },
      { name: 'Cama Hospitalar', slug: 'cama-hospitalar', label: 'Cama' },
      { name: 'Suporte para Soro', slug: 'suporte-para-soro', label: 'Soro' },
      { name: 'Colchões', slug: 'colchoes' },
    ],
  },
  {
    id: 'locacao-de-equipamentos',
    slug: 'locacao-de-equipamentos',
    name: 'Locação de Equipamentos',
    tagline: 'Equipamentos para alugar por curtos períodos',
    image: null, // TODO: substituir placeholder neutro por imagem definitiva
    imageAlt: 'Equipamentos para locação',
    imageIcon: 'clock',
    subcategories: [
      { name: 'Cadeiras', slug: 'cadeiras' },
      { name: 'Apoio à Marcha', slug: 'apoio-a-marcha', label: 'Marcha' },
      { name: 'Camas Hospitalares', slug: 'camas-hospitalares', label: 'Camas' },
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
  'ortopedia e suporte': 'ortopedia-e-suporte',
  'apoio postural': 'apoio-postural',
  'banho e higiene': 'banho-e-higiene',
  'compressao e circulacao': 'compressao-e-circulacao',
  'saude dos pes': 'saude-dos-pes',
  'fisioterapia e exercicios': 'fisioterapia-e-exercicios',
  'bem-estar e terapia': 'bem-estar-e-terapia',
  'bem estar e terapia': 'bem-estar-e-terapia',
  'cuidados em casa': 'cuidados-em-casa',
  locacao: 'locacao-de-equipamentos',
  'locacao de equipamentos': 'locacao-de-equipamentos',
  acessorios: 'mobilidade',
  'acessorios e pecas': 'mobilidade',
  'vida diaria': 'vida-diaria',
  monitoramento: 'monitoramento',
  testes: 'mobilidade',
}

const legacySlugAliases: Record<string, string> = {
  acessorios: 'mobilidade',
  'acessorios-e-pecas': 'mobilidade',
  locacao: 'locacao-de-equipamentos',
  'vida-diaria': 'vida-diaria',
  monitoramento: 'monitoramento',
}

const legacySubcategorySlugAliases: Record<string, string> = {
  'punho-e-maos': 'braco-e-punho',
  'joelho-e-tornozelo': 'pernas-e-pes',
  'faixas-elasticas': 'faixas-e-alcas',
  incontinencia: 'higiene-e-protecao',
}

const legacySubcategoryNameAliases: Record<string, string> = {
  'punho e maos': 'braco-e-punho',
  'joelho e tornozelo': 'pernas-e-pes',
  'faixas elasticas': 'faixas-e-alcas',
  incontinencia: 'higiene-e-protecao',
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
    decoded === 'monitoramento' ||
    key === 'monitoramento'
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
  const decoded = decodeURIComponent(value)
  const slugAlias =
    legacySubcategorySlugAliases[decoded] ?? legacySubcategorySlugAliases[value]
  if (slugAlias && getSubcategoryBySlug(category, slugAlias)) return slugAlias

  const nameAlias = legacySubcategoryNameAliases[normalize(decoded)]
  if (nameAlias && getSubcategoryBySlug(category, nameAlias)) return nameAlias

  if (getSubcategoryBySlug(category, value)) return value
  return getSubcategoryByName(category, decoded)?.slug
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
