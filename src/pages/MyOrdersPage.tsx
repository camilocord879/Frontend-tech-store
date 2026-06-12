import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Loader2, PackageCheck, ShoppingBag } from 'lucide-react'
import { orderService } from '@/services/orderService'
import { extractErrorMessage, formatPrice, getImageUrl } from '@/lib/utils'
import type { Order, OrderStatus } from '@/types'

const statusLabel: Record<OrderStatus, string> = {
  PENDING: 'Pendiente',
  PAID: 'Pagado',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
}

const statusClass: Record<OrderStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  PAID: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  SHIPPED: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  DELIVERED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadOrders() {
      try {
        const data = await orderService.getMyOrders()
        if (active) setOrders(data)
      } catch (err) {
        if (active) setError(extractErrorMessage(err, 'No se pudieron cargar tus pedidos'))
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadOrders()
    return () => {
      active = false
    }
  }, [])

  if (isLoading) {
    return (
      <div className="page-container flex items-center justify-center py-32">
        <Loader2 className="animate-spin text-primary-500" size={32} />
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-surface-900 dark:text-white">
            <PackageCheck size={28} className="text-primary-600" />
            Mis pedidos
          </h1>
          <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
            Consulta el estado y detalle de tus compras.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          Seguir comprando <ChevronRight size={16} />
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      )}

      {orders.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-5 rounded-2xl bg-surface-100 p-7 dark:bg-surface-800">
            <ShoppingBag size={48} className="text-surface-300 dark:text-surface-600" />
          </div>
          <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
            Todavia no tienes pedidos
          </h2>
          <p className="mt-2 max-w-xs text-sm text-surface-500 dark:text-surface-400">
            Cuando finalices una compra, aparecera aqui con todos sus productos.
          </p>
        </div>
      )}

      <div className="space-y-5">
        {orders.map((order) => (
          <article key={order.id} className="card overflow-hidden">
            <div className="flex flex-col gap-4 border-b border-surface-200 p-5 dark:border-surface-800 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-surface-400">
                  Pedido #{order.id.slice(0, 8)}
                </p>
                <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
                  {new Intl.DateTimeFormat('es-CO', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  }).format(new Date(order.createdAt))}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass[order.status]}`}>
                  {statusLabel[order.status]}
                </span>
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>

            <div className="divide-y divide-surface-100 dark:divide-surface-800">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 p-5">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-100 dark:bg-surface-800">
                    <img
                      src={getImageUrl(item.product.image)}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.svg' }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/products/${item.productId}`}
                      className="line-clamp-2 text-sm font-semibold text-surface-900 hover:text-primary-600 dark:text-white dark:hover:text-primary-400"
                    >
                      {item.product.name}
                    </Link>
                    <p className="mt-1 text-xs capitalize text-surface-400">
                      {item.product.category}
                    </p>
                    <p className="mt-2 text-sm text-surface-600 dark:text-surface-300">
                      {item.quantity} x {formatPrice(item.unitPrice)}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-surface-900 dark:text-white">
                    {formatPrice(item.quantity * item.unitPrice)}
                  </span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
