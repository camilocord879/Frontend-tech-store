/**
 * contexts/cartStore.ts
 * Zustand store del carrito.
 * El backend devuelve Cart con items[].product embebido.
 * subtotal / total / itemCount se calculan aquí en el frontend.
 */
import { create } from 'zustand'
import type { Cart, CartItem, CartSummary } from '@/types'
import { cartService } from '@/services/cartService'
import { extractErrorMessage } from '@/lib/utils'

// ─── Helper: calcula totales a partir de los items ────────────────────────────
function calcSummary(items: CartItem[]): CartSummary {
  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0)
  const subtotal  = items.reduce((acc, i) => acc + i.product.price * i.quantity, 0)
  return { itemCount, subtotal, total: subtotal }
}

interface CartStore {
  cart: Cart | null
  summary: CartSummary
  isLoading: boolean
  error: string | null

  fetchCart: () => Promise<void>
  addItem: (productId: string, quantity?: number) => Promise<void>
  updateItem: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => void
}

const emptySummary: CartSummary = { itemCount: 0, subtotal: 0, total: 0 }

export const useCartStore = create<CartStore>((set, get) => ({
  cart: null,
  summary: emptySummary,
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null })
    try {
      const cart = await cartService.getCart()
      set({ cart, summary: calcSummary(cart.items), isLoading: false })
    } catch (error) {
      set({ isLoading: false, error: extractErrorMessage(error) })
    }
  },

  addItem: async (productId, quantity = 1) => {
    set({ isLoading: true, error: null })
    try {
      // El backend devuelve el CartItem creado/actualizado, no el Cart completo.
      // Recargamos el carrito para tener el estado actualizado.
      await cartService.addItem({ productId, quantity })
      await get().fetchCart()
    } catch (error) {
      set({ isLoading: false, error: extractErrorMessage(error) })
      throw error
    }
  },

  updateItem: async (itemId, quantity) => {
    set({ isLoading: true, error: null })
    try {
      await cartService.updateItem(itemId, { quantity })
      await get().fetchCart()
    } catch (error) {
      set({ isLoading: false, error: extractErrorMessage(error) })
      throw error
    }
  },

  removeItem: async (itemId) => {
    // Optimistic update
    const prevCart = get().cart
    if (prevCart) {
      const items = prevCart.items.filter((i: CartItem) => i.id !== itemId)
      set({ cart: { ...prevCart, items }, summary: calcSummary(items) })
    }
    try {
      await cartService.removeItem(itemId)
      // Sincronizar con backend para estar seguros
      await get().fetchCart()
    } catch (error) {
      // Revertir
      if (prevCart) set({ cart: prevCart, summary: calcSummary(prevCart.items) })
      throw error
    }
  },

  clearCart: () => set({ cart: null, summary: emptySummary }),
}))