import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner } from 'react-bootstrap'
import { productoService } from '../services/productoService'
import { getErrorMessage } from '../utils/getErrorMessage'

function ProductoDetalleView({ onAgregarCarrito }) {
  const { id } = useParams()
  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState(false)

  useEffect(() => {
    const cargarDetalle = async () => {
      setCargando(true)
      setError('')
      try {
        const data = await productoService.find(id)
        setProducto(data)
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setCargando(false)
      }
    }
    cargarDetalle()
  }, [id])

  if (cargando) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="text-muted mt-2">Cargando producto...</p>
      </Container>
    )
  }

  if (error || !producto) {
    return (
      <Container className="py-5 text-center">
        <h3>Producto no encontrado</h3>
        <p className="text-muted">{error || 'El producto que buscas no existe o fue eliminado.'}</p>
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
              {producto.stock > 0 ? (
                <span className="badge bg-success">{producto.stock} unidades en stock</span>
              ) : (
                <span className="badge bg-danger">Agotado</span>
              )}
            </p>

            <div className="d-grid gap-2 d-md-flex">
              <Button
                variant="primary"
                size="lg"
                onClick={handleAgregar}
                disabled={producto.stock <= 0}
              >
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