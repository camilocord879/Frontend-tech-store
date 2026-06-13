import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { ShoppingBag, ArrowLeft, Loader2, CreditCard, Truck, ShieldCheck } from 'lucide-react'
import { useCartStore } from '@/contexts/cartStore'
import { useAuth } from '@/contexts/AuthContext'
import { orderService } from '@/services/orderService'
import { extractErrorMessage, formatPrice, getImageUrl } from '@/lib/utils'

const checkoutSchema = z.object({
  fullName: z.string().min(4, 'Ingresa tu nombre completo (mínimo 4 caracteres)'),
  address: z.string().min(5, 'Ingresa una dirección de entrega válida'),
  city: z.string().min(2, 'Ingresa tu ciudad'),
  phone: z.string().regex(/^\d{10}$/, 'Teléfono inválido. Usa exactamente 10 dígitos numéricos'),
  paymentMethod: z.enum(['CREDIT_CARD', 'CASH_ON_DELIVERY'], {
    errorMap: () => ({ message: 'Selecciona un método de pago' }),
  }),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { cart, summary, isLoading, fetchCart, clearCart } = useCartStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user ? `${user.firstName} ${user.lastName}` : '',
      phone: user?.phone ?? '',
      paymentMethod: 'CREDIT_CARD',
    },
  })

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const items = cart?.items ?? []

  // Redirigir al carrito si está vacío
  useEffect(() => {
    if (!isLoading && cart && items.length === 0) {
      navigate('/cart')
    }
  }, [cart, items, isLoading, navigate])

  const onSubmit = async () => {
    setIsSubmitting(true)
    try {
      const order = await orderService.createOrder()
      clearCart()
      toast.success('¡Compra finalizada con éxito!')
      navigate(`/orders/${order.id}`)
    } catch (error) {
      toast.error(extractErrorMessage(error, 'No se pudo procesar la compra'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading && !cart) {
    return (
      <div className="page-container flex items-center justify-center py-32">
        <Loader2 className="animate-spin text-primary-500" size={32} />
      </div>
    )
  }

  return (
    <div className="page-container max-w-5xl">
      <div className="mb-6">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-sm font-medium text-surface-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <ArrowLeft size={16} /> Volver al carrito
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Formulario (Izquierda) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="card p-6 shadow-card-md">
            <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-6 flex items-center gap-2">
              <Truck size={20} className="text-primary-600" />
              Datos de envío y facturación
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Nombre completo */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-1.5">
                  Nombre completo
                </label>
                <input
                  {...register('fullName')}
                  type="text"
                  placeholder="Juan Pérez"
                  className={inputCls(!!errors.fullName)}
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>
                )}
              </div>

              {/* Dirección */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-1.5">
                  Dirección de entrega
                </label>
                <input
                  {...register('address')}
                  type="text"
                  placeholder="Calle 100 # 15 - 30 Apto 402"
                  className={inputCls(!!errors.address)}
                />
                {errors.address && (
                  <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Ciudad */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-1.5">
                    Ciudad
                  </label>
                  <input
                    {...register('city')}
                    type="text"
                    placeholder="Bogotá"
                    className={inputCls(!!errors.city)}
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>
                  )}
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-1.5">
                    Teléfono celular
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    placeholder="3101234567"
                    className={inputCls(!!errors.phone)}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Método de pago */}
              <div className="pt-2">
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-3">
                  Método de pago
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-3 rounded-xl border border-surface-200 dark:border-surface-700 p-4 cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                    <input
                      {...register('paymentMethod')}
                      type="radio"
                      value="CREDIT_CARD"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-surface-900 dark:text-white flex items-center gap-1.5">
                        <CreditCard size={14} className="text-surface-500" /> Tarjeta de Crédito
                      </span>
                      <span className="text-xs text-surface-400">Visa, Mastercard, Amex</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 rounded-xl border border-surface-200 dark:border-surface-700 p-4 cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                    <input
                      {...register('paymentMethod')}
                      type="radio"
                      value="CASH_ON_DELIVERY"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-surface-900 dark:text-white">
                        Contra Entrega
                      </span>
                      <span className="text-xs text-surface-400">Paga en efectivo al recibir</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Botón Finalizar Compra */}
              <button
                type="submit"
                disabled={isSubmitting || items.length === 0}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 py-3.5 text-sm font-semibold text-white hover:bg-primary-700 active:bg-primary-800 transition-colors disabled:cursor-not-allowed disabled:opacity-60 shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Procesando compra…
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} /> Finalizar Compra — {formatPrice(summary.total)}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Resumen de Compra (Derecha) */}
        <div className="lg:col-span-5">
          <div className="card p-6 shadow-card sticky top-24">
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-5 flex items-center gap-2">
              <ShoppingBag size={18} className="text-primary-600" />
              Resumen de compra
            </h2>

            {/* Listado de productos */}
            <div className="divide-y divide-surface-100 dark:divide-surface-800 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface-100 dark:bg-surface-800">
                    <img
                      src={getImageUrl(item.product.image)}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.svg' }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-1 text-xs font-semibold text-surface-900 dark:text-white">
                      {item.product.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-surface-500 dark:text-surface-400">
                      Cant: {item.quantity} • {formatPrice(item.product.price)}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-surface-900 dark:text-white">
                    {formatPrice(item.quantity * item.product.price)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totales */}
            <div className="border-t border-surface-200 dark:border-surface-700 pt-4 mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-surface-600 dark:text-surface-400">
                <span>Subtotal</span>
                <span>{formatPrice(summary.subtotal)}</span>
              </div>
              <div className="flex justify-between text-surface-600 dark:text-surface-400">
                <span>Envío</span>
                <span className="text-green-600 dark:text-green-400 font-medium">Gratis</span>
              </div>
              <div className="border-t border-surface-200 dark:border-surface-700 pt-3 flex justify-between font-bold text-surface-900 dark:text-white text-base">
                <span>Total</span>
                <span className="text-primary-600 dark:text-primary-400">
                  {formatPrice(summary.total)}
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-surface-50 dark:bg-surface-800 p-3.5 text-xs text-surface-500 dark:text-surface-400 leading-relaxed border border-surface-200/50 dark:border-surface-700/50">
              🛡️ **Compra garantizada**: Tus datos de transacción y de envío están protegidos de extremo a extremo.
            </div>
          </div>
        </div>
      </div>
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
