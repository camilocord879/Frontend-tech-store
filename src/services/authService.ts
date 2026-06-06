/**
 * services/authService.ts
 * Todas las llamadas al backend relacionadas con autenticación
 */
import api from '@/lib/axios'
import type { AuthResponse, LoginPayload, RegisterPayload, UpdateProfilePayload, User } from '@/types'

const AUTH = '/auth'

export const authService = {
  /** Registra un nuevo usuario */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>(`${AUTH}/register`, payload)
    return data
  },

  /** Inicia sesión y recibe token + usuario */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>(`${AUTH}/login`, payload)
    return data
  },

  /** Obtiene el perfil del usuario autenticado (si tu backend lo expone) */
  async getProfile(): Promise<User> {
    const { data } = await api.get<User>(`${AUTH}/me`)
    return data
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    const { data } = await api.patch<User>(`${AUTH}/profile`, payload)
    return data
  },
}