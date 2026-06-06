/**
 * contexts/AuthContext.tsx
 * Gestión global del estado de autenticación.
 * - Persiste sesión en localStorage
 * - Escucha el evento ts:unauthorized para cerrar sesión automáticamente
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { User, LoginPayload, RegisterPayload, UpdateProfilePayload } from '@/types'
import { authService } from '@/services/authService'
import { extractErrorMessage } from '@/lib/utils'

// ─── Tipos del contexto ───────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>
  logout: () => void
}

// ─── Contexto ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]   = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true) // true durante hidratación

  // Hidratación desde localStorage al montar
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('ts_token')
      const storedUser  = localStorage.getItem('ts_user')
      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser) as User)
      }
    } catch {
      // Si el JSON está corrupto, limpiamos
      localStorage.removeItem('ts_token')
      localStorage.removeItem('ts_user')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Escucha el evento global de 401 lanzado por el interceptor de Axios
  useEffect(() => {
    const handleUnauthorized = () => logout()
    window.addEventListener('ts:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('ts:unauthorized', handleUnauthorized)
  }, [])

  const saveSession = useCallback((newToken: string, newUser: User) => {
    localStorage.setItem('ts_token', newToken)
    localStorage.setItem('ts_user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }, [])

  const login = useCallback(async (payload: LoginPayload) => {
    try {
      const { token: t, user: u } = await authService.login(payload)
      saveSession(t, u)
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'Credenciales incorrectas'))
    }
  }, [saveSession])

  const register = useCallback(async (payload: RegisterPayload) => {
    try {
      const { token: t, user: u } = await authService.register(payload)
      saveSession(t, u)
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'Error al registrar usuario'))
    }
  }, [saveSession])

  const updateProfile = useCallback(async (payload: UpdateProfilePayload) => {
    try {
      const updatedUser = await authService.updateProfile(payload)
      if (token) {
        localStorage.setItem('ts_token', token)
      }
      localStorage.setItem('ts_user', JSON.stringify(updatedUser))
      setUser(updatedUser)
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'No se pudo actualizar el perfil'))
    }
  }, [token])

  const logout = useCallback(() => {
    localStorage.removeItem('ts_token')
    localStorage.removeItem('ts_user')
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      isLoading,
      login,
      register,
      updateProfile,
      logout,
    }),
    [user, token, isLoading, login, register, updateProfile, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}