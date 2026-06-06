/**
 * components/ui/Badge.tsx
 */
import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantMap: Record<BadgeVariant, string> = {
  default: 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300',
  success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  danger:  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  info:    'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantMap[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * components/ui/EmptyState.tsx
 */
interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      {icon && (
        <div className="mb-4 rounded-2xl bg-surface-100 p-5 dark:bg-surface-800">
          <span className="text-surface-400 dark:text-surface-500">{icon}</span>
        </div>
      )}
      <h3 className="text-lg font-semibold text-surface-900 dark:text-white">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-surface-500 dark:text-surface-400">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * components/ui/ErrorState.tsx
 */
import { AlertTriangle } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Algo salió mal',
  message = 'No pudimos cargar la información. Por favor intenta de nuevo.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="mb-4 rounded-2xl bg-red-50 p-5 dark:bg-red-900/20">
        <AlertTriangle className="text-red-500" size={32} />
      </div>
      <h3 className="text-lg font-semibold text-surface-900 dark:text-white">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-surface-500 dark:text-surface-400">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
        >
          Reintentar
        </button>
      )}
    </div>
  )
}