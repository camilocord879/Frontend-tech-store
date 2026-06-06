/**
 * lib/axios.ts
 * Instancia global de Axios con interceptores para:
 *  - Adjuntar JWT automáticamente en cada request
 *  - Redirigir a /login cuando el token expire (401)
 *  - Normalizar errores de la API
 */
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
})

// ─── Request interceptor: adjunta el token ────────────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('ts_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response interceptor: manejo global de errores ──────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Token expirado o no autorizado → limpiar sesión y redirigir
    if (error.response?.status === 401) {
      localStorage.removeItem('ts_token')
      localStorage.removeItem('ts_user')
      // Evitamos importar el router aquí; usamos el evento nativo
      window.dispatchEvent(new CustomEvent('ts:unauthorized'))
    }
    return Promise.reject(error)
  }
)

export default api