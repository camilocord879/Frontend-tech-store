/**
 * pages/ProductsPage.tsx
 * Catálogo completo: GET /api/products + búsqueda + filtro por categoría
 */
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  Search, SlidersHorizontal, X, ShoppingCart,
  Star, PackageSearch, Loader2,
} from 'lucide-react'
import { useProducts } from '@/hooks/useProduct'
import { useDebounce } from '@/hooks/useDebounce'
import { useCartStore } from '@/contexts/cartStore'
import { useAuth } from '@/contexts/AuthContext'
import { formatPrice, getImageUrl, truncate } from '@/lib/utils'
import { ProductCardSkeleton } from '@/components/ui/skeleton'
import type { Product } from '@/types'

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchInput, setSearchInput] = useState(searchParams.get('q') ?? '')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const debouncedSearch = useDebounce(searchInput, 350)

  const { data: products, status, error, refetch } = useProducts()
  const { addItem, isLoading: cartLoading } = useCartStore()
  const { isAuthenticated } = useAuth()

  // Sincronizar ?q= en la URL con el input
  useEffect(() => {
    const q = searchParams.get('q')
    if (q) setSearchInput(q)
  }, [searchParams])

  // Actualizar URL cuando cambia la búsqueda
  useEffect(() => {
    if (debouncedSearch.trim()) {
      setSearchParams({ q: debouncedSearch })
    } else {
      setSearchParams({})
    }
  }, [debouncedSearch, setSearchParams])

  // Categorías únicas derivadas de los productos
  const categories = useMemo(() => {
    if (!products) return []
    const cats = [...new Set(products.map((p) => p.category).filter(Boolean))]
    return cats.sort()
  }, [products])

  // Filtrar productos en el cliente
  const filtered = useMemo(() => {
    if (!products) return []
    return products.filter((p) => {
      const matchSearch =
        !debouncedSearch.trim() ||
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.category?.toLowerCase().includes(debouncedSearch.toLowerCase())
      const matchCategory =
        activeCategory === 'all' || p.category === activeCategory
      return matchSearch && matchCategory
    })
  }, [products, debouncedSearch, activeCategory])

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
    <div className="page-container">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Productos</h1>
        <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
          {status === 'success' && `${filtered.length} producto${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Barra de búsqueda + filtros */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="search"
            placeholder="Buscar productos…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-xl border border-surface-200 bg-white py-2.5 pl-9 pr-9 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-surface-700 dark:bg-surface-800 dark:text-white dark:focus:border-primary-600"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Icono filtros decorativo */}
        <div className="flex items-center gap-2 text-xs text-surface-400 dark:text-surface-500">
          <SlidersHorizontal size={14} />
          <span>Filtrar por:</span>
        </div>
      </div>

      {/* Chips de categorías */}
      {categories.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <CategoryChip
            label="Todos"
            active={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
            count={products?.length}
          />
          {categories.map((cat) => (
            <CategoryChip
              key={cat}
              label={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              count={products?.filter((p) => p.category === cat).length}
            />
          ))}
        </div>
      )}

      {/* Estado de carga */}
      {status === 'loading' && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="mb-4 rounded-2xl bg-red-50 p-5 dark:bg-red-900/20">
            <PackageSearch size={36} className="text-red-400" />
          </div>
          <h3 className="font-semibold text-surface-900 dark:text-white">Error al cargar productos</h3>
          <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">{error}</p>
          <button
            onClick={refetch}
            className="mt-5 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Estado vacío tras filtros */}
      {status === 'success' && filtered.length === 0 && (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="mb-4 rounded-2xl bg-surface-100 p-5 dark:bg-surface-800">
            <PackageSearch size={36} className="text-surface-400" />
          </div>
          <h3 className="font-semibold text-surface-900 dark:text-white">Sin resultados</h3>
          <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
            Intenta con otro término o categoría
          </p>
          <button
            onClick={() => { setSearchInput(''); setActiveCategory('all') }}
            className="mt-5 rounded-xl border border-surface-200 px-5 py-2.5 text-sm font-medium text-surface-700 hover:bg-surface-100 dark:border-surface-700 dark:text-surface-300 dark:hover:bg-surface-800 transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {/* Grid de productos */}
      {status === 'success' && filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-fade-in">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              cartLoading={cartLoading}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── ProductCard ──────────────────────────────────────────────────────────────
interface ProductCardProps {
  product: Product
  onAddToCart: (p: Product) => void
  cartLoading: boolean
}

function ProductCard({ product, onAddToCart, cartLoading }: ProductCardProps) {
  const outOfStock = product.stock === 0

  return (
    <div className="group card overflow-hidden shadow-card hover:shadow-card-md transition-all duration-300 hover:-translate-y-0.5">
      {/* Imagen */}
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative overflow-hidden bg-surface-100 dark:bg-surface-800" style={{ paddingTop: '72%' }}>
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.svg' }}
          />
          {product.featured && (
            <span className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-semibold text-amber-900">
              <Star size={9} fill="currentColor" /> Destacado
            </span>
          )}
          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-surface-700">
                Sin stock
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Contenido */}
      <div className="p-4">
        <span className="text-[11px] font-medium uppercase tracking-wider text-primary-500 dark:text-primary-400">
          {product.category}
        </span>
        <Link to={`/products/${product.id}`}>
          <h3 className="mt-1 text-sm font-semibold text-surface-900 dark:text-white leading-snug hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-xs text-surface-500 dark:text-surface-400 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-lg font-bold text-surface-900 dark:text-white">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            disabled={outOfStock || cartLoading}
            className="flex items-center gap-1.5 rounded-xl bg-primary-600 px-3 py-2 text-xs font-semibold text-white hover:bg-primary-700 active:bg-primary-800 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Agregar ${product.name} al carrito`}
          >
            {cartLoading
              ? <Loader2 size={13} className="animate-spin" />
              : <ShoppingCart size={13} />}
            Agregar
          </button>
        </div>

        {/* Stock bajo */}
        {product.stock > 0 && product.stock <= 5 && (
          <p className="mt-2 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            ¡Solo {product.stock} en stock!
          </p>
        )}
      </div>
    </div>
  )
}

// ─── CategoryChip ─────────────────────────────────────────────────────────────
interface CategoryChipProps {
  label: string
  active: boolean
  onClick: () => void
  count?: number
}

function CategoryChip({ label, active, onClick, count }: CategoryChipProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-150 capitalize
        ${active
          ? 'bg-primary-600 text-white shadow-sm'
          : 'border border-surface-200 bg-white text-surface-600 hover:border-primary-300 hover:text-primary-600 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-400 dark:hover:border-primary-600 dark:hover:text-primary-400'
        }`}
    >
      {label}
      {count !== undefined && (
        <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${active ? 'bg-primary-500' : 'bg-surface-100 dark:bg-surface-700'}`}>
          {count}
        </span>
      )}
    </button>
  )
}