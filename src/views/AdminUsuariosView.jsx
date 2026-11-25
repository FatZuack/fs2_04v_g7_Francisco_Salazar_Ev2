import { useEffect, useState } from 'react'
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
import { useAuth } from '../context/AuthContext'
import { usuarioService } from '../services/usuarioService'
import { getErrorMessage } from '../utils/getErrorMessage'

const formInicial = {
  id: null,
  nombre: '',
  email: '',
  telefono: '',
  password: '',
  rol: 'CLIENTE',
}

function AdminUsuariosView() {
  const { usuario: usuarioActual } = useAuth()
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [modoEdicion, setModoEdicion] = useState(false)
  const [formulario, setFormulario] = useState(formInicial)
  const [mensaje, setMensaje] = useState(null)

  const mostrarAlerta = (texto, tipo = 'success') => {
    setMensaje({ texto, tipo })
    setTimeout(() => setMensaje(null), 4000)
  }

  const cargarUsuarios = async () => {
    setCargando(true)
    try {
      const data = await usuarioService.list()
      setUsuarios(data)
    } catch (err) {
      mostrarAlerta(getErrorMessage(err), 'danger')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarUsuarios()
  }, [])

  const handleNuevo = () => {
    setFormulario(formInicial)
    setModoEdicion(false)
    setMostrarModal(true)
  }

  const handleEditar = (u) => {
    setFormulario({
      id: u.id,
      nombre: u.nombre,
      email: u.email,
      telefono: u.telefono || '',
      password: '',
      rol: u.rol,
    })
    setModoEdicion(true)
    setMostrarModal(true)
  }

  const handleCerrar = () => {
    setMostrarModal(false)
    setFormulario(formInicial)
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
      email: formulario.email.trim().toLowerCase(),
      telefono: formulario.telefono.trim(),
      password: formulario.password,
      rol: formulario.rol,
    }

    try {
      if (modoEdicion) {
        await usuarioService.update(formulario.id, payload)
        mostrarAlerta(`Usuario "${payload.nombre}" actualizado correctamente.`)
      } else {
        await usuarioService.create(payload)
        mostrarAlerta(`Usuario "${payload.nombre}" creado con rol ${payload.rol}.`)
      }
      handleCerrar()
      await cargarUsuarios()
    } catch (err) {
      mostrarAlerta(getErrorMessage(err), 'danger')
    } finally {
      setGuardando(false)
    }
  }

  const handleEliminar = async (u) => {
    if (!window.confirm(`¿Eliminar definitivamente al usuario "${u.nombre}" (${u.email})?`)) {
      return
    }
    try {
      await usuarioService.remove(u.id)
      mostrarAlerta(`Usuario "${u.nombre}" eliminado.`, 'warning')
      await cargarUsuarios()
    } catch (err) {
      mostrarAlerta(getErrorMessage(err), 'danger')
    }
  }

  const colorRol = (rol) =>
    rol === 'ADMIN' ? 'danger' : rol === 'VENDEDOR' ? 'warning' : 'primary'

  return (
    <Container className="py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h1 className="h3 fw-bold mb-1">👥 Gestión de Usuarios y Roles</h1>
          <p className="text-muted mb-0">Administración de cuentas ADMIN, VENDEDOR y CLIENTE</p>
        </div>
        <Button variant="primary" onClick={handleNuevo}>
          + Nuevo Usuario
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
          <p className="text-muted mt-2">Cargando usuarios...</p>
        </div>
      ) : (
        <div className="bg-white rounded-3 shadow-sm border p-3">
          <Table responsive hover className="align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => {
                const esMiCuenta =
                  u.email.toLowerCase() === usuarioActual?.email?.toLowerCase()
                return (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td className="fw-semibold">
                      {u.nombre}{' '}
                      {esMiCuenta && <Badge bg="secondary">Tú</Badge>}
                    </td>
                    <td>{u.email}</td>
                    <td>{u.telefono || '-'}</td>
                    <td>
                      <Badge
                        bg={colorRol(u.rol)}
                        text={u.rol === 'VENDEDOR' ? 'dark' : undefined}
                      >
                        {u.rol}
                      </Badge>
                    </td>
                    <td className="text-center">
                      <div className="btn-group btn-group-sm">
                        <Button variant="outline-primary" onClick={() => handleEditar(u)}>
                          Editar
                        </Button>
                        <Button
                          variant="outline-danger"
                          disabled={esMiCuenta}
                          onClick={() => handleEliminar(u)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
      )}

      <Modal show={mostrarModal} onHide={handleCerrar} backdrop="static" centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title className="h5 fw-bold">
              {modoEdicion ? '✏️ Editar Usuario' : '👤 Registrar Usuario'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre Completo *</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                required
                value={formulario.nombre}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Correo Electrónico *</Form.Label>
              <Form.Control
                type="email"
                name="email"
                required
                value={formulario.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Row className="g-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="tel"
                    name="telefono"
                    value={formulario.telefono}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Rol *</Form.Label>
                  <Form.Select
                    name="rol"
                    value={formulario.rol}
                    onChange={handleChange}
                  >
                    <option value="CLIENTE">CLIENTE</option>
                    <option value="VENDEDOR">VENDEDOR</option>
                    <option value="ADMIN">ADMIN</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-2">
              <Form.Label>
                Contraseña {modoEdicion ? '(dejar vacía para no cambiar)' : '*'}
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                required={!modoEdicion}
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                value={formulario.password}
                onChange={handleChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCerrar} disabled={guardando}>
              Cancelar
            </Button>
            <Button variant="success" type="submit" disabled={guardando}>
              {guardando ? 'Guardando...' : modoEdicion ? 'Guardar Cambios' : 'Crear Usuario'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}

export default AdminUsuariosView