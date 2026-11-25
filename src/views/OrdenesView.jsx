import { useEffect, useState } from 'react'
import {
  Container,
  Table,
  Badge,
  Button,
  Modal,
  Form,
  Alert,
  Spinner,
} from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import { boletaService } from '../services/boletaService'
import { getErrorMessage } from '../utils/getErrorMessage'

const ESTADOS = ['PAGADA', 'EN_PREPARACION', 'ENTREGADA', 'ANULADA']

function badgeEstado(estado) {
  switch (estado) {
    case 'ENTREGADA':
      return 'success'
    case 'EN_PREPARACION':
      return 'warning'
    case 'ANULADA':
      return 'danger'
    default:
      return 'primary'
  }
}

function OrdenesView() {
  const { rol } = useAuth()
  const esAdmin = rol === 'ADMIN'

  const [ordenes, setOrdenes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [ordenDetalle, setOrdenDetalle] = useState(null)
  const [mensaje, setMensaje] = useState(null)

  const mostrarAlerta = (texto, tipo = 'success') => {
    setMensaje({ texto, tipo })
    setTimeout(() => setMensaje(null), 4000)
  }

  const cargarOrdenes = async () => {
    setCargando(true)
    try {
      const data = await boletaService.listAll()
      setOrdenes(data)
    } catch (err) {
      mostrarAlerta(getErrorMessage(err), 'danger')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarOrdenes()
  }, [])

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await boletaService.updateEstado(id, nuevoEstado)
      mostrarAlerta(`Estado actualizado a ${nuevoEstado}.`)
      await cargarOrdenes()
    } catch (err) {
      mostrarAlerta(getErrorMessage(err), 'danger')
    }
  }

  const handleEliminar = async (orden) => {
    if (!window.confirm(`¿Eliminar la boleta #${orden.codigoOrden}?`)) return
    try {
      await boletaService.remove(orden.id)
      mostrarAlerta(`Boleta #${orden.codigoOrden} eliminada.`, 'warning')
      await cargarOrdenes()
    } catch (err) {
      mostrarAlerta(getErrorMessage(err), 'danger')
    }
  }

  const formatearFecha = (iso) => {
    if (!iso) return '-'
    return new Date(iso).toLocaleString('es-CL')
  }

  return (
    <Container className="py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h1 className="h3 fw-bold mb-1">📦 Órdenes y Boletas</h1>
          <p className="text-muted mb-0">
            {esAdmin
              ? 'Historial de ventas, seguimiento de despacho y control de estados'
              : 'Consulta de órdenes y detalle de boletas registradas (Solo Lectura)'}
          </p>
        </div>
        <Button variant="outline-primary" onClick={cargarOrdenes}>
          🔄 Actualizar
        </Button>
      </div>

      {mensaje && (
        <Alert variant={mensaje.tipo} dismissible onClose={() => setMensaje(null)}>
          {mensaje.texto}
        </Alert>
      )}

      {cargando ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="success" />
          <p className="text-muted mt-2">Cargando órdenes desde el servidor...</p>
        </div>
      ) : (
        <div className="bg-white rounded-3 shadow-sm border p-3">
          <Table responsive hover className="align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>Código</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Comuna</th>
                <th>Total</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.length > 0 ? (
                ordenes.map((orden) => (
                  <tr key={orden.id}>
                    <td className="fw-bold">{orden.codigoOrden}</td>
                    <td className="small">{formatearFecha(orden.fecha)}</td>
                    <td>
                      <div>{orden.nombreCliente}</div>
                      <small className="text-muted">{orden.emailCliente}</small>
                    </td>
                    <td>{orden.comuna}</td>
                    <td className="fw-bold text-primary">
                      ${Number(orden.total).toLocaleString('es-CL')}
                    </td>
                    <td>
                      {esAdmin ? (
                        <Form.Select
                          size="sm"
                          value={orden.estado}
                          onChange={(e) => handleCambiarEstado(orden.id, e.target.value)}
                          style={{ minWidth: '150px' }}
                        >
                          {ESTADOS.map((est) => (
                            <option key={est} value={est}>
                              {est}
                            </option>
                          ))}
                        </Form.Select>
                      ) : (
                        <Badge
                          bg={badgeEstado(orden.estado)}
                          text={orden.estado === 'EN_PREPARACION' ? 'dark' : undefined}
                        >
                          {orden.estado}
                        </Badge>
                      )}
                    </td>
                    <td className="text-center">
                      <div className="btn-group btn-group-sm">
                        <Button
                          variant="outline-primary"
                          onClick={() => setOrdenDetalle(orden)}
                        >
                          Ver Detalle
                        </Button>
                        {esAdmin && (
                          <Button
                            variant="outline-danger"
                            onClick={() => handleEliminar(orden)}
                          >
                            Eliminar
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    Todavía no hay boletas registradas. Realiza una compra desde el catálogo para verla aquí.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}

      {/* Modal de Detalle de Boleta (ADMIN y VENDEDOR) */}
      <Modal
        show={Boolean(ordenDetalle)}
        onHide={() => setOrdenDetalle(null)}
        centered
        size="lg"
      >
        {ordenDetalle && (
          <>
            <Modal.Header closeButton>
              <Modal.Title className="h5 fw-bold">
                🧾 Detalle Boleta #{ordenDetalle.codigoOrden}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3">
                <p className="mb-1">
                  <strong>Cliente:</strong> {ordenDetalle.nombreCliente} ({ordenDetalle.emailCliente})
                </p>
                <p className="mb-1">
                  <strong>Teléfono:</strong> {ordenDetalle.telefonoCliente || 'No informado'}
                </p>
                <p className="mb-1">
                  <strong>Despacho:</strong> {ordenDetalle.direccionDespacho}, {ordenDetalle.comuna}
                </p>
                <p className="mb-1">
                  <strong>Método de Pago:</strong> {ordenDetalle.metodoPago} |{' '}
                  <strong>Estado:</strong>{' '}
                  <Badge bg={badgeEstado(ordenDetalle.estado)}>{ordenDetalle.estado}</Badge>
                </p>
              </div>

              <Table size="sm" bordered className="align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Producto</th>
                    <th className="text-center">Cantidad</th>
                    <th>Precio Unit.</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {ordenDetalle.detalles.map((det) => (
                    <tr key={det.id}>
                      <td>{det.nombreProducto}</td>
                      <td className="text-center">{det.cantidad}</td>
                      <td>${Number(det.precioUnitario).toLocaleString('es-CL')}</td>
                      <td className="fw-bold">
                        ${Number(det.subtotal).toLocaleString('es-CL')}
                      </td>
                    </tr>
                  ))}
                  <tr className="table-light fw-bold">
                    <td colSpan="3" className="text-end">
                      Total Boleta:
                    </td>
                    <td className="text-primary">
                      ${Number(ordenDetalle.total).toLocaleString('es-CL')}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setOrdenDetalle(null)}>
                Cerrar
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </Container>
  )
}

export default OrdenesView