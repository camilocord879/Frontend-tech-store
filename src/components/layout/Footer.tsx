/**
 * components/layout/Footer.tsx
 */
import { Link } from 'react-router-dom'
import { Zap, Github, Twitter, Instagram } from 'lucide-react'

export function Footer() {
  const year = new Date().getFullYear()

  const links = {
    Tienda:   [{ to: '/products', label: 'Productos' }, { to: '/home', label: 'Inicio' }],
    Cuenta:   [{ to: '/login', label: 'Iniciar sesión' }, { to: '/register', label: 'Registrarse' }, { to: '/profile', label: 'Mi perfil' }],
    Legal:    [{ to: '#', label: 'Términos y condiciones' }, { to: '#', label: 'Política de privacidad' }],
  }

  return (
    <footer className="mt-auto border-t border-surface-200 bg-surface-50 dark:border-surface-800 dark:bg-surface-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">

          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link to="/home" className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
                <Zap size={16} className="text-white" fill="white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-surface-900 dark:text-white">
                TechStore
              </span>
            </Link>
            <p className="mt-3 text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
              La mejor tecnología al mejor precio. Envíos a todo Colombia.
            </p>
            <div className="mt-4 flex gap-3">
              {[
                { Icon: Github, href: '#', label: 'GitHub' },
                { Icon: Twitter, href: '#', label: 'Twitter' },
                { Icon: Instagram, href: '#', label: 'Instagram' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface-200 text-surface-500 transition-colors hover:border-primary-300 hover:text-primary-600 dark:border-surface-700 dark:text-surface-400 dark:hover:border-primary-600 dark:hover:text-primary-400"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-surface-400 dark:text-surface-500">
                {section}
              </h3>
              <ul className="space-y-2">
                {items.map(({ to, label }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-surface-600 transition-colors hover:text-primary-600 dark:text-surface-400 dark:hover:text-primary-400"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-surface-200 pt-6 text-center text-xs text-surface-400 dark:border-surface-800 dark:text-surface-500">
          © {year} TechStore. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}