import { httpClient } from '../api/httpClient'

export const usuarioService = {
  async list() {
    const response = await httpClient.get('/v1/usuarios')
    return response.data
  },
  async create(usuario) {
    const response = await httpClient.post('/v1/usuarios', usuario)
    return response.data
  },
  async update(id, usuario) {
    const response = await httpClient.put(`/v1/usuarios/${id}`, usuario)
    return response.data
  },
  async remove(id) {
    await httpClient.delete(`/v1/usuarios/${id}`)
  },
}