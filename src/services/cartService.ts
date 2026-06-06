/**
 * services/cartService.ts
 * El backend devuelve:
 *  - GET /cart        → Cart con items[].product
 *  - POST /cart/add   → CartItem (no el Cart completo)
 *  - PUT /cart/item/:id  → CartItem actualizado
 *  - DELETE /cart/item/:id → CartItem eliminado
 */
import api from '@/lib/axios'
import type { AddToCartPayload, Cart, CartItem, UpdateCartItemPayload } from '@/types'

const CART = '/cart'

export const cartService = {
  async getCart(): Promise<Cart> {
    const { data } = await api.get<Cart>(CART)
    return data
  },

  async addItem(payload: AddToCartPayload): Promise<CartItem> {
    const { data } = await api.post<CartItem>(`${CART}/add`, payload)
    return data
  },

  async updateItem(itemId: string, payload: UpdateCartItemPayload): Promise<CartItem> {
    const { data } = await api.put<CartItem>(`${CART}/item/${itemId}`, payload)
    return data
  },

  async removeItem(itemId: string): Promise<CartItem> {
    const { data } = await api.delete<CartItem>(`${CART}/item/${itemId}`)
    return data
  },
}