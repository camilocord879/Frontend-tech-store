/**
 * routes/ProtectedRoute.tsx
 * Guarda de ruta: redirige a /login si el usuario no está autenticado.
 * Muestra un spinner mientras se verifica la sesión (isLoading).
 */
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  /** Rol requerido para acceder (opcional — para rutas admin) */
  requiredRole?: 'USER' | 'ADMIN'
  /** Si true, redirige a /home cuando ya está autenticado (ej: /login) */
  redirectIfAuthenticated?: boolean
}

export function ProtectedRoute({
  requiredRole,
  redirectIfAuthenticated = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  // Mientras se verifica el token almacenado, mostramos spinner
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-primary-600" size={32} />
      </div>
    )
  }

  // Redirigir usuarios ya autenticados fuera de login/register
  if (redirectIfAuthenticated && isAuthenticated) {
    return <Navigate to="/home" replace />
  }

  // Rutas protegidas sin sesión → /login
  if (!redirectIfAuthenticated && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Verificar rol (para panel admin futuro)
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/home" replace />
  }

  return <Outlet />
}