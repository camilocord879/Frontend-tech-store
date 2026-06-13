import api from '@/lib/axios'
import type { User, Order, OrderStatus, Product } from '@/types'

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
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalSales: number;
  lowStockProducts: Product[];
  recentOrders: Order[];
}

export const adminService = {
  /** Obtiene las estadísticas del panel de administración */
  async getDashboardStats(): Promise<DashboardStats> {
    const { data } = await api.get<DashboardStats>(
      "/admin/dashboard"
    );

    return data;
  },

  /** Obtiene todos los pedidos registrados en el sistema */
  async getAllOrders(): Promise<Order[]> {
    try {
      const { data } = await api.get<Order[]>("/admin/orders");
      return data;
    } catch {
      try {
        const { data } = await api.get<Order[]>("/orders");
        return data;
      } catch (error) {
        console.warn(
          "Could not load orders from API, returning empty list.",
          error
        );
        return [];
      }
    }
  },

  /** Modifica el estado de un pedido */
  async updateOrderStatus(
    orderId: string,
    status: OrderStatus
  ): Promise<Order> {
    const { data } = await api.patch<Order>(
      `/admin/orders/${orderId}/status`,
      { status }
    );

    return data;
  },

  /** Obtiene todos los usuarios registrados */
  async getAllUsers(): Promise<User[]> {
    const { data } = await api.get<User[]>("/admin/users");
    return data;
  },

  /** Modifica el rol de un usuario */
  async updateUserRole(
    userId: string,
    role: "USER" | "ADMIN"
  ): Promise<User> {
    const { data } = await api.patch<User>(
      `/admin/users/${userId}/role`,
      { role }
    );

    return data;
  },
};