export interface Product {
  id: number
  name: string
  category: string
  subcategory: string
  image_url: string
  image_url_2?: string
  image_url_3?: string
  image_url_4?: string
  image_url_5?: string
  description?: string
  short_description?: string
  technical_specs?: string
  brand?: string
  sizes?: string
  price?: number | null
  focalPoint?: string
  is_active: boolean
}
