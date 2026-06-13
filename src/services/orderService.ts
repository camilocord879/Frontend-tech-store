import api from '@/lib/axios'
import type { Order } from '@/types'

const ORDERS = '/orders'

export const orderService = {
  async createOrder(): Promise<Order> {
    const { data } = await api.post<Order>(ORDERS)
    return data
  },

  async getMyOrders(): Promise<Order[]> {
    const { data } = await api.get<Order[]>(`${ORDERS}/my-orders`)
    return data
  },

  async getOrderById(orderId: string): Promise<Order> {
    const { data } = await api.get<Order>(`${ORDERS}/${orderId}`)
    return data
  },

  /** Obtiene la factura en formato PDF (Blob) */
  async getInvoiceBlob(orderId: string): Promise<Blob> {
    const { data } = await api.get<Blob>(`${ORDERS}/${orderId}/invoice`, {
      responseType: 'blob',
    })
    return data
  },
}