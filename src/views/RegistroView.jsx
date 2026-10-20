import { useState } from 'react'
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'

function RegistroView({ onLogin }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
    const yaExiste = usuarios.some(
      (u) => u.email.toLowerCase() === formData.email.trim().toLowerCase()
    )

    if (yaExiste) {
      setError('Ya existe una cuenta registrada con este correo electrónico.')
      return
    }

    // Crear el nuevo usuario con rol 'Cliente'
    const nuevoUsuario = {
      id: Date.now(),
      nombre: formData.nombre,
      email: formData.email.trim().toLowerCase(),
      telefono: formData.telefono,
      password: formData.password,
      rol: 'Cliente',
      fechaRegistro: new Date().toLocaleDateString('es-CL'),
    }

    localStorage.setItem('usuarios', JSON.stringify([...usuarios, nuevoUsuario]))

    // Iniciar sesión automáticamente y redirigir al catálogo
    onLogin(nuevoUsuario)
    navigate('/')
  }

  return (
    <Container className="py-5" style={{ maxWidth: '540px' }}>
      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <span className="fs-1">📝</span>
            <h1 className="h4 fw-bold mt-2">Crear Cuenta</h1>
            <p className="text-muted small">Únete a la comunidad de Mil Sabores</p>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre Completo</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                required
                placeholder="Ej: Francisco Salazar"
                value={formData.nombre}
                onChange={handleChange}
              />
            </Form.Group>

            <Row>
              <Col md={7}>
                <Form.Group className="mb-3">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    required
                    placeholder="nombre@ejemplo.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={5}>
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="tel"
                    name="telefono"
                    placeholder="+569..."
                    value={formData.telefono}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                required
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Confirmar Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                required
                placeholder="Repite la contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="d-grid mb-3">
              <Button variant="success" type="submit" size="lg">
                Registrarse
              </Button>
            </div>
          </Form>

          <div className="text-center mt-3 pt-3 border-top">
            <small className="text-muted">
              ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
            </small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default RegistroView