export interface Product {
  id: number
  name: string
  category: string
  subcategory: string
  image_url: string
  image_url_2?: string
  image_url_3?: string
  description?: string
  brand?: string
  sizes?: string
  is_active: boolean
}
