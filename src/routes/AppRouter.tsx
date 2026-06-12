/**
 * routes/AppRouter.tsx
 * Configuración central de React Router DOM v6
 * con lazy loading por página para mejor performance
 */
import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

import { AppLayout }      from '@/components/layout/AppLayout'
import { ProtectedRoute } from './ProtectedRoute'

// ─── Lazy imports (code splitting automático) ─────────────────────────────────
const HomePage       = lazy(() => import('@/pages/HomePage'))
const LoginPage      = lazy(() => import('@/pages/LoginPage'))
const RegisterPage   = lazy(() => import('@/pages/RegisterPage'))
const ProductsPage   = lazy(() => import('@/pages/ProductsPage'))
const ProductPage    = lazy(() => import('@/pages/ProductPage'))
const CartPage       = lazy(() => import('@/pages/CartPage'))
const ProfilePage    = lazy(() => import('@/pages/ProfilePage'))
const MyOrdersPage   = lazy(() => import('@/pages/MyOrdersPage'))
const AdminProductsPage = lazy(() => import('@/pages/AdminProductPage'))
const NotFoundPage   = lazy(() => import('@/pages/NotFoundPage'))

// Fallback de carga mientras se descarga el chunk
function PageLoader() {
  return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="animate-spin text-primary-500" size={28} />
    </div>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Layout principal */}
          <Route path="/" element={<AppLayout />}>

            {/* Redirigir / → /home */}
            <Route index element={<Navigate to="/home" replace />} />

            {/* Públicas */}
            <Route path="home"     element={<HomePage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:id" element={<ProductPage />} />

            {/* Solo para NO autenticados */}
            <Route element={<ProtectedRoute redirectIfAuthenticated />}>
              <Route path="login"    element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>

            {/* Solo para autenticados */}
            <Route element={<ProtectedRoute />}>
              <Route path="cart"    element={<CartPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="my-orders" element={<MyOrdersPage />} />
            </Route>

            {/* Admin */}
            <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
              <Route path="admin/products" element={<AdminProductsPage />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
