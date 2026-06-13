/**
 * components/layout/Navbar.tsx
 * Navbar fija con: logo, nav links, búsqueda, carrito, dark mode, perfil
 */
import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  ShoppingCart, Sun, Moon, User, Menu, X, Zap, Search,
  LayoutDashboard, Package, ClipboardList, Users, ShoppingBag
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useCartStore } from '@/contexts/cartStore'
import { cn } from '@/lib/utils'

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const cartStore = useCartStore()
  const navigate  = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const itemCount = cartStore.summary.itemCount ?? 0

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const navLinks = [
    { to: '/home',     label: 'Inicio' },
    { to: '/products', label: 'Productos' },
    { to: '/contact',  label: 'Contacto' },
    ...(user?.role === 'ADMIN' ? [{ to: '/admin/dashboard', label: 'Admin' }] : []),
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-surface-200/80 bg-white/90 backdrop-blur-md dark:border-surface-800/80 dark:bg-surface-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/home"
          className="flex items-center gap-2 text-primary-600 transition-opacity hover:opacity-80 dark:text-primary-400"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
            <Zap size={16} className="text-white" fill="white" />
          </div>
          <span className="hidden text-lg font-bold tracking-tight sm:block">
            Tech<span className="text-surface-900 dark:text-white">Store</span>
          </span>
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800'
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Búsqueda — desktop */}
        <form
          onSubmit={handleSearch}
          className="relative hidden flex-1 max-w-sm md:flex"
        >
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-surface-400"
          />
          <input
            type="search"
            placeholder="Buscar productos…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-surface-200 bg-surface-50 py-2 pl-9 pr-4 text-sm
              text-surface-900 placeholder:text-surface-400 transition-colors
              focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200
              dark:border-surface-700 dark:bg-surface-800 dark:text-white dark:placeholder:text-surface-500
              dark:focus:border-primary-600 dark:focus:ring-primary-900/40"
          />
        </form>

        {/* Acciones — derecha */}
        <div className="ml-auto flex items-center gap-1 sm:gap-2">

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Cambiar tema"
            className="rounded-lg p-2 text-surface-500 transition-colors hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Carrito */}
          <Link
            to="/cart"
            aria-label={`Carrito (${itemCount} ítems)`}
            className="relative rounded-lg p-2 text-surface-500 transition-colors hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800"
          >
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {isAuthenticated ? (
            <div className="relative group">
              <button className="flex items-center gap-1.5 rounded-xl border border-surface-200 px-3 py-1.5 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-100 dark:border-surface-700 dark:text-surface-300 dark:hover:bg-surface-800">
                <User size={15} />
                <span className="hidden sm:block">Cuenta</span>
              </button>
              {/* Dropdown */}
              <div className="invisible absolute right-0 top-full z-50 mt-1.5 w-52 origin-top-right scale-95 rounded-xl border border-surface-200 bg-white py-2 opacity-0 shadow-card-lg transition-all group-hover:visible group-hover:scale-100 group-hover:opacity-100 dark:border-surface-700 dark:bg-surface-900">
                <div className="px-4 py-1.5 text-xs font-semibold text-surface-400 dark:text-surface-500 border-b border-surface-100 dark:border-surface-800 mb-1">
                  Hola, {user.firstName}
                </div>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 dark:text-surface-300 dark:hover:bg-surface-800"
                >
                  <User size={14} /> Mi perfil
                </Link>
                <Link
                  to="/orders"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 dark:text-surface-300 dark:hover:bg-surface-800"
                >
                  <ShoppingBag size={14} /> Mis pedidos
                </Link>
                
                {user?.role === 'ADMIN' && (
                  <>
                    <div className="px-4 py-1 mt-2 text-[10px] font-bold uppercase tracking-wider text-primary-500 dark:text-primary-400">
                      Administración
                    </div>
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center gap-2 px-4 py-1.5 text-sm text-surface-700 hover:bg-surface-50 dark:text-surface-300 dark:hover:bg-surface-800"
                    >
                      <LayoutDashboard size={14} /> Dashboard
                    </Link>
                    <Link
                      to="/admin/products"
                      className="flex items-center gap-2 px-4 py-1.5 text-sm text-surface-700 hover:bg-surface-50 dark:text-surface-300 dark:hover:bg-surface-800"
                    >
                      <Package size={14} /> Productos
                    </Link>
                    <Link
                      to="/admin/orders"
                      className="flex items-center gap-2 px-4 py-1.5 text-sm text-surface-700 hover:bg-surface-50 dark:text-surface-300 dark:hover:bg-surface-800"
                    >
                      <ClipboardList size={14} /> Pedidos
                    </Link>
                    <Link
                      to="/admin/users"
                      className="flex items-center gap-2 px-4 py-1.5 text-sm text-surface-700 hover:bg-surface-50 dark:text-surface-300 dark:hover:bg-surface-800"
                    >
                      <Users size={14} /> Usuarios
                    </Link>
                  </>
                )}
                
                <hr className="my-1.5 border-surface-100 dark:border-surface-800" />
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                to="/login"
                className="rounded-xl px-3 py-1.5 text-sm font-medium text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800 transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
              >
                Registrarse
              </Link>
            </div>
          )}

          {/* Hamburger — mobile */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menú"
            className="rounded-lg p-2 text-surface-500 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800 md:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-950 md:hidden animate-slide-down">
          <nav className="flex flex-col px-4 py-3 gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-2.5 text-sm font-medium',
                    isActive
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                      : 'text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800'
                  )
                }
              >
                {label}
              </NavLink>
            ))}
            {/* Búsqueda mobile */}
            <form onSubmit={handleSearch} className="relative mt-2">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
              <input
                type="search"
                placeholder="Buscar productos…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-surface-200 bg-surface-50 py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
              />
            </form>
            {!isAuthenticated && (
              <div className="mt-3 flex gap-2">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 rounded-xl border border-surface-200 py-2.5 text-center text-sm font-medium text-surface-700 dark:border-surface-700 dark:text-white">
                  Iniciar sesión
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 rounded-xl bg-primary-600 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700">
                  Registrarse
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}