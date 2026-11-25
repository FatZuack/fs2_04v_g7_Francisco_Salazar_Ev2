import { useState, useEffect } from 'react'
import { Container, Row, Col, Form, InputGroup, Spinner, Alert } from 'react-bootstrap'
import ProductCard from '../components/ProductCard'
import { productoService } from '../services/productoService'
import { getErrorMessage } from '../utils/getErrorMessage'

function TiendaView({ onAgregarCarrito }) {
  const [productos, setProductos] = useState([])
  const [filtroCategoria, setFiltroCategoria] = useState('Todas')
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const cargarCatalogo = async () => {
      setCargando(true)
      setError('')
      try {
        const data = await productoService.list()
        setProductos(data)
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setCargando(false)
      }
    }
    cargarCatalogo()
  }, [])

  const productosFiltrados = productos.filter((prod) => {
    const coincideCategoria =
      filtroCategoria === 'Todas' || prod.categoria === filtroCategoria
    const coincideTexto = prod.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase())
    return coincideCategoria && coincideTexto
  })

  const categorias = ['Todas', ...new Set(productos.map((p) => p.categoria))]

  return (
    <Container className="py-4">
      <div className="p-4 mb-4 bg-white rounded-3 shadow-sm border text-center">
        <h1 className="display-6 fw-bold text-dark">Nuestras Delicias Artesanales</h1>
        <p className="lead text-muted mb-0">
          Tortas tradicionales, recetas exclusivas y repostería de alta calidad.
        </p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4 g-3">
        <Col md={8}>
          <InputGroup>
            <InputGroup.Text>🔍</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar torta por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
          >
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {cargando ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="success" />
          <p className="text-muted mt-2">Cargando catálogo desde el servidor...</p>
        </div>
      ) : (
        <Row className="g-4">
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map((producto) => (
              <Col key={producto.id} xs={12} sm={6} lg={4}>
                <ProductCard
                  producto={producto}
                  onAgregarCarrito={onAgregarCarrito}
                />
              </Col>
            ))
          ) : (
            <Col xs={12}>
              <div className="alert alert-info text-center">
                No se encontraron productos que coincidan con la búsqueda.
              </div>
            </Col>
          )}
        </Row>
      )}
    </Container>
  )
}

export default TiendaView