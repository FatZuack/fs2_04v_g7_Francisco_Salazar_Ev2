import { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Badge } from 'react-bootstrap'
import { productosIniciales } from './data/productosIniciales'

function App() {
  const [productos, setProductos] = useState([])

  useEffect(() => {
    // 1. Inicializar LocalStorage con los productos si aún no existen
    const guardados = localStorage.getItem('productos')
    if (!guardados) {
      localStorage.setItem('productos', JSON.stringify(productosIniciales))
      setProductos(productosIniciales)
    } else {
      setProductos(JSON.parse(guardados))
    }
  }, [])

  return (
    <div className="bg-light min-vh-100 py-4">
      <Container>
        <header className="pb-3 mb-4 border-bottom d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h3 mb-0 text-dark fw-bold">Pastelería Mil Sabores</h1>
            <small className="text-muted">Panel Base - React + Vite + Bootstrap</small>
          </div>
          <Badge bg="success" className="px-3 py-2">
            LocalStorage Activo
          </Badge>
        </header>

        <div className="p-4 mb-4 bg-white rounded-3 shadow-sm border">
          <h2 className="h5 fw-bold">Estado de la Base de Datos Simulada</h2>
          <p className="text-muted mb-0">
            Se han cargado correctamente <strong>{productos.length}</strong> tortas y postres en el navegador.
          </p>
        </div>

        <h3 className="h5 mb-3 fw-bold">Catálogo Inicial Cargado:</h3>
        <Row className="g-3">
          {productos.map((prod) => (
            <Col key={prod.id} xs={12} sm={6} md={4}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Img
                  variant="top"
                  src={prod.imagen}
                  alt={prod.nombre}
                  style={{ height: '180px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Badge bg="secondary" className="mb-2">
                    {prod.categoria}
                  </Badge>
                  <Card.Title className="h6 fw-bold">{prod.nombre}</Card.Title>
                  <Card.Text className="small text-muted mb-2">
                    {prod.descripcion}
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <span className="fw-bold text-primary">
                      ${prod.precio.toLocaleString('es-CL')}
                    </span>
                    <small className="text-muted">Stock: {prod.stock}</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  )
}

export default App