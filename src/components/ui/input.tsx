/**
 * components/ui/Input.tsx
 * Campo de texto con soporte para iconos, error y label
 */
import React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  wrapperClassName?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      wrapperClassName,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-surface-700 dark:text-surface-200"
          >
            {label}
            {props.required && (
              <span className="ml-1 text-red-500">*</span>
            )}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm',
              'text-surface-900 placeholder:text-surface-400',
              'transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1',
              'dark:bg-surface-800 dark:text-white dark:placeholder:text-surface-500',
              'dark:border-surface-700 dark:focus:ring-offset-surface-900',
              error
                ? 'border-red-400 focus:ring-red-400 dark:border-red-500'
                : 'border-surface-200 dark:border-surface-700',
              leftIcon  && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400">
              {rightIcon}
            </span>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-500 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
        {!error && hint && (
          <p className="text-xs text-surface-400">{hint}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'