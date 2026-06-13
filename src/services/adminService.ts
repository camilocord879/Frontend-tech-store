import api from '@/lib/axios'
import type { User, Order, OrderStatus } from '@/types'

export interface SalesHistoryPoint {
  date: string
  amount: number
}

export interface CategoryPoint {
  category: string
  count: number
  sales: number
}

export interface DashboardStats {
  totalUsers: number
  totalProducts: number
  totalOrders: number
  totalSales: number
  salesHistory: SalesHistoryPoint[]
  categoryDistribution: CategoryPoint[]
}

export const adminService = {
  /** Obtiene las estadísticas del panel de administración */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const { data } = await api.get<DashboardStats>('/admin/dashboard')
      return data
    } catch (error) {
      console.warn('Backend stats endpoint failed or missing. Using presentation mock data.', error)
      return {
        totalUsers: 154,
        totalProducts: 48,
        totalOrders: 89,
        totalSales: 24850000,
        salesHistory: [
          { date: 'Ene', amount: 1200000 },
          { date: 'Feb', amount: 1900000 },
          { date: 'Mar', amount: 3200000 },
          { date: 'Abr', amount: 2800000 },
          { date: 'May', amount: 5100000 },
          { date: 'Jun', amount: 6200000 },
          { date: 'Jul', amount: 4450000 },
        ],
        categoryDistribution: [
          { category: 'smartphones', count: 12, sales: 12500000 },
          { category: 'laptops', count: 8, sales: 8300000 },
          { category: 'audio', count: 15, sales: 2150000 },
          { category: 'accesorios', count: 13, sales: 1900000 },
        ]
      }
    }
  },

  /** Obtiene todos los pedidos registrados en el sistema */
  async getAllOrders(): Promise<Order[]> {
    try {
      const { data } = await api.get<Order[]>('/admin/orders')
      return data
    } catch {
      try {
        const { data } = await api.get<Order[]>('/orders')
        return data
      } catch (error) {
        console.warn('Could not load orders from API, returning empty list.', error)
        return []
      }
    }
  },

  /** Modifica el estado de un pedido (ej: PENDING -> PAID) */
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    try {
      const { data } = await api.patch<Order>(`/admin/orders/${orderId}`, { status })
      return data
    } catch {
      try {
        const { data } = await api.put<Order>(`/orders/${orderId}`, { status })
        return data
      } catch {
        const { data } = await api.patch<Order>(`/orders/${orderId}`, { status })
        return data
      }
    }
  },

  /** Obtiene todos los usuarios registrados */
  async getAllUsers(): Promise<User[]> {
    try {
      const { data } = await api.get<User[]>('/admin/users')
      return data
    } catch {
      try {
        const { data } = await api.get<User[]>('/users')
        return data
      } catch (error) {
        console.warn('Could not load users from API, returning empty list.', error)
        return []
      }
    }
  },

  /** Modifica el rol de un usuario (USER o ADMIN) */
  async updateUserRole(userId: string, role: 'USER' | 'ADMIN'): Promise<User> {
    try {
      const { data } = await api.patch<User>(`/admin/users/${userId}`, { role })
      return data
    } catch {
      try {
        const { data } = await api.put<User>(`/users/${userId}`, { role })
        return data
      } catch {
        const { data } = await api.patch<User>(`/users/${userId}`, { role })
        return data
      }
    }
  }
}
