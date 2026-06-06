/**
 * components/layout/AppLayout.tsx
 * Layout principal que envuelve todas las páginas con Navbar + Footer
 * Agrega padding-top para compensar el Navbar fijo
 */
import { Outlet } from 'react-router-dom'
import { Navbar } from './NavBar'
import { Footer } from './Footer'

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-surface-900 dark:bg-surface-950 dark:text-white">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}