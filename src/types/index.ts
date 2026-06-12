// ─── Autenticación ────────────────────────────────────────────────────────────

export interface User {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  phone?: string
  role: 'USER' | 'ADMIN'
  createdAt?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  username: string
  email: string
  phone: string
  password: string
}

export interface UpdateProfilePayload {
  firstName: string
  lastName: string
  username: string
  email: string
  phone?: string
}

// ─── Productos ────────────────────────────────────────────────────────────────
// category es string directo del modelo Prisma, NO un objeto anidado

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  image?: string | null
  category: string
  featured?: boolean
  createdAt?: string
  updatedAt?: string
}

// ─── Carrito ──────────────────────────────────────────────────────────────────
// El backend devuelve items con product embebido via Prisma include.
// subtotal y total NO vienen del backend: los calcula el frontend.

export interface CartItem {
  id: string
  cartId: string
  productId: string
  product: Product
  quantity: number
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  createdAt?: string
  updatedAt?: string
}

// Totales calculados en el frontend
export interface CartSummary {
  itemCount: number
  subtotal: number
  total: number
}

export interface AddToCartPayload {
  productId: string
  quantity: number
}

export interface UpdateCartItemPayload {
  quantity: number
}

export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  product: Product
  quantity: number
  unitPrice: number
}

export interface Order {
  id: string
  userId: string
  total: number
  status: OrderStatus
  items: OrderItem[]
  createdAt: string
  updatedAt?: string
}

// ─── API genérica ─────────────────────────────────────────────────────────────

export interface ApiError {
  message: string
  statusCode?: number
  errors?: Record<string, string[]>
}

// ─── UI / Estado ──────────────────────────────────────────────────────────────

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface AsyncState<T> {
  data: T | null
  status: LoadingState
  error: string | null
}
