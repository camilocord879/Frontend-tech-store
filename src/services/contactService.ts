import api from '@/lib/axios'

export interface ContactPayload {
  name: string
  email: string
  subject: string
  message: string
}

export const contactService = {
  /** Envía un mensaje de contacto a la API */
  async sendContactMessage(payload: ContactPayload): Promise<{ success: boolean; message: string }> {
    const { data } = await api.post<{ success: boolean; message: string }>('/contact', payload)
    return data
  }
}
