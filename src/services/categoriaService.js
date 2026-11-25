import { httpClient } from '../api/httpClient'

export const categoriaService = {
  async list() {
    const response = await httpClient.get('/v1/categorias')
    return response.data
  },
  async create(categoria) {
    const response = await httpClient.post('/v1/categorias', categoria)
    return response.data
  },
  async update(id, categoria) {
    const response = await httpClient.put(`/v1/categorias/${id}`, categoria)
    return response.data
  },
  async remove(id) {
    await httpClient.delete(`/v1/categorias/${id}`)
  },
}