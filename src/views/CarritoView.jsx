import { Container, Table, Button, Card, Row, Col, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'

function CarritoView({ carrito, onModificarCantidad, onEliminar, onVaciar }) {
  const navigate = useNavigate()

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0)

  if (carrito.length === 0) {
    return (
      <Container className="py-5 text-center">
        <div className="p-5 bg-white rounded-3 shadow-sm border">
          <h2 className="h4 fw-bold">Tu carrito de compras está vacío</h2>
          <p className="text-muted">¿Aún no decides qué delicia llevar hoy?</p>
          <Button as={Link} to="/" variant="primary">
            Explorar Catálogo
          </Button>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <h1 className="h3 fw-bold mb-4">🛒 Carrito de Compras</h1>

      <Row className="g-4">
        {/* Tabla de Productos */}
        <Col lg={8}>
          <div className="bg-white rounded-3 shadow-sm border p-3">
            <Table responsive hover className="align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th className="text-center">Cantidad</th>
                  <th>Subtotal</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={item.imagen}
                          alt={item.nombre}
                          style={{ width: '55px', height: '55px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <div>
                          <strong>{item.nombre}</strong>
                          <div className="small text-muted">{item.categoria}</div>
                        </div>
                      </div>
                    </td>
                    <td>${item.precio.toLocaleString('es-CL')}</td>
                    <td className="text-center">
                      <div className="btn-group btn-group-sm" role="group">
                        <Button
                          variant="outline-secondary"
                          onClick={() => onModificarCantidad(item.id, item.cantidad - 1)}
                        >
                          -
                        </Button>
                        <span className="btn btn-outline-secondary disabled fw-bold text-dark px-3">
                          {item.cantidad}
                        </span>
                        <Button
                          variant="outline-secondary"
                          onClick={() => onModificarCantidad(item.id, item.cantidad + 1)}
                          disabled={item.cantidad >= item.stock}
                        >
                          +
                        </Button>
                      </div>
                    </td>
                    <td className="fw-bold">${(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
                    <td className="text-center">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => onEliminar(item.id)}
                      >
                        🗑️
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <div className="mt-3 text-end">
              <Button variant="outline-danger" size="sm" onClick={onVaciar}>
                Vaciar Carrito
              </Button>
            </div>
          </div>
        </Col>

        {/* Resumen del Pedido */}
        <Col lg={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title className="h5 fw-bold mb-3">Resumen de Compra</Card.Title>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span>${total.toLocaleString('es-CL')}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Envío</span>
                <span className="text-success fw-bold">Gratis</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fs-5 fw-bold mb-4">
                <span>Total a pagar:</span>
                <span className="text-primary">${total.toLocaleString('es-CL')}</span>
              </div>

              <div className="d-grid gap-2">
                <Button
                  variant="success"
                  size="lg"
                  onClick={() => navigate('/checkout')}
                >
                  Proceder al Pago
                </Button>
                <Button as={Link} to="/" variant="outline-secondary">
                  Seguir Comprando
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default CarritoView