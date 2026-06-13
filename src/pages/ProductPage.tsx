/**
 * pages/ProductPage.tsx
 * Detalle de producto: GET /api/products/:id
 */
import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  ShoppingCart, ArrowLeft, Star,
  Package, CheckCircle, XCircle,
  Plus, Minus, Loader2,
} from 'lucide-react'
import { useProduct } from '@/hooks/useProduct'
import { useCartStore } from '@/contexts/cartStore'
import { useAuth } from '@/contexts/AuthContext'
import { formatPrice, getImageUrl } from '@/lib/utils'
import { ProductDetailSkeleton } from '@/components/ui/skeleton'

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: product, status, error } = useProduct(id ?? '')
  const { addItem, isLoading: cartLoading } = useCartStore()
  const { isAuthenticated } = useAuth()
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Inicia sesión para agregar al carrito')
      navigate('/login')
      return
    }
    if (!product) return
    try {
      await addItem(product.id, quantity)
      toast.success(`"${product.name}" agregado al carrito`)
    } catch {
      toast.error('No se pudo agregar al carrito')
    }
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div className="page-container">
        <ProductDetailSkeleton />
      </div>
    )
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (status === 'error') {
    return (
      <div className="page-container flex flex-col items-center py-20 text-center">
        <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
          Producto no encontrado
        </h2>
        <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">{error}</p>
        <button
          onClick={() => navigate('/products')}
          className="mt-6 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
        >
          Ver todos los productos
        </button>
      </div>
    )
  }

  if (!product) return null

  const outOfStock = product.stock === 0
  const lowStock = product.stock > 0 && product.stock <= 5

  return (
    <div className="page-container">

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-surface-400 dark:text-surface-500">
        <Link to="/products" className="flex items-center gap-1.5 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          <ArrowLeft size={14} /> Productos
        </Link>
        <span>/</span>
        <span className="text-surface-600 dark:text-surface-300 capitalize">{product.category}</span>
        <span>/</span>
        <span className="text-surface-900 dark:text-white truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 animate-fade-in">

        {/* Imagen */}
        <div className="relative overflow-hidden rounded-2xl bg-surface-100 dark:bg-surface-800 aspect-square">
          console.log(product.image)
          console.log(getImageUrl(product.image))
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="h-full w-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.svg' }}
          />
          {product.featured && (
            <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-amber-900">
              <Star size={11} fill="currentColor" /> Destacado
            </span>
          )}
        </div>

        {/* Info del producto */}
        <div className="flex flex-col">
          {/* Categoría */}
          <span className="text-xs font-semibold uppercase tracking-widest text-primary-500 dark:text-primary-400">
            {product.category}
          </span>

          {/* Nombre */}
          <h1 className="mt-2 text-2xl font-bold text-surface-900 dark:text-white sm:text-3xl leading-tight">
            {product.name}
          </h1>

          {/* Precio */}
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Estado de stock */}
          <div className="mt-3 flex items-center gap-2">
            {outOfStock ? (
              <span className="flex items-center gap-1.5 text-sm font-medium text-red-500">
                <XCircle size={15} /> Sin stock
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400">
                <CheckCircle size={15} />
                {lowStock ? `¡Solo ${product.stock} disponibles!` : `En stock (${product.stock} unidades)`}
              </span>
            )}
          </div>

          {/* Descripción */}
          <p className="mt-5 text-sm text-surface-600 dark:text-surface-400 leading-relaxed">
            {product.description}
          </p>

          {/* Selector de cantidad */}
          {!outOfStock && (
            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-surface-700 dark:text-surface-200">
                Cantidad
              </label>
              <div className="flex items-center gap-1 w-fit rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="flex h-10 w-10 items-center justify-center text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800 transition-colors disabled:opacity-40"
                  aria-label="Reducir"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm font-semibold text-surface-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  className="flex h-10 w-10 items-center justify-center text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800 transition-colors disabled:opacity-40"
                  aria-label="Aumentar"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Botón agregar al carrito */}
          <button
            onClick={handleAddToCart}
            disabled={outOfStock || cartLoading}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 py-3.5 px-6 text-sm font-semibold text-white hover:bg-primary-700 active:bg-primary-800 transition-colors disabled:cursor-not-allowed disabled:opacity-55 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            {cartLoading ? (
              <><Loader2 size={16} className="animate-spin" /> Agregando…</>
            ) : outOfStock ? (
              <><Package size={16} /> Sin stock</>
            ) : (
              <><ShoppingCart size={16} /> Agregar al carrito — {formatPrice(product.price * quantity)}</>
            )}
          </button>

          {/* Meta info */}
          <div className="mt-6 rounded-xl border border-surface-100 dark:border-surface-800 p-4 space-y-2">
            {product.createdAt && (
              <div className="flex justify-between text-xs text-surface-400">
                <span>Agregado</span>
                <span>{new Date(product.createdAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            )}
            <div className="flex justify-between text-xs text-surface-400">
              <span>ID del producto</span>
              <span className="font-mono">{product.id.slice(0, 8)}…</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}