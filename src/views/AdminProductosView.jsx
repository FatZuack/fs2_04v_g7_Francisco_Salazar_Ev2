import { useState, useEffect } from 'react'
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Badge,
  Row,
  Col,
  Alert,
  Spinner,
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { productoService } from '../services/productoService'
import { categoriaService } from '../services/categoriaService'
import { getErrorMessage } from '../utils/getErrorMessage'

const formularioVacio = {
  id: null,
  nombre: '',
  precio: '',
  categoriaId: '',
  stock: '',
  descripcion: '',
  imagen: '',
}

function AdminProductosView() {
  const { rol } = useAuth()
  const esAdmin = rol === 'ADMIN'

  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)

  // Modal de Producto
  const [mostrarModal, setMostrarModal] = useState(false)
  const [modoEdicion, setModoEdicion] = useState(false)
  const [formulario, setFormulario] = useState(formularioVacio)

  // Modal de Categorías (solo ADMIN)
  const [mostrarCatModal, setMostrarCatModal] = useState(false)
  const [nuevaCat, setNuevaCat] = useState({ nombre: '', descripcion: '' })

  const [mensaje, setMensaje] = useState(null)

  const mostrarAlerta = (texto, tipo = 'success') => {
    setMensaje({ texto, tipo })
    setTimeout(() => setMensaje(null), 4000)
  }

  const cargarDatos = async () => {
    setCargando(true)
    try {
      const [prods, cats] = await Promise.all([
        productoService.list(),
        categoriaService.list(),
      ])
      setProductos(prods)
      setCategorias(cats)
    } catch (err) {
      mostrarAlerta(getErrorMessage(err), 'danger')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  const handleNuevo = () => {
    setFormulario({
      ...formularioVacio,
      categoriaId: categorias[0]?.id || '',
    })
    setModoEdicion(false)
    setMostrarModal(true)
  }

  const handleEditar = (producto) => {
    setFormulario({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      categoriaId: producto.categoriaId,
      stock: producto.stock,
      descripcion: producto.descripcion,
      imagen: producto.imagen || '',
    })
    setModoEdicion(true)
    setMostrarModal(true)
  }

  const handleCerrarModal = () => {
    setMostrarModal(false)
    setFormulario(formularioVacio)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormulario((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)

    const payload = {
      nombre: formulario.nombre.trim(),
      descripcion: formulario.descripcion.trim(),
      precio: Number(formulario.precio),
      stock: Number(formulario.stock),
      imagen: formulario.imagen.trim(),
      categoriaId: Number(formulario.categoriaId),
    }

    try {
      if (modoEdicion) {
        await productoService.update(formulario.id, payload)
        mostrarAlerta(`Producto "${payload.nombre}" actualizado en la base de datos.`)
      } else {
        await productoService.create(payload)
        mostrarAlerta(`Producto "${payload.nombre}" creado con éxito.`)
      }
      handleCerrarModal()
      await cargarDatos()
    } catch (err) {
      mostrarAlerta(getErrorMessage(err), 'danger')
    } finally {
      setGuardando(false)
    }
  }

  const handleEliminar = async (id, nombre) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar "${nombre}" del catálogo?`)) {
      return
    }
    try {
      await productoService.remove(id)
      mostrarAlerta(`Producto "${nombre}" eliminado del sistema.`, 'warning')
      await cargarDatos()
    } catch (err) {
      mostrarAlerta(getErrorMessage(err), 'danger')
    }
  }

  const handleCrearCategoria = async (e) => {
    e.preventDefault()
    try {
      await categoriaService.create({
        nombre: nuevaCat.nombre.trim(),
        descripcion: nuevaCat.descripcion.trim(),
      })
      setNuevaCat({ nombre: '', descripcion: '' })
      mostrarAlerta('Categoría creada correctamente.')
      await cargarDatos()
    } catch (err) {
      mostrarAlerta(getErrorMessage(err), 'danger')
    }
  }

  const handleEliminarCategoria = async (cat) => {
    if (!window.confirm(`¿Eliminar la categoría "${cat.nombre}"?`)) return
    try {
      await categoriaService.remove(cat.id)
      mostrarAlerta(`Categoría "${cat.nombre}" eliminada.`, 'warning')
      await cargarDatos()
    } catch (err) {
      mostrarAlerta(getErrorMessage(err), 'danger')
    }
  }

  return (
    <Container className="py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h1 className="h3 fw-bold mb-1">
            {esAdmin ? '⚙️ Gestión de Inventario' : '📋 Catálogo de Productos (Solo Lectura)'}
          </h1>
          <p className="text-muted mb-0">
            {esAdmin
              ? 'Control total del catálogo de productos, categorías y stock'
              : 'Consulta de precios, categorías y disponibilidad para ventas'}
          </p>
        </div>
        <div className="d-flex flex-wrap gap-2 mt-3 mt-md-0">
          <Button as={Link} to="/" variant="outline-secondary">
            Ver Tienda
          </Button>
          {esAdmin && (
            <>
              <Button variant="outline-primary" onClick={() => setMostrarCatModal(true)}>
                🏷️ Categorías ({categorias.length})
              </Button>
              <Button variant="primary" onClick={handleNuevo}>
                + Agregar Nuevo Producto
              </Button>
            </>
          )}
        </div>
      </div>

      {mensaje && (
        <Alert variant={mensaje.tipo} dismissible onClose={() => setMensaje(null)}>
          {mensaje.texto}
        </Alert>
      )}

      {cargando ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="success" />
          <p className="text-muted mt-2">Cargando inventario...</p>
        </div>
      ) : (
        <div className="bg-white rounded-3 shadow-sm border p-3">
          <Table responsive hover className="align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th style={{ width: '80px' }}>Imagen</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th className="text-center" style={{ width: '180px' }}>Acciones</th>
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
                          e.target.src =
                            'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80'
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
                      {esAdmin ? (
                        <div className="btn-group btn-group-sm">
                          <Button variant="outline-primary" onClick={() => handleEditar(prod)}>
                            Editar
                          </Button>
                          <Button
                            variant="outline-danger"
                            onClick={() => handleEliminar(prod.id, prod.nombre)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      ) : (
                        <Button
                          as={Link}
                          to={`/producto/${prod.id}`}
                          variant="outline-primary"
                          size="sm"
                        >
                          Ver Detalle
                        </Button>
                      )}
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
      )}

      {/* Modal Crear / Editar Producto (solo ADMIN) */}
      {esAdmin && (
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
                      name="categoriaId"
                      required
                      value={formulario.categoriaId}
                      onChange={handleChange}
                    >
                      <option value="">Selecciona categoría...</option>
                      {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nombre}
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
                      min="100"
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
                      Si se deja vacío, el servidor asignará una foto referencial automáticamente.
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
              <Button variant="secondary" onClick={handleCerrarModal} disabled={guardando}>
                Cancelar
              </Button>
              <Button variant="success" type="submit" disabled={guardando}>
                {guardando ? 'Guardando...' : modoEdicion ? 'Guardar Cambios' : 'Crear Producto'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}

      {/* Modal de Categorías (solo ADMIN) */}
      {esAdmin && (
        <Modal show={mostrarCatModal} onHide={() => setMostrarCatModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title className="h5 fw-bold">🏷️ Administrar Categorías</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleCrearCategoria} className="mb-4">
              <Form.Group className="mb-2">
                <Form.Label className="small fw-semibold">Nueva Categoría *</Form.Label>
                <Form.Control
                  type="text"
                  required
                  placeholder="Ej: Tortas Sin Azúcar"
                  value={nuevaCat.nombre}
                  onChange={(e) => setNuevaCat((p) => ({ ...p, nombre: e.target.value }))}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Control
                  type="text"
                  placeholder="Descripción breve (opcional)"
                  value={nuevaCat.descripcion}
                  onChange={(e) => setNuevaCat((p) => ({ ...p, descripcion: e.target.value }))}
                />
              </Form.Group>
              <div className="d-grid">
                <Button type="submit" variant="primary" size="sm">
                  + Agregar Categoría
                </Button>
              </div>
            </Form>

            <ul className="list-group">
              {categorias.map((cat) => (
                <li
                  key={cat.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{cat.nombre}</strong>
                    {cat.descripcion && <div className="small text-muted">{cat.descripcion}</div>}
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleEliminarCategoria(cat)}
                  >
                    Eliminar
                  </Button>
                </li>
              ))}
            </ul>
          </Modal.Body>
        </Modal>
      )}
    </Container>
  )
}

export default AdminProductosView