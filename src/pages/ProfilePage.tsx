/**
 * pages/ProfilePage.tsx
 * Muestra los datos del usuario autenticado desde AuthContext (no hace fetch extra).
 * Los datos llegaron desde POST /api/auth/login → { token, user }
 */
import { useEffect, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import { useCartStore } from '@/contexts/cartStore'
import { getInitials } from '@/lib/utils'
import {
  Mail, Phone, Shield,
  ShoppingCart, LogOut, Calendar,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const profileSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Mínimo 2 caracteres')
    .max(50, 'Máximo 50 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Solo letras'),
  lastName: z
    .string()
    .min(2, 'Mínimo 2 caracteres')
    .max(50, 'Máximo 50 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Solo letras'),
  username: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .max(30, 'Máximo 30 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Solo letras, números y guión bajo'),
  email: z.string().email('Correo electrónico inválido'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Teléfono inválido. Usa exactamente 10 dígitos numéricos.').or(z.literal('')),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth()
  const { summary } = useCartStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      username: user?.username ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
    },
  })

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        phone: user.phone ?? '',
      })
    }
  }, [user, reset])

  if (!user) return null

  const isAdmin = user.role === 'ADMIN'

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        phone: data.phone?.trim() ? data.phone : undefined,
      })
      toast.success('Perfil actualizado correctamente')
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'No se pudo actualizar el perfil'
      toast.error(msg)
    }
  }

  return (
    <div className="page-container max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Mi perfil</h1>
          <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
            Revisa y actualiza tus datos. El rol no puede cambiarse desde aquí.
          </p>
        </div>
        <button
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-xl border border-surface-200 bg-white px-4 py-2 text-sm font-medium text-surface-600 hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-surface-700 dark:bg-surface-950 dark:text-surface-300 dark:hover:border-red-700 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all"
        >
          <LogOut size={15} /> Cerrar sesión
        </button>
      </div>

      {/* Perfil resumido */}
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] mb-5">
        <div className="card p-6 shadow-card-md animate-slide-up">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-2xl font-bold text-white shadow-glow">
              {getInitials(user.firstName, user.lastName)}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-surface-900 dark:text-white">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-sm text-surface-500 dark:text-surface-400">@{user.username}</p>
              <span className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold
                ${isAdmin
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  : 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'}`}
              >
                <Shield size={11} />
                {isAdmin ? 'Administrador' : 'Usuario'}
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <ProfileField icon={<Mail size={16} />} label="Correo electrónico" value={user.email} />
            <ProfileField icon={<Phone size={16} />} label="Teléfono" value={user.phone ?? 'No establecido'} />
            <ProfileField icon={<Calendar size={16} />} label="Miembro desde" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-CO', {
              year: 'numeric', month: 'long', day: 'numeric',
            }) : 'No disponible'} />
          </div>
        </div>

        <div className="card p-6 shadow-card-md animate-slide-up">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-surface-400 dark:text-surface-500 mb-4">
            Reglas de edición
          </h3>
          <ul className="space-y-2 text-sm text-surface-500 dark:text-surface-400">
            <li>El rol no se puede actualizar desde esta pantalla.</li>
            <li>El usuario se actualizará en tu sesión y en Supabase/Prisma si tu backend lo permite.</li>
            <li>Si tu backend devuelve errores, los verás con mensajes claros.</li>
          </ul>
        </div>
      </div>

      {/* Formulario de edición */}
      <form onSubmit={handleSubmit(onSubmit)} className="card p-6 shadow-card animate-slide-up" style={{ animationDelay: '60ms' }}>
        <h3 className="text-sm font-semibold uppercase tracking-widest text-surface-400 dark:text-surface-500 mb-4">
          Editar datos personales
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Nombre" error={errors.firstName?.message}>
            <input
              {...register('firstName')}
              type="text"
              placeholder="Juan"
              className={inputClass(!!errors.firstName)}
            />
          </FormField>

          <FormField label="Apellido" error={errors.lastName?.message}>
            <input
              {...register('lastName')}
              type="text"
              placeholder="Pérez"
              className={inputClass(!!errors.lastName)}
            />
          </FormField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 mt-4">
          <FormField label="Usuario" error={errors.username?.message}>
            <input
              {...register('username')}
              type="text"
              placeholder="juan123"
              className={inputClass(!!errors.username)}
            />
          </FormField>

          <FormField label="Correo electrónico" error={errors.email?.message}>
            <input
              {...register('email')}
              type="email"
              placeholder="juan@email.com"
              className={inputClass(!!errors.email)}
            />
          </FormField>
        </div>

        <FormField label="Teléfono" error={errors.phone?.message}>
          <input
            {...register('phone')}
            type="tel"
            placeholder="3001234567"
            className={inputClass(!!errors.phone)}
          />
          <p className="mt-2 text-xs text-surface-400">Opcional. 10 dígitos numéricos sin espacios.</p>
        </FormField>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 inline-flex items-center justify-center w-full rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition-all disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>

      {/* Resumen del carrito */}
      <div className="card p-6 shadow-card mb-5 animate-slide-up" style={{ animationDelay: '120ms' }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-surface-400 dark:text-surface-500 mb-1">
              Carrito actual
            </h3>
            <p className="text-2xl font-bold text-surface-900 dark:text-white">
              {summary.itemCount} <span className="text-base font-normal text-surface-500">productos</span>
            </p>
          </div>
          <Link
            to="/cart"
            className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
          >
            <ShoppingCart size={15} /> Ver carrito
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Helper: fila de dato ─────────────────────────────────────────────────────
interface ProfileFieldProps {
  icon: ReactNode
  label: string
  value: string
}

type FormFieldProps = {
  label: string
  error?: string
  children: ReactNode
}

function FormField({ label, error, children }: FormFieldProps) {
  return (
    <label className="block text-sm text-surface-600 dark:text-surface-300">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-surface-400 dark:text-surface-500">
        {label}
      </span>
      {children}
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </label>
  )
}


function inputClass(hasError: boolean) {
  return [
    'w-full rounded-xl border py-2.5 text-sm',
    'text-surface-900 placeholder:text-surface-400',
    'bg-white dark:bg-surface-800 dark:text-white dark:placeholder:text-surface-500',
    'transition-colors duration-150',
    'focus:outline-none focus:ring-2 focus:ring-offset-1',
    hasError
      ? 'border-red-400 focus:ring-red-400 dark:border-red-500'
      : 'border-surface-200 focus:ring-primary-500 dark:border-surface-700 dark:focus:ring-offset-surface-900',
  ].join(' ')
}

function ProfileField({ icon, label, value }: ProfileFieldProps) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-surface-400 dark:text-surface-500 shrink-0">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-surface-400 dark:text-surface-500">{label}</p>
        <p className="text-sm font-medium text-surface-800 dark:text-surface-200 break-all">{value}</p>
      </div>
    </div>
  )
}