import axios from 'axios'
import { getAuthSession, clearAuthSession } from '../utils/authSession'

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
})

httpClient.interceptors.request.use((config) => {
  const session = getAuthSession()
  const isPublicAuth =
    config.url === '/auth/login' || config.url === '/auth/register'

  if (session && !isPublicAuth) {
    config.headers.Authorization = 'Bearer ' + session.accessToken
    config.sessionToken = session.accessToken
  }
  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const sentToken = error.config?.sessionToken
    const currentToken = getAuthSession()?.accessToken

    if (
      error.response?.status === 401 &&
      sentToken &&
      sentToken === currentToken
    ) {
      clearAuthSession()
    }
    return Promise.reject(error)
  }
)