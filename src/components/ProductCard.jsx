import { Card, Button, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function ProductCard({ producto, onAgregarCarrito }) {
  return (
    <Card className="h-100 shadow-sm border-0">
      <Card.Img
        variant="top"
        src={producto.imagen}
        alt={producto.nombre}
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Badge bg="secondary">{producto.categoria}</Badge>
          <small className="text-muted">Stock: {producto.stock}</small>
        </div>

        <Card.Title className="h5 fw-bold">{producto.nombre}</Card.Title>

        <Card.Text className="text-muted small flex-grow-1">
          {producto.descripcion}
        </Card.Text>

        <div className="mb-3">
          <span className="fs-5 fw-bold text-primary">
            ${producto.precio.toLocaleString('es-CL')}
          </span>
        </div>

        <div className="d-grid gap-2">
          <Button
            as={Link}
            to={`/producto/${producto.id}`}
            variant="outline-primary"
            size="sm"
          >
            Ver Detalle
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onAgregarCarrito && onAgregarCarrito(producto)}
          >
            Añadir al Carrito
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}

export default ProductCard