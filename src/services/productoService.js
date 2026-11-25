import { httpClient } from '../api/httpClient'

export const productoService = {
  async list(params = {}) {
    const response = await httpClient.get('/v1/productos', { params })
    return response.data
  },
  async listV2(params = {}) {
    const response = await httpClient.get('/v2/productos', { params })
    return response.data
  },
  async find(id) {
    const response = await httpClient.get(`/v1/productos/${id}`)
    return response.data
  },
  async create(producto) {
    const response = await httpClient.post('/v1/productos', producto)
    return response.data
  },
  async update(id, producto) {
    const response = await httpClient.put(`/v1/productos/${id}`, producto)
    return response.data
  },
  async remove(id) {
    await httpClient.delete(`/v1/productos/${id}`)
  },
}