import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

export function AdminRoute() {
  const { isAuthenticated, isLoading, user } = useAuth()

  // Spinner mientras se verifica la sesión en localStorage
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-surface-950">
        <Loader2 className="animate-spin text-primary-600" size={32} />
      </div>
    )
  }

  // Si no está autenticado, va al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Si está autenticado pero no es ADMIN, va a Home
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/home" replace />
  }

  // Si es ADMIN, permite el acceso al Outlet
  return <Outlet />
}
export default AdminRoute
