import { httpClient } from '../api/httpClient'

export const boletaService = {
  async listAll() {
    const response = await httpClient.get('/v1/boletas')
    return response.data
  },
  async listMine() {
    const response = await httpClient.get('/v1/boletas/mias')
    return response.data
  },
  async find(id) {
    const response = await httpClient.get(`/v1/boletas/${id}`)
    return response.data
  },
  async create(boleta) {
    const response = await httpClient.post('/v1/boletas', boleta)
    return response.data
  },
  async updateEstado(id, estado) {
    const response = await httpClient.put(`/v1/boletas/${id}/estado`, { estado })
    return response.data
  },
  async remove(id) {
    await httpClient.delete(`/v1/boletas/${id}`)
  },
}