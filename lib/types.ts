export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  created_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  compare_at_price: number | null
  category_id: string | null
  image_url: string
  additional_images: string[]
  stock: number
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  category?: Category
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  updated_at: string
  product?: Product
}

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  customer_telegram?: string
  subtotal: number
  shipping_fee: number
  total: number
  status: string
  telegram_sent: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  product_image: string
  quantity: number
  price: number
  created_at: string
}
