/**
 * pages/HomePage.tsx
 * Hero + productos destacados (GET /api/products/featured) + CTA
 */
import { Link } from 'react-router-dom'
import {
  ArrowRight, ShoppingCart, Zap, Star,
  Shield, Truck, Headphones, Loader2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useFeaturedProducts } from '@/hooks/useProduct'
import { useCartStore } from '@/contexts/cartStore'
import { useAuth } from '@/contexts/AuthContext'
import { formatPrice, getImageUrl, truncate } from '@/lib/utils'
import { ProductCardSkeleton } from '@/components/ui/skeleton'
import type { Product } from '@/types'

export default function HomePage() {
  const { data: featured, status } = useFeaturedProducts()
  const { addItem, isLoading: cartLoading } = useCartStore()
  const { isAuthenticated } = useAuth()

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      toast.error('Inicia sesión para agregar al carrito')
      return
    }
    try {
      await addItem(product.id, 1)
      toast.success(`"${truncate(product.name, 30)}" agregado al carrito`)
    } catch {
      toast.error('No se pudo agregar al carrito')
    }
  }

  return (
    <div className="flex flex-col">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-surface-900">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent-500/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary-700/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="max-w-2xl animate-slide-up">
            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-700/50 bg-primary-800/40 px-3 py-1 text-xs font-medium text-primary-300 backdrop-blur-sm mb-6">
              <Zap size={11} fill="currentColor" /> Tecnología de última generación
            </span>

            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl text-balance">
              El mejor tech,{' '}
              <span className="text-primary-400">al mejor precio</span>
            </h1>

            <p className="mt-5 text-lg text-primary-200/80 leading-relaxed max-w-lg">
              Smartphones, laptops, accesorios y más. Todo en un solo lugar con envío rápido a todo Colombia.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary-700 shadow-lg hover:bg-primary-50 transition-all duration-200 hover:scale-[1.02]"
              >
                Ver productos <ArrowRight size={15} />
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-xl border border-primary-600/50 bg-primary-800/40 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm hover:bg-primary-700/40 transition-all duration-200"
                >
                  Crear cuenta gratis
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="mt-10 flex flex-wrap gap-6">
              {[
                { value: '+1.000', label: 'productos' },
                { value: '24h',   label: 'envío express' },
                { value: '100%',  label: 'seguro' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-2xl font-bold text-white">{value}</div>
                  <div className="text-xs text-primary-300">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFICIOS ────────────────────────────────────────────────────── */}
      <section className="border-b border-surface-100 dark:border-surface-800 bg-surface-50 dark:bg-surface-900">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: Truck,      title: 'Envío gratis',         desc: 'En pedidos mayores a $99' },
              { icon: Shield,     title: 'Compra segura',        desc: 'Pago protegido siempre' },
              { icon: Headphones, title: 'Soporte 24/7',         desc: 'Estamos para ayudarte' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3 rounded-xl bg-white dark:bg-surface-800 px-4 py-3 shadow-card">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/30">
                  <Icon size={18} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-surface-900 dark:text-white">{title}</p>
                  <p className="text-xs text-surface-500 dark:text-surface-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTOS DESTACADOS ──────────────────────────────────────────── */}
      <section className="section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary-500">Selección especial</span>
              <h2 className="mt-1 text-2xl font-bold text-surface-900 dark:text-white sm:text-3xl">
                Productos destacados
              </h2>
            </div>
            <Link
              to="/products"
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 transition-colors"
            >
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>

          {/* Loading */}
          {status === 'loading' && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          )}

          {/* Error o vacío */}
          {(status === 'error' || (status === 'success' && (!featured || featured.length === 0))) && (
            <div className="text-center py-12 text-surface-400 dark:text-surface-500 text-sm">
              No hay productos destacados por ahora.
            </div>
          )}

          {/* Grid */}
          {status === 'success' && featured && featured.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in">
              {featured.map((product) => (
                <FeaturedCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  cartLoading={cartLoading}
                />
              ))}
            </div>
          )}

          {/* Ver todos — mobile */}
          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-xl border border-surface-200 dark:border-surface-700 px-5 py-2.5 text-sm font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              Ver todos los productos <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────────────────── */}
      {!isAuthenticated && (
        <section className="section bg-primary-600 dark:bg-primary-700">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              ¿Listo para empezar?
            </h2>
            <p className="mt-3 text-primary-100">
              Crea tu cuenta gratis y accede a los mejores precios en tecnología.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/register"
                className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary-700 hover:bg-primary-50 transition-colors shadow-lg"
              >
                Crear cuenta gratis
              </Link>
              <Link
                to="/products"
                className="rounded-xl border border-primary-500 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-500/30 transition-colors"
              >
                Ver productos
              </Link>
            </div>
          </div>
        </section>
      )}

    </div>
  )
}

// ─── FeaturedCard ─────────────────────────────────────────────────────────────
interface FeaturedCardProps {
  product: Product
  onAddToCart: (p: Product) => void
  cartLoading: boolean
}

function FeaturedCard({ product, onAddToCart, cartLoading }: FeaturedCardProps) {
  const outOfStock = product.stock === 0

  return (
    <div className="group card overflow-hidden shadow-card hover:shadow-card-md transition-all duration-300 hover:-translate-y-0.5">
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative overflow-hidden bg-surface-100 dark:bg-surface-800" style={{ paddingTop: '75%' }}>
          <img
            src={getImageUrl(product.imageUrl)}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.svg' }}
          />
          <span className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-semibold text-amber-900">
            <Star size={9} fill="currentColor" /> Destacado
          </span>
        </div>
      </Link>
      <div className="p-4">
        <span className="text-[11px] font-medium uppercase tracking-wider text-primary-500 dark:text-primary-400 capitalize">
          {product.category}
        </span>
        <Link to={`/products/${product.id}`}>
          <h3 className="mt-1 text-sm font-semibold text-surface-900 dark:text-white leading-snug hover:text-primary-600 dark:hover:text-primary-400 line-clamp-2 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-base font-bold text-surface-900 dark:text-white">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            disabled={outOfStock || cartLoading}
            className="flex items-center gap-1.5 rounded-xl bg-primary-600 px-3 py-2 text-xs font-semibold text-white hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cartLoading ? <Loader2 size={12} className="animate-spin" /> : <ShoppingCart size={12} />}
            {outOfStock ? 'Sin stock' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  )
}