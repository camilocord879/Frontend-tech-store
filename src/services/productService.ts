/**
 * services/productService.ts
 * Todas las llamadas al backend relacionadas con productos
 */
import api from '@/lib/axios'
import type { Product } from '@/types'

const PRODUCTS = '/products'

export const productService = {
  /** Lista todos los productos */
  async getAll(): Promise<Product[]> {
    const { data } = await api.get<Product[]>(PRODUCTS)
    return data
  },

  /** Obtiene un producto por ID */
  async getById(id: string): Promise<Product> {
    const { data } = await api.get<Product>(`${PRODUCTS}/${id}`)
    return data
  },

  /** Busca productos por término */
  async search(query: string): Promise<Product[]> {
    const { data } = await api.get<Product[]>(`${PRODUCTS}/search`, {
      params: { q: query },
    })
    return data
  },

  /** Productos destacados para el Home */
  async getFeatured(): Promise<Product[]> {
    const { data } = await api.get<Product[]>(`${PRODUCTS}/featured`)
    return data
  },

  // ── Admin (requiere rol ADMIN) ──────────────────────────────────────────────

  async create(payload: Partial<Product>): Promise<Product> {
    const { data } = await api.post<Product>(PRODUCTS, payload)
    return data
  },

  async update(id: string, payload: Partial<Product>): Promise<Product> {
    const { data } = await api.put<Product>(`${PRODUCTS}/${id}`, payload)
    return data
  },

  async remove(id: string): Promise<void> {
    await api.delete(`${PRODUCTS}/${id}`)
  },
}