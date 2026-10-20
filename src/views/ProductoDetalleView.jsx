import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap'

function ProductoDetalleView({ onAgregarCarrito }) {
  const { id } = useParams() // Captura el ID de la torta desde la URL
  const [producto, setProducto] = useState(null)
  const [mensaje, setMensaje] = useState(false)

  useEffect(() => {
    const productosGuardados = JSON.parse(localStorage.getItem('productos') || '[]')
    const encontrado = productosGuardados.find((p) => p.id === Number(id))
    setProducto(encontrado)
  }, [id])

  if (!producto) {
    return (
      <Container className="py-5 text-center">
        <h3>Producto no encontrado</h3>
        <p className="text-muted">El producto que buscas no existe o fue eliminado.</p>
        <Button as={Link} to="/" variant="primary">
          Volver al Catálogo
        </Button>
      </Container>
    )
  }

  const handleAgregar = () => {
    onAgregarCarrito(producto)
    setMensaje(true)
    setTimeout(() => setMensaje(false), 2500)
  }

  return (
    <Container className="py-4">
      <Link to="/" className="btn btn-outline-secondary mb-4">
        ← Volver al catálogo
      </Link>

      {mensaje && (
        <Alert variant="success" className="mb-4">
          ¡Añadiste <strong>{producto.nombre}</strong> al carrito de compras con éxito!
        </Alert>
      )}

      <Card className="shadow-sm border-0 p-3">
        <Row className="g-4 align-items-center">
          <Col md={6}>
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="img-fluid rounded-3 w-100"
              style={{ maxHeight: '420px', objectFit: 'cover' }}
            />
          </Col>
          <Col md={6}>
            <Badge bg="secondary" className="mb-2">
              {producto.categoria}
            </Badge>
            <h1 className="h2 fw-bold text-dark">{producto.nombre}</h1>
            <p className="lead text-muted">{producto.descripcion}</p>

            <h3 className="fw-bold text-primary mb-3">
              ${producto.precio.toLocaleString('es-CL')}
            </h3>

            <p className="mb-4">
              <strong>Disponibilidad:</strong>{' '}
              <span className="badge bg-success">{producto.stock} unidades en stock</span>
            </p>

            <div className="d-grid gap-2 d-md-flex">
              <Button variant="primary" size="lg" onClick={handleAgregar}>
                🛒 Añadir al carrito
              </Button>
              <Button as={Link} to="/carrito" variant="warning" size="lg">
                Ir al Carrito
              </Button>
            </div>
          </Col>
        </Row>
      </Card>
    </Container>
  )
}

export default ProductoDetalleView