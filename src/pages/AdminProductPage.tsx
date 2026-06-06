/**
 * pages/admin/AdminProductsPage.tsx
 * Panel de administración de productos.
 * Requiere rol ADMIN (protegido en backend con adminMiddleware).
 * Operaciones: listar, crear, editar, eliminar productos.
 */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import {
  Plus, Pencil, Trash2, X, Package,
  DollarSign, Hash, Tag, Image, Star,
  AlertTriangle, Loader2, ShieldAlert,
  CheckCircle,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { productService } from '@/services/productService'
import { formatPrice, getImageUrl, truncate } from '@/lib/utils'
import { ProductCardSkeleton } from '@/components/ui/skeleton'
import type { Product } from '@/types'

// ─── Schema Zod ───────────────────────────────────────────────────────────────
const productSchema = z.object({
  name: z
    .string()
    .min(2, 'Mínimo 2 caracteres')
    .max(120, 'Máximo 120 caracteres'),
  description: z
    .string()
    .min(10, 'Mínimo 10 caracteres')
    .max(1000, 'Máximo 1000 caracteres'),
  price: z
    .number({ invalid_type_error: 'Debe ser un número' })
    .positive('El precio debe ser mayor a 0'),
  stock: z
    .number({ invalid_type_error: 'Debe ser un número' })
    .int('Debe ser un número entero')
    .min(0, 'Stock no puede ser negativo'),
  category: z
    .string()
    .min(2, 'Mínimo 2 caracteres')
    .max(50, 'Máximo 50 caracteres'),
  image: z
    .string()
    .optional()
    .or(z.literal('')),
  featured: z.boolean().optional(),
})

type ProductFormData = z.infer<typeof productSchema>

// ─── Componente principal ─────────────────────────────────────────────────────
export default function AdminProductsPage() {
  const { user } = useAuth()
  const navigate  = useNavigate()

  const [products, setProducts]       = useState<Product[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [modalOpen, setModalOpen]     = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingId, setDeletingId]   = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null)

  // ── Guardia de rol en el frontend ─────────────────────────────────────────
  if (user?.role !== 'ADMIN') {
    return (
      <div className="page-container flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 rounded-2xl bg-red-50 dark:bg-red-900/20 p-6">
          <ShieldAlert size={40} className="text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-surface-900 dark:text-white">Acceso denegado</h2>
        <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
          Necesitas rol de administrador para ver esta página.
        </p>
        <button
          onClick={() => navigate('/home')}
          className="mt-6 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    )
  }

  // ── Cargar productos ───────────────────────────────────────────────────────
  const loadProducts = async () => {
    setLoadingList(true)
    try {
      const data = await productService.getAll()
      setProducts(data)
    } catch {
      toast.error('Error al cargar productos')
    } finally {
      setLoadingList(false)
    }
  }

  useEffect(() => { loadProducts() }, [])

  // ── Abrir modal para crear ─────────────────────────────────────────────────
  const handleOpenCreate = () => {
    setEditingProduct(null)
    setModalOpen(true)
  }

  // ── Abrir modal para editar ────────────────────────────────────────────────
  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product)
    setModalOpen(true)
  }

  // ── Eliminar producto ──────────────────────────────────────────────────────
  const handleDelete = async (product: Product) => {
    setDeletingId(product.id)
    try {
      await productService.remove(product.id)
      setProducts((prev) => prev.filter((p) => p.id !== product.id))
      toast.success(`"${truncate(product.name, 30)}" eliminado`)
    } catch {
      toast.error('No se pudo eliminar el producto')
    } finally {
      setDeletingId(null)
      setConfirmDelete(null)
    }
  }

  // ── Callback cuando se guarda el formulario ────────────────────────────────
  const handleSaved = (saved: Product) => {
    setProducts((prev) => {
      const exists = prev.find((p) => p.id === saved.id)
      if (exists) return prev.map((p) => (p.id === saved.id ? saved : p))
      return [saved, ...prev]
    })
    setModalOpen(false)
  }

  return (
    <div className="page-container">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-primary-500">Panel admin</span>
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Productos</h1>
          <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
            {products.length} producto{products.length !== 1 ? 's' : ''} registrado{products.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 active:bg-primary-800 transition-colors shadow-sm"
        >
          <Plus size={16} /> Nuevo producto
        </button>
      </div>

      {/* Lista de productos */}
      {loadingList ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-center">
          <div className="mb-4 rounded-2xl bg-surface-100 dark:bg-surface-800 p-6">
            <Package size={40} className="text-surface-300 dark:text-surface-600" />
          </div>
          <h3 className="font-semibold text-surface-900 dark:text-white">Sin productos</h3>
          <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
            Crea el primer producto con el botón de arriba
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <AdminProductCard
              key={product.id}
              product={product}
              onEdit={handleOpenEdit}
              onDelete={setConfirmDelete}
              deletingId={deletingId}
            />
          ))}
        </div>
      )}

      {/* Modal crear / editar */}
      {modalOpen && (
        <ProductModal
          product={editingProduct}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}

      {/* Modal confirmación de eliminación */}
      {confirmDelete && (
        <ConfirmDeleteModal
          product={confirmDelete}
          isLoading={deletingId === confirmDelete.id}
          onConfirm={() => handleDelete(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  )
}

// ─── AdminProductCard ─────────────────────────────────────────────────────────
interface AdminProductCardProps {
  product: Product
  onEdit: (p: Product) => void
  onDelete: (p: Product) => void
  deletingId: string | null
}

function AdminProductCard({ product, onEdit, onDelete, deletingId }: AdminProductCardProps) {
  const isDeleting = deletingId === product.id

  return (
    <div className="card overflow-hidden shadow-card hover:shadow-card-md transition-shadow animate-fade-in">
      {/* Imagen */}
      <div className="relative bg-surface-100 dark:bg-surface-800" style={{ paddingTop: '60%' }}>
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.svg' }}
        />
        {product.featured && (
          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-amber-900">
            <Star size={9} fill="currentColor" /> Destacado
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
            Sin stock
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4">
        <span className="text-[11px] font-medium uppercase tracking-wider text-primary-500 dark:text-primary-400 capitalize">
          {product.category}
        </span>
        <h3 className="mt-0.5 text-sm font-semibold text-surface-900 dark:text-white line-clamp-1">
          {product.name}
        </h3>
        <p className="mt-1 text-xs text-surface-500 dark:text-surface-400 line-clamp-2">
          {product.description}
        </p>

        {/* Precio y stock */}
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="font-bold text-surface-900 dark:text-white">
            {formatPrice(product.price)}
          </span>
          <span className={`text-xs font-medium ${product.stock <= 5 ? 'text-amber-500' : 'text-green-600 dark:text-green-400'}`}>
            Stock: {product.stock}
          </span>
        </div>

        {/* Acciones */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={() => onEdit(product)}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-surface-200 dark:border-surface-700 py-2 text-xs font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            <Pencil size={13} /> Editar
          </button>
          <button
            onClick={() => onDelete(product)}
            disabled={isDeleting}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-red-200 dark:border-red-800 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-40"
          >
            {isDeleting
              ? <Loader2 size={13} className="animate-spin" />
              : <Trash2 size={13} />}
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Modal de creación / edición ──────────────────────────────────────────────
interface ProductModalProps {
  product: Product | null   // null = crear, Product = editar
  onClose: () => void
  onSaved: (p: Product) => void
}

function ProductModal({ product, onClose, onSaved }: ProductModalProps) {
  const isEditing = !!product

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: isEditing
      ? {
          name:        product.name,
          description: product.description,
          price:       product.price,
          stock:       product.stock,
          category:    product.category,
          image:       product.image ?? '',
          featured:    product.featured ?? false,
        }
      : { featured: false, stock: 0 },
  })

  const imageUrlValue = watch('image')

  const onSubmit = async (data: ProductFormData) => {
    try {
      const payload = {
        ...data,
        image: data.image || undefined,
      }

      let saved: Product
      if (isEditing) {
        saved = await productService.update(product.id, payload)
        toast.success('Producto actualizado')
      } else {
        saved = await productService.create(payload)
        toast.success('Producto creado')
      }
      onSaved(saved)
      reset()
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error al guardar'
      toast.error(msg)
    }
  }

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-white dark:bg-surface-900 shadow-card-lg animate-slide-up">

        {/* Header del modal */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-surface-100 dark:border-surface-800 bg-white dark:bg-surface-900 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
              {isEditing ? 'Editar producto' : 'Nuevo producto'}
            </h2>
            <p className="text-xs text-surface-500 dark:text-surface-400">
              {isEditing ? `Editando: ${truncate(product.name, 35)}` : 'Completa todos los campos obligatorios'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">

          {/* Nombre */}
          <FormField label="Nombre del producto" required error={errors.name?.message}>
            <div className="relative">
              <Package size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
              <input
                {...register('name')}
                type="text"
                placeholder="iPhone 15 Pro"
                className={inputCls(!!errors.name)}
                style={{ paddingLeft: '2.25rem' }}
              />
            </div>
          </FormField>

          {/* Descripción */}
          <FormField label="Descripción" required error={errors.description?.message}>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Describe el producto con detalle…"
              className={inputCls(!!errors.description) + ' resize-none'}
            />
          </FormField>

          {/* Precio y Stock en fila */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Precio (COP/USD)" required error={errors.price?.message}>
              <div className="relative">
                <DollarSign size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  {...register('price', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="4500000"
                  className={inputCls(!!errors.price)}
                  style={{ paddingLeft: '2.25rem' }}
                />
              </div>
            </FormField>

            <FormField label="Stock" required error={errors.stock?.message}>
              <div className="relative">
                <Hash size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  {...register('stock', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  step="1"
                  placeholder="20"
                  className={inputCls(!!errors.stock)}
                  style={{ paddingLeft: '2.25rem' }}
                />
              </div>
            </FormField>
          </div>

          {/* Categoría */}
          <FormField label="Categoría" required error={errors.category?.message}>
            <div className="relative">
              <Tag size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
              <input
                {...register('category')}
                type="text"
                placeholder="smartphones, laptops, accesorios…"
                className={inputCls(!!errors.category)}
                style={{ paddingLeft: '2.25rem' }}
              />
            </div>
          </FormField>

          {/* Nombre de imagen */}
          <FormField label="Nombre de imagen" error={errors.image?.message}>
            <div className="relative">
              <Image size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
              <input
                {...register('image')}
                type="text"
                placeholder="imagen1.webp"
                className={inputCls(!!errors.image)}
                style={{ paddingLeft: '2.25rem' }}
              />
            </div>
            {/* Preview de imagen */}
            {imageUrlValue && !errors.image && (
              <div className="mt-2 overflow-hidden rounded-xl border border-surface-200 dark:border-surface-700">
                <img
                  src={`/image/${imageUrlValue}`}
                  alt="Preview"
                  className="h-32 w-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
            )}
          </FormField>

          {/* Featured toggle */}
          <div className="flex items-center gap-3 rounded-xl border border-surface-200 dark:border-surface-700 p-4">
            <input
              {...register('featured')}
              id="featured"
              type="checkbox"
              className="h-4 w-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500 dark:border-surface-600 dark:bg-surface-800"
            />
            <label htmlFor="featured" className="flex-1 cursor-pointer">
              <span className="flex items-center gap-1.5 text-sm font-medium text-surface-900 dark:text-white">
                <Star size={14} className="text-amber-500" /> Producto destacado
              </span>
              <span className="text-xs text-surface-400">
                Aparece en la sección de destacados del Home
              </span>
            </label>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-surface-200 dark:border-surface-700 py-2.5 text-sm font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors disabled:opacity-55 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <><Loader2 size={15} className="animate-spin" /> Guardando…</>
              ) : (
                <><CheckCircle size={15} /> {isEditing ? 'Guardar cambios' : 'Crear producto'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Modal confirmación de eliminar ──────────────────────────────────────────
interface ConfirmDeleteModalProps {
  product: Product
  isLoading: boolean
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmDeleteModal({ product, isLoading, onConfirm, onCancel }: ConfirmDeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-surface-900 p-6 shadow-card-lg animate-slide-up text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-900/20">
          <AlertTriangle size={26} className="text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-surface-900 dark:text-white">¿Eliminar producto?</h3>
        <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
          Estás a punto de eliminar <span className="font-medium text-surface-700 dark:text-surface-200">"{truncate(product.name, 40)}"</span>. Esta acción no se puede deshacer.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-surface-200 dark:border-surface-700 py-2.5 text-sm font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-55"
          >
            {isLoading ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function FormField({
  label, required, error, children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-surface-700 dark:text-surface-200">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

function inputCls(hasError: boolean) {
  return [
    'w-full rounded-xl border py-2.5 px-3.5 text-sm',
    'text-surface-900 placeholder:text-surface-400',
    'bg-white dark:bg-surface-800 dark:text-white dark:placeholder:text-surface-500',
    'transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1',
    hasError
      ? 'border-red-400 focus:ring-red-400 dark:border-red-500'
      : 'border-surface-200 focus:ring-primary-500 dark:border-surface-700',
  ].join(' ')
}

// Necesario para useEffect dentro de ProductModal sin hooks condicionales
