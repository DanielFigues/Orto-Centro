export interface Category {
  id: string
  name: string
  description: string
  icon: string
  gradient: string
}

export interface Product {
  id: string
  name: string
  description: string
  categoryId: string
  image: string
  imageUrl?: string
}
