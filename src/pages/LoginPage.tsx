/**
 * pages/LoginPage.tsx
 * Campos exactos que espera el backend: email + password
 * Respuesta: { token, user } — se guarda en AuthContext
 */
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Mail, Lock, Eye, EyeOff, Zap, ArrowRight } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

// ─── Schema de validación ─────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es requerido')
    .email('Correo electrónico inválido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'Mínimo 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

// ─── Componente ───────────────────────────────────────────────────────────────
export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [showPassword, setShowPassword] = useState(false)

  // Si venía de una ruta protegida, redirigir allí después del login
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/home'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login({ email: data.email, password: data.password })
      toast.success('¡Bienvenido de vuelta!')
      navigate(from, { replace: true })
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error al iniciar sesión'
      toast.error(msg)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-surface-50 via-white to-primary-50/30 dark:from-surface-950 dark:via-surface-900 dark:to-primary-950/20 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 mb-4 shadow-glow">
            <Zap size={26} className="text-white" fill="white" />
          </div>
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white">
            Iniciar sesión
          </h1>
          <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
            ¿No tienes cuenta?{' '}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 underline-offset-4 hover:underline"
            >
              Regístrate gratis
            </Link>
          </p>
        </div>

        {/* Card */}
        <div className="card p-6 sm:p-8 shadow-card-md">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-surface-700 dark:text-surface-200"
              >
                Correo electrónico <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-surface-400"
                />
                <input
                  {...register('email')}
                  id="email"
                  type="email"
                  placeholder="juan@email.com"
                  autoComplete="email"
                  autoFocus
                  className={inputClass(!!errors.email)}
                  style={{ paddingLeft: '2.25rem' }}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Contraseña */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-surface-700 dark:text-surface-200"
                >
                  Contraseña <span className="text-red-500">*</span>
                </label>
                {/* Placeholder para recuperar contraseña — futuro */}
                <a
                  href="#"
                  className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 hover:underline underline-offset-4"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <Lock
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-surface-400"
                />
                <input
                  {...register('password')}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Tu contraseña"
                  autoComplete="current-password"
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
              {errors.password && (
                <p className="text-xs text-red-500" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 active:bg-primary-800 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-55 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 mt-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Iniciando sesión…
                </>
              ) : (
                <>
                  Iniciar sesión
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider + info */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-surface-200 dark:bg-surface-700" />
            <span className="text-xs text-surface-400">o continúa con</span>
            <div className="flex-1 h-px bg-surface-200 dark:bg-surface-700" />
          </div>

          {/* Acceso rápido demo — útil para presentación universitaria */}
          <div className="mt-4 rounded-xl border border-dashed border-surface-300 dark:border-surface-700 p-4">
            <p className="text-xs font-medium text-surface-500 dark:text-surface-400 mb-2 text-center">
              Credenciales de prueba
            </p>
            <div className="space-y-1 font-mono text-xs text-surface-600 dark:text-surface-400">
              <div className="flex justify-between">
                <span className="text-surface-400">Email:</span>
                <span>juan@email.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-400">Password:</span>
                <span>123456</span>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-surface-400 dark:text-surface-500">
          Al iniciar sesión aceptas nuestros{' '}
          <a href="#" className="underline hover:text-surface-600 dark:hover:text-surface-300">
            Términos y condiciones
          </a>
        </p>
      </div>
    </div>
  )
}

// ─── Helper ───────────────────────────────────────────────────────────────────
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