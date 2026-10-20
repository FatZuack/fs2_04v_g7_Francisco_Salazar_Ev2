import { useState, useEffect } from 'react'
import { Container, Table, Button, Modal, Form, Badge, Row, Col, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { productosIniciales } from '../data/productosIniciales'

const categoriasDisponibles = [
  'Tortas Tradicionales',
  'Tortas Especiales',
  'Postres',
  'Pastelería Fina'
]

const formularioVacio = {
  id: null,
  nombre: '',
  precio: '',
  categoria: 'Tortas Tradicionales',
  stock: '',
  descripcion: '',
  imagen: ''
}

function AdminProductosView() {
  const [productos, setProductos] = useState([])
  const [mostrarModal, setMostrarModal] = useState(false)
  const [modoEdicion, setModoEdicion] = useState(false)
  const [formulario, setFormulario] = useState(formularioVacio)
  const [mensaje, setMensaje] = useState(null)

  // Cargar inventario desde localStorage al montar
  const cargarProductos = () => {
    const data = JSON.parse(localStorage.getItem('productos') || '[]')
    setProductos(data)
  }

  useEffect(() => {
    cargarProductos()
  }, [])

  const mostrarAlerta = (texto, tipo = 'success') => {
    setMensaje({ texto, tipo })
    setTimeout(() => setMensaje(null), 3000)
  }

  // Restaurar inventario a los datos dummy originales
  const handleRestaurarFabrica = () => {
    if (window.confirm('¿Deseas restablecer el inventario al catálogo inicial con las 6 tortas? Se descartarán los cambios manuales.')) {
      localStorage.setItem('productos', JSON.stringify(productosIniciales))
      setProductos(productosIniciales)
      mostrarAlerta('Catálogo restaurado a los valores iniciales de fábrica.', 'info')
    }
  }

  // Abrir modal para crear
  const handleNuevo = () => {
    setFormulario(formularioVacio)
    setModoEdicion(false)
    setMostrarModal(true)
  }

  // Abrir modal para editar
  const handleEditar = (producto) => {
    setFormulario(producto)
    setModoEdicion(true)
    setMostrarModal(true)
  }

  // Cerrar modal
  const handleCerrarModal = () => {
    setMostrarModal(false)
    setFormulario(formularioVacio)
  }

  // Manejar inputs del formulario
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormulario((prev) => ({
      ...prev,
      [name]: name === 'precio' || name === 'stock' ? Number(value) : value
    }))
  }

  // Guardar (Crear o Modificar)
  const handleSubmit = (e) => {
    e.preventDefault()

    const productosActuales = JSON.parse(localStorage.getItem('productos') || '[]')
    let actualizados = []

    if (modoEdicion) {
      // Modificar existente
      actualizados = productosActuales.map((p) =>
        p.id === formulario.id ? { ...formulario } : p
      )
      mostrarAlerta(`Producto "${formulario.nombre}" actualizado con éxito.`)
    } else {
      // Crear nuevo con ID único
      const nuevoProducto = {
        ...formulario,
        id: Date.now(),
        imagen: formulario.imagen.trim() || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80'
      }
      actualizados = [nuevoProducto, ...productosActuales]
      mostrarAlerta(`Producto "${nuevoProducto.nombre}" agregado al inventario.`)
    }

    localStorage.setItem('productos', JSON.stringify(actualizados))
    setProductos(actualizados)
    handleCerrarModal()
  }

  // Eliminar producto
  const handleEliminar = (id, nombre) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar "${nombre}" del catálogo?`)) {
      const actualizados = productos.filter((p) => p.id !== id)
      localStorage.setItem('productos', JSON.stringify(actualizados))
      setProductos(actualizados)
      mostrarAlerta(`Producto "${nombre}" eliminado del sistema.`, 'warning')
    }
  }

  return (
    <Container className="py-4">
      {/* Cabecera del Panel */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h1 className="h3 fw-bold mb-1">⚙️ Gestión de Inventario</h1>
          <p className="text-muted mb-0">Control total del catálogo de productos y stock</p>
        </div>
        <div className="d-flex flex-wrap gap-2 mt-3 mt-md-0">
          <Button variant="outline-warning" onClick={handleRestaurarFabrica}>
            🔄 Restaurar Catálogo Inicial
          </Button>
          <Button as={Link} to="/" variant="outline-secondary">
            Ver Tienda
          </Button>
          <Button variant="primary" onClick={handleNuevo}>
            + Agregar Nuevo Producto
          </Button>
        </div>
      </div>

      {mensaje && (
        <Alert variant={mensaje.tipo} dismissible onClose={() => setMensaje(null)}>
          {mensaje.texto}
        </Alert>
      )}

      {/* Tabla de Productos */}
      <div className="bg-white rounded-3 shadow-sm border p-3">
        <Table responsive hover className="align-middle mb-0">
          <thead className="table-dark">
            <tr>
              <th style={{ width: '80px' }}>Imagen</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th className="text-center" style={{ width: '160px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length > 0 ? (
              productos.map((prod) => (
                <tr key={prod.id}>
                  <td>
                    <img
                      src={prod.imagen}
                      alt={prod.nombre}
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80'
                      }}
                    />
                  </td>
                  <td>
                    <strong>{prod.nombre}</strong>
                    <div className="small text-muted text-truncate" style={{ maxWidth: '280px' }}>
                      {prod.descripcion}
                    </div>
                  </td>
                  <td>
                    <Badge bg="secondary">{prod.categoria}</Badge>
                  </td>
                  <td className="fw-bold">${Number(prod.precio).toLocaleString('es-CL')}</td>
                  <td>
                    {prod.stock > 5 ? (
                      <span className="badge bg-success">{prod.stock} u.</span>
                    ) : prod.stock > 0 ? (
                      <span className="badge bg-warning text-dark">Bajo: {prod.stock} u.</span>
                    ) : (
                      <span className="badge bg-danger">Agotado</span>
                    )}
                  </td>
                  <td className="text-center">
                    <div className="btn-group btn-group-sm">
                      <Button variant="outline-primary" onClick={() => handleEditar(prod)}>
                        Editar
                      </Button>
                      <Button variant="outline-danger" onClick={() => handleEliminar(prod.id, prod.nombre)}>
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">
                  No hay productos registrados en el inventario.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Modal para Crear / Editar */}
      <Modal show={mostrarModal} onHide={handleCerrarModal} backdrop="static" centered size="lg">
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title className="h5 fw-bold">
              {modoEdicion ? '✏️ Editar Producto' : '🍰 Registrar Nuevo Producto'}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Row className="g-3">
              <Col md={7}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre del Producto *</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    required
                    value={formulario.nombre}
                    onChange={handleChange}
                    placeholder="Ej: Torta Tres Leches Gourmet"
                  />
                </Form.Group>
              </Col>

              <Col md={5}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoría *</Form.Label>
                  <Form.Select
                    name="categoria"
                    value={formulario.categoria}
                    onChange={handleChange}
                  >
                    {categoriasDisponibles.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio (CLP) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="precio"
                    min="1000"
                    step="100"
                    required
                    value={formulario.precio}
                    onChange={handleChange}
                    placeholder="Ej: 21990"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock Disponible *</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    min="0"
                    required
                    value={formulario.stock}
                    onChange={handleChange}
                    placeholder="Ej: 10"
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>URL de la Imagen</Form.Label>
                  <Form.Control
                    type="url"
                    name="imagen"
                    value={formulario.imagen}
                    onChange={handleChange}
                    placeholder="https://images.unsplash.com/..."
                  />
                  <Form.Text className="text-muted">
                    Si se deja vacío, se asignará una foto referencial automáticamente.
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group className="mb-2">
                  <Form.Label>Descripción del Producto *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="descripcion"
                    required
                    value={formulario.descripcion}
                    onChange={handleChange}
                    placeholder="Detalles sobre ingredientes, capas o preparación..."
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleCerrarModal}>
              Cancelar
            </Button>
            <Button variant="success" type="submit">
              {modoEdicion ? 'Guardar Cambios' : 'Crear Producto'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}

export default AdminProductosView