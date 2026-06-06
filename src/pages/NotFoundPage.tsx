/**
 * pages/NotFoundPage.tsx
 */
import { Link } from 'react-router-dom'
import { Home, Frown } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="page-container flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 rounded-2xl bg-surface-100 p-6 dark:bg-surface-800">
        <Frown size={48} className="text-surface-400" />
      </div>
      <h1 className="text-6xl font-bold text-primary-600">404</h1>
      <h2 className="mt-3 text-2xl font-semibold text-surface-900 dark:text-white">
        Página no encontrada
      </h2>
      <p className="mt-2 text-surface-500 dark:text-surface-400">
        La página que buscas no existe o fue movida.
      </p>
      <Link
        to="/home"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
      >
        <Home size={16} /> Volver al inicio
      </Link>
    </div>
  )
}