/**
 * lib/utils.ts
 * Funciones auxiliares reutilizables
 */
import { clsx, type ClassValue } from 'clsx'

/** Combina clases de Tailwind de forma segura */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/** Formatea un número como moneda colombiana / USD */
export function formatPrice(
  amount: number,
  currency = 'USD',
  locale = 'es-CO'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

/** Trunca texto a un máximo de caracteres */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}

/** URL del placeholder para productos sin imagen */
export const PLACEHOLDER_PRODUCT_IMAGE = '/placeholder-product.svg'

/** Devuelve un placeholder cuando imageUrl es nulo */
export function getImageUrl(url?: string | null, fallback = PLACEHOLDER_PRODUCT_IMAGE): string {
  if (!url || url.trim() === '') return fallback
  if (url.startsWith('http')) return url
  const apiBase = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')
  return `${apiBase}${url}`
}

/** Normaliza mensajes de error de Zod para mostrar texto legible */
function formatZodIssues(issues: unknown[]): string {
  const messages = issues
    .map((issue) => {
      if (!issue || typeof issue !== 'object') return null
      const i = issue as Record<string, unknown>
      const path = Array.isArray(i.path) ? i.path.join('.') : ''
      const message = typeof i.message === 'string' ? i.message : null
      const code = typeof i.code === 'string' ? i.code : ''

      if (path === 'confirmPassword') {
        return 'Confirma tu contraseña para continuar.'
      }

      if (path === 'password' && code === 'too_small') {
        return 'La contraseña debe tener al menos 8 caracteres.'
      }
      if (path === 'password' && code === 'invalid_format') {
        return 'La contraseña debe incluir al menos un carácter especial.'
      }
      if (path === 'phone' && code === 'invalid_format') {
        return 'Teléfono inválido. Usa exactamente 10 dígitos numéricos.'
      }

      return message || (path ? `${path}: ${message}` : message)
    })
    .filter(Boolean) as string[]

  return messages.length ? messages.join(' • ') : 'Datos inválidos. Revisa los campos.'
}

/** Extrae el mensaje de error de una respuesta Axios */
export function extractErrorMessage(error: unknown, fallback = 'Ocurrió un error inesperado'): string {
  if (typeof error === 'string') return error
  if (error && typeof error === 'object') {
    const e = error as Record<string, unknown>
    // Axios error con data.message o data array
    if (e.response && typeof e.response === 'object') {
      const data = (e.response as Record<string, unknown>).data
      if (Array.isArray(data)) {
        return formatZodIssues(data)
      }
      if (data && typeof data === 'object') {
        if (Array.isArray((data as Record<string, unknown>).errors)) {
          return formatZodIssues((data as Record<string, unknown>).errors as unknown[])
        }
        const msg = (data as Record<string, unknown>).message
        if (typeof msg === 'string') return msg
      }
    }
    if (Array.isArray(e)) {
      return formatZodIssues(e)
    }
    if (typeof e.message === 'string') return e.message
  }
  return fallback
}

/** Genera las iniciales de un nombre */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

/** Convierte un slug a título legible */
export function slugToTitle(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}