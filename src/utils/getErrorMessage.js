export function getErrorMessage(error) {
  if (error?.response?.data?.message) {
    return error.response.data.message
  }
  if (error?.response?.status === 401) {
    return 'Tu sesión expiró o no es válida. Inicia sesión nuevamente.'
  }
  if (error?.response?.status === 403) {
    return 'No tienes permisos para realizar esta acción.'
  }
  if (error?.response?.status === 404) {
    return 'El recurso solicitado no existe.'
  }
  if (error?.response?.status >= 500) {
    return 'Error interno en el servidor. Intenta nuevamente.'
  }
  if (error?.request) {
    return 'No se pudo conectar con el servidor. Verifica que el backend esté activo.'
  }
  return error?.message || 'Ocurrió un error inesperado.'
}