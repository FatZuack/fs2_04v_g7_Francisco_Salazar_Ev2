import { httpClient } from '../api/httpClient'

export const authService = {
  async login(email, password) {
    const response = await httpClient.post('/auth/login', { email, password })
    return response.data
  },
  async register(datos) {
    const response = await httpClient.post('/auth/register', datos)
    return response.data
  },
  async refresh() {
    const response = await httpClient.post('/auth/refresh')
    return response.data
  },
  async me() {
    const response = await httpClient.get('/auth/me')
    return response.data
  },
}