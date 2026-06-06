/**
 * components/ui/Skeleton.tsx
 * Skeleton loaders para estados de carga
 */
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-shimmer rounded-lg bg-gradient-to-r',
        'from-surface-200 via-surface-100 to-surface-200',
        'dark:from-surface-800 dark:via-surface-700 dark:to-surface-800',
        'bg-[length:700px_100%]',
        className
      )}
    />
  )
}

/** Skeleton para una card de producto */
export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-surface-100 bg-white dark:border-surface-800 dark:bg-surface-900">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  )
}

/** Skeleton para la página de detalle de producto */
export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <Skeleton className="aspect-square w-full rounded-2xl" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-12 w-full mt-6" />
      </div>
    </div>
  )
}