import { useState } from 'react'
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'

function LoginView({ onLogin }) {
  const navigate = useNavigate()
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    // 1. Obtener lista de usuarios registrados en localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')

    // 2. Buscar coincidencia de credenciales
    const usuarioValido = usuarios.find(
      (u) => u.email.toLowerCase() === correo.trim().toLowerCase() && u.password === password
    )

    if (usuarioValido) {
      onLogin(usuarioValido)
      // Si es admin lo llevamos directo al panel, si es cliente a la tienda
      if (usuarioValido.rol === 'Administrador') {
        navigate('/admin/productos')
      } else {
        navigate('/')
      }
    } else {
      setError('Credenciales incorrectas. Revisa el correo o la contraseña.')
    }
  }

  return (
    <Container className="py-5" style={{ maxWidth: '480px' }}>
      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <span className="fs-1">🔐</span>
            <h1 className="h4 fw-bold mt-2">Iniciar Sesión</h1>
            <p className="text-muted small">Pastelería Mil Sabores</p>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                required
                placeholder="nombre@ejemplo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <div className="d-grid mb-3">
              <Button variant="primary" type="submit" size="lg">
                Ingresar
              </Button>
            </div>
          </Form>

          <div className="text-center mt-3 pt-3 border-top">
            <small className="text-muted">
              ¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link>
            </small>
          </div>

          {/* Tarjeta de credenciales demo para la evaluación */}
          <div className="bg-light p-3 rounded mt-4 border">
            <small className="d-block fw-bold text-dark mb-1">🔑 Cuentas demo para pruebas:</small>
            <div className="small text-muted">
              • <strong>Admin:</strong> admin@milsabores.cl | <strong>Clave:</strong> admin123<br />
              • <strong>Cliente:</strong> cliente@milsabores.cl | <strong>Clave:</strong> 123456
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default LoginView