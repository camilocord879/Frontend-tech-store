/**
 * pages/CartPage.tsx
 * Lee el carrito real del backend (GET /api/cart).
 * Totales calculados en el frontend desde item.product.price * item.quantity
 */
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  ShoppingCart, Trash2, Plus, Minus,
  ArrowRight, ShoppingBag, Loader2, CheckCircle2,
} from 'lucide-react'
import { useCartStore } from '@/contexts/cartStore'
import { useAuth } from '@/contexts/AuthContext'
import { extractErrorMessage, formatPrice, getImageUrl } from '@/lib/utils'
import { orderService } from '@/services/orderService'
import type { CartItem, Order } from '@/types'

export default function CartPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { cart, summary, isLoading, fetchCart, updateItem, removeItem, clearCart } = useCartStore()
  // Cargar carrito al montar
  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const handleUpdate = async (itemId: string, newQty: number) => {
    if (newQty < 1) return
    try {
      await updateItem(itemId, newQty)
    } catch {
      toast.error('No se pudo actualizar la cantidad')
    }
  }

  const handleRemove = async (itemId: string, productName: string) => {
    try {
      await removeItem(itemId)
      toast.success(`"${productName}" eliminado del carrito`)
    } catch {
      toast.error('No se pudo eliminar el producto')
    }
  }

  const handleCheckout = () => {
    navigate('/checkout')
  }

  // ── Loading inicial ────────────────────────────────────────────────────────
  if (isLoading && !cart) {
    return (
      <div className="page-container flex items-center justify-center py-32">
        <Loader2 className="animate-spin text-primary-500" size={32} />
      </div>
    )
  }

  const items = cart?.items ?? []

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white flex items-center gap-3">
          <ShoppingCart size={28} className="text-primary-600" />
          Mi carrito
        </h1>
        {items.length > 0 && (
          <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
            {summary.itemCount} {summary.itemCount === 1 ? 'producto' : 'productos'}
          </p>
        )}
      </div>

      {/* Carrito vacío */}
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
          <div className="mb-5 rounded-2xl bg-surface-100 p-7 dark:bg-surface-800">
            <ShoppingBag size={48} className="text-surface-300 dark:text-surface-600" />
          </div>
          <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
            Tu carrito está vacío
          </h2>
          <p className="mt-2 text-sm text-surface-500 dark:text-surface-400 max-w-xs">
            Agrega productos para comenzar tu compra
          </p>
          <Link
            to="/products"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
          >
            Ver productos <ArrowRight size={15} />
          </Link>
        </div>
      )}

      {/* Contenido del carrito */}
      {items.length > 0 && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* Lista de items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item: CartItem) => (
              <CartItemRow
                key={item.id}
                item={item}
                onUpdate={handleUpdate}
                onRemove={handleRemove}
                isLoading={isLoading}
              />
            ))}
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="card p-6 shadow-card-md sticky top-24">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-5">
                Resumen del pedido
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-surface-600 dark:text-surface-400">
                  <span>Subtotal ({summary.itemCount} items)</span>
                  <span>{formatPrice(summary.subtotal)}</span>
                </div>
                <div className="flex justify-between text-surface-600 dark:text-surface-400">
                  <span>Envío</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">Gratis</span>
                </div>
                <div className="border-t border-surface-200 dark:border-surface-700 pt-3 flex justify-between font-semibold text-surface-900 dark:text-white text-base">
                  <span>Total</span>
                  <span className="text-primary-600 dark:text-primary-400 text-lg">
                    {formatPrice(summary.total)}
                  </span>
                </div>
              </div>

              <button
                className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white hover:bg-primary-700 active:bg-primary-800 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleCheckout}
                disabled={isLoading}
              >
                Continuar al checkout <ArrowRight size={15} />
              </button>

              <Link
                to="/products"
                className="mt-3 block text-center text-sm text-surface-500 hover:text-primary-600 dark:text-surface-400 dark:hover:text-primary-400 transition-colors"
              >
                Seguir comprando
              </Link>

              {/* Info del usuario */}
              {user && (
                <div className="mt-5 rounded-xl bg-surface-50 dark:bg-surface-800 p-3 text-xs text-surface-500 dark:text-surface-400">
                  Comprando como <span className="font-medium text-surface-700 dark:text-surface-200">{user.firstName} {user.lastName}</span>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}

// ─── Componente de fila de item ───────────────────────────────────────────────
interface CartItemRowProps {
  item: CartItem
  onUpdate: (id: string, qty: number) => void
  onRemove: (id: string, name: string) => void
  isLoading: boolean
}

function CartItemRow({ item, onUpdate, onRemove, isLoading }: CartItemRowProps) {
  const subtotal = item.product.price * item.quantity

  return (
    <div className="card p-4 flex gap-4 animate-fade-in">
      {/* Imagen */}
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-100 dark:bg-surface-800">
        <img
          src={getImageUrl(item.product.image)}
          alt={item.product.name}
          className="h-full w-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.svg' }}
        />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              to={`/products/${item.product.id}`}
              className="font-medium text-surface-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2 text-sm leading-snug"
            >
              {item.product.name}
            </Link>
            <span className="mt-0.5 inline-block text-xs text-surface-400 capitalize">
              {item.product.category}
            </span>
          </div>
          {/* Precio unitario */}
          <span className="shrink-0 text-sm font-semibold text-primary-600 dark:text-primary-400">
            {formatPrice(item.product.price)}
          </span>
        </div>

        {/* Controles de cantidad + eliminar */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
            <button
              onClick={() => onUpdate(item.id, item.quantity - 1)}
              disabled={isLoading || item.quantity <= 1}
              className="flex h-8 w-8 items-center justify-center text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800 transition-colors disabled:opacity-40"
              aria-label="Reducir cantidad"
            >
              <Minus size={13} />
            </button>
            <span className="w-8 text-center text-sm font-medium text-surface-900 dark:text-white">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdate(item.id, item.quantity + 1)}
              disabled={isLoading || item.quantity >= item.product.stock}
              className="flex h-8 w-8 items-center justify-center text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800 transition-colors disabled:opacity-40"
              aria-label="Aumentar cantidad"
            >
              <Plus size={13} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Subtotal del item */}
            <span className="text-sm font-semibold text-surface-900 dark:text-white">
              {formatPrice(subtotal)}
            </span>
            {/* Eliminar */}
            <button
              onClick={() => onRemove(item.id, item.product.name)}
              disabled={isLoading}
              className="rounded-lg p-1.5 text-surface-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors disabled:opacity-40"
              aria-label="Eliminar producto"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
