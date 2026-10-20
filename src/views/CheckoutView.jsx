import { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'

function CheckoutView({ carrito, onVaciarCarrito }) {
  const navigate = useNavigate()

  const [formulario, setFormulario] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    comuna: 'Santiago',
    metodoPago: 'debito',
  })

  const [ordenCompletada, setOrdenCompletada] = useState(null)
  const [errorStock, setErrorStock] = useState('')

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormulario((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // 1. Validar y descontar stock real en localStorage
    const productosGuardados = JSON.parse(localStorage.getItem('productos') || '[]')
    let stockInsuficiente = false

    const productosActualizados = productosGuardados.map((prod) => {
      const enCarrito = carrito.find((item) => item.id === prod.id)
      if (enCarrito) {
        if (prod.stock < enCarrito.cantidad) {
          stockInsuficiente = true
        }
        return { ...prod, stock: Math.max(0, prod.stock - enCarrito.cantidad) }
      }
      return prod
    })

    if (stockInsuficiente) {
      setErrorStock('Uno de los productos seleccionados ya no cuenta con stock suficiente.')
      return
    }

    // 2. Guardar nuevo stock y registrar la orden
    localStorage.setItem('productos', JSON.stringify(productosActualizados))

    const nuevaOrden = {
      idOrden: `ORD-${Date.now().toString().slice(-6)}`,
      fecha: new Date().toLocaleDateString('es-CL'),
      cliente: formulario,
      items: carrito,
      total,
    }

    const ordenesPrevias = JSON.parse(localStorage.getItem('ordenes') || '[]')
    localStorage.setItem('ordenes', JSON.stringify([nuevaOrden, ...ordenesPrevias]))

    // 3. Vaciar carrito y mostrar pantalla de confirmación
    onVaciarCarrito()
    setOrdenCompletada(nuevaOrden)
  }

  // Si el usuario llega con el carrito vacío y no acaba de pagar
  if (carrito.length === 0 && !ordenCompletada) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="warning">No hay productos en el carrito para procesar una compra.</Alert>
        <Button as={Link} to="/" variant="primary">
          Ir al Catálogo
        </Button>
      </Container>
    )
  }

  // Vista de Orden Confirmada (Boleta / Comprobante)
  if (ordenCompletada) {
    return (
      <Container className="py-5">
        <Card className="shadow border-0 mx-auto" style={{ maxWidth: '650px' }}>
          <Card.Header className="bg-success text-white text-center py-3">
            <h2 className="h4 mb-0 fw-bold">✓ ¡Pago Procesado con Éxito!</h2>
            <small>Orden de compra #{ordenCompletada.idOrden}</small>
          </Card.Header>
          <Card.Body className="p-4">
            <h5 className="fw-bold mb-3">Detalle del Despacho:</h5>
            <p className="mb-1"><strong>Destinatario:</strong> {ordenCompletada.cliente.nombre}</p>
            <p className="mb-1"><strong>Correo:</strong> {ordenCompletada.cliente.email}</p>
            <p className="mb-1"><strong>Dirección:</strong> {ordenCompletada.cliente.direccion}, {ordenCompletada.cliente.comuna}</p>
            <p className="mb-4"><strong>Método de Pago:</strong> {ordenCompletada.cliente.metodoPago.toUpperCase()}</p>

            <h5 className="fw-bold mb-2">Productos adquiridos:</h5>
            <ul className="list-group mb-4">
              {ordenCompletada.items.map((item) => (
                <li key={item.id} className="list-group-item d-flex justify-content-between">
                  <span>{item.nombre} x {item.cantidad}</span>
                  <strong>${(item.precio * item.cantidad).toLocaleString('es-CL')}</strong>
                </li>
              ))}
              <li className="list-group-item d-flex justify-content-between bg-light fw-bold fs-5">
                <span>Total pagado:</span>
                <span className="text-success">${ordenCompletada.total.toLocaleString('es-CL')}</span>
              </li>
            </ul>

            <div className="d-grid gap-2">
              <Button as={Link} to="/" variant="primary" size="lg">
                Volver a la Tienda
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <h1 className="h3 fw-bold mb-4">Finalizar Compra y Despacho</h1>

      {errorStock && <Alert variant="danger">{errorStock}</Alert>}

      <Row className="g-4">
        <Col md={7}>
          <div className="bg-white rounded-3 shadow-sm border p-4">
            <h2 className="h5 fw-bold mb-3">Información de Envío</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre completo</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  required
                  placeholder="Ej: Juan Pérez"
                  value={formulario.nombre}
                  onChange={handleChange}
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Correo electrónico</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      required
                      placeholder="nombre@ejemplo.com"
                      value={formulario.email}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Teléfono de contacto</Form.Label>
                    <Form.Control
                      type="tel"
                      name="telefono"
                      required
                      placeholder="+56 9 1234 5678"
                      value={formulario.telefono}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Dirección (Calle y Número)</Form.Label>
                    <Form.Control
                      type="text"
                      name="direccion"
                      required
                      placeholder="Av. Pajaritos 1234, Depto 502"
                      value={formulario.direccion}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Comuna</Form.Label>
                    <Form.Select
                      name="comuna"
                      value={formulario.comuna}
                      onChange={handleChange}
                    >
                      <option value="Maipú">Maipú</option>
                      <option value="Santiago">Santiago Centro</option>
                      <option value="Providencia">Providencia</option>
                      <option value="Las Condes">Las Condes</option>
                      <option value="Ñuñoa">Ñuñoa</option>
                      <option value="La Florida">La Florida</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <h2 className="h5 fw-bold mt-4 mb-3">Método de Pago</h2>
              <div className="mb-4">
                <Form.Check
                  type="radio"
                  id="pago-debito"
                  name="metodoPago"
                  value="debito"
                  label="Redcompra / Tarjeta de Débito (WebPay)"
                  checked={formulario.metodoPago === 'debito'}
                  onChange={handleChange}
                />
                <Form.Check
                  type="radio"
                  id="pago-credito"
                  name="metodoPago"
                  value="credito"
                  label="Tarjeta de Crédito (3 cuotas sin interés)"
                  checked={formulario.metodoPago === 'credito'}
                  onChange={handleChange}
                />
                <Form.Check
                  type="radio"
                  id="pago-transferencia"
                  name="metodoPago"
                  value="transferencia"
                  label="Transferencia Bancaria directa"
                  checked={formulario.metodoPago === 'transferencia'}
                  onChange={handleChange}
                />
              </div>

              <div className="d-grid">
                <Button type="submit" variant="success" size="lg">
                  Confirmar y Pagar ${total.toLocaleString('es-CL')}
                </Button>
              </div>
            </Form>
          </div>
        </Col>

        {/* Resumen lateral de la orden */}
        <Col md={5}>
          <Card className="shadow-sm border-0 sticky-top" style={{ top: '80px' }}>
            <Card.Header className="bg-light fw-bold">Resumen de la Orden</Card.Header>
            <Card.Body>
              <ul className="list-group list-group-flush mb-3">
                {carrito.map((item) => (
                  <li key={item.id} className="list-group-item d-flex justify-content-between px-0">
                    <div>
                      <span className="fw-semibold">{item.nombre}</span>
                      <small className="text-muted d-block">Cant: {item.cantidad}</small>
                    </div>
                    <span>${(item.precio * item.cantidad).toLocaleString('es-CL')}</span>
                  </li>
                ))}
              </ul>
              <div className="d-flex justify-content-between fs-5 fw-bold border-top pt-3">
                <span>Total:</span>
                <span className="text-primary">${total.toLocaleString('es-CL')}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default CheckoutView