/**
 * pages/RegisterPage.tsx
 * Campos exactos que espera el backend:
 * firstName, lastName, username, email, phone, password
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import {
  User, Mail, Lock, Phone, AtSign,
  Eye, EyeOff, Zap, ArrowRight, CheckCircle2,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

// ─── Schema de validación Zod ─────────────────────────────────────────────────
const registerSchema = z
  .object({
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
    email: z
      .string()
      .email('Correo electrónico inválido'),
    phone: z
      .string()
      .min(10, 'El teléfono debe tener 10 dígitos')
      .max(10, 'El teléfono debe tener 10 dígitos')
      .regex(/^[0-9]{10}$/, 'Teléfono inválido. Usa 10 dígitos numéricos'),
    password: z
      .string()
      .min(8, 'Mínimo 8 caracteres')
      .max(100, 'Máximo 100 caracteres')
      .regex(/[^A-Za-z0-9]/, 'Debe incluir al menos un carácter especial'),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

// ─── Componente ───────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  // Para mostrar indicador de fuerza de contraseña
  const passwordValue = watch('password', '')

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        phone: data.phone,
        password: data.password,
        confirmPassword: data.confirmPassword,
      })
      toast.success(`¡Bienvenido, ${data.firstName}!`)
      navigate('/home')
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error al registrarse'
      toast.error(msg)
    }
  }

  // ── Fuerza de contraseña ──────────────────────────────────────────────────
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { level: 0, label: '', color: '' }
    let score = 0
    if (pwd.length >= 6) score++
    if (pwd.length >= 10) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^a-zA-Z0-9]/.test(pwd)) score++
    if (score <= 1) return { level: 1, label: 'Débil', color: 'bg-red-500' }
    if (score <= 3) return { level: 2, label: 'Regular', color: 'bg-yellow-500' }
    return { level: 3, label: 'Fuerte', color: 'bg-green-500' }
  }

  const strength = getPasswordStrength(passwordValue)

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-surface-50 via-white to-primary-50/30 dark:from-surface-950 dark:via-surface-900 dark:to-primary-950/20 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg animate-slide-up">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 mb-4 shadow-glow">
            <Zap size={26} className="text-white" fill="white" />
          </div>
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white">
            Crea tu cuenta
          </h1>
          <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 underline-offset-4 hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>

        {/* Card del formulario */}
        <div className="card p-6 sm:p-8 shadow-card-md">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

            {/* Fila: Nombre + Apellido */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-surface-700 dark:text-surface-200">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                  <input
                    {...register('firstName')}
                    type="text"
                    placeholder="Juan"
                    autoComplete="given-name"
                    className={inputClass(!!errors.firstName)}
                    style={{ paddingLeft: '2.25rem' }}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-xs text-red-500">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-surface-700 dark:text-surface-200">
                  Apellido <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                  <input
                    {...register('lastName')}
                    type="text"
                    placeholder="Pepe"
                    autoComplete="family-name"
                    className={inputClass(!!errors.lastName)}
                    style={{ paddingLeft: '2.25rem' }}
                  />
                </div>
                {errors.lastName && (
                  <p className="text-xs text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-surface-700 dark:text-surface-200">
                Nombre de usuario <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <AtSign size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  {...register('username')}
                  type="text"
                  placeholder="juan123"
                  autoComplete="username"
                  className={inputClass(!!errors.username)}
                  style={{ paddingLeft: '2.25rem' }}
                />
              </div>
              {errors.username ? (
                <p className="text-xs text-red-500">{errors.username.message}</p>
              ) : (
                <p className="text-xs text-surface-400">Solo letras, números y _ (sin espacios)</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-surface-700 dark:text-surface-200">
                Correo electrónico <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="juan@email.com"
                  autoComplete="email"
                  className={inputClass(!!errors.email)}
                  style={{ paddingLeft: '2.25rem' }}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Teléfono */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-surface-700 dark:text-surface-200">
                Teléfono <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  {...register('phone')}
                  type="tel"
                  placeholder="3001234567"
                  autoComplete="tel"
                  className={inputClass(!!errors.phone)}
                  style={{ paddingLeft: '2.25rem' }}
                />
              </div>
              <p className="text-xs text-surface-400">
                Usa 10 dígitos numéricos sin espacios ni guiones.
              </p>
              {errors.phone && (
                <p className="text-xs text-red-500">{errors.phone.message}</p>
              )}
            </div>

            {/* Contraseña */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-surface-700 dark:text-surface-200">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 8 caracteres y un carácter especial"
                  autoComplete="new-password"
                  className={inputClass(!!errors.password)}
                  style={{ paddingLeft: '2.25rem', paddingRight: '2.75rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 transition-colors"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="rounded-2xl bg-surface-50/80 dark:bg-surface-900/80 p-3 text-xs text-surface-500 dark:text-surface-400">
                <p className="font-medium text-surface-700 dark:text-surface-200">Requisitos de contraseña</p>
                <ul className="mt-2 space-y-1 pl-4 list-disc">
                  <li>Al menos 8 caracteres</li>
                  <li>Un carácter especial como <span className="font-semibold">!@#$%^&*</span></li>
                </ul>
              </div>
              {/* Barra de fuerza */}
              {passwordValue && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((lvl) => (
                      <div
                        key={lvl}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${strength.level >= lvl ? strength.color : 'bg-surface-200 dark:bg-surface-700'
                          }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-surface-500">
                    Contraseña: <span className="font-medium">{strength.label}</span>
                  </p>
                </div>
              )}
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-surface-700 dark:text-surface-200">
                Confirmar contraseña <span className="text-red-500">{errors.confirmPassword?.message}</span>
              </label>
              <div className="relative">
                <Lock size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  {...register('confirmPassword')}
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repite tu contraseña"
                  autoComplete="new-password"
                  className={inputClass(!!errors.confirmPassword)}
                  style={{ paddingLeft: '2.25rem', paddingRight: '2.75rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 transition-colors"
                  aria-label={showConfirm ? 'Ocultar' : 'Mostrar'}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Lo que incluye */}
            <div className="rounded-xl bg-primary-50 dark:bg-primary-900/20 p-3.5 space-y-1.5">
              {[
                'Acceso a todos los productos',
                'Carrito de compras personalizado',
                'Historial de pedidos',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs text-primary-700 dark:text-primary-300">
                  <CheckCircle2 size={13} className="shrink-0" />
                  {item}
                </div>
              ))}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 active:bg-primary-800 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-55 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creando cuenta…
                </>
              ) : (
                <>
                  Crear cuenta
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <p className="text-center text-xs text-surface-400 dark:text-surface-500">
              Al registrarte aceptas nuestros{' '}
              <a href="#" className="underline hover:text-surface-600 dark:hover:text-surface-300">
                Términos y condiciones
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

// ─── Helper: clases del input según estado de error ──────────────────────────
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
