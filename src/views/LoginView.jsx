import { useState } from 'react'
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { saveAuthSession } from '../utils/authSession'
import { getErrorMessage } from '../utils/getErrorMessage'

function LoginView() {
  const navigate = useNavigate()
  const location = useLocation()
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)

    try {
      const data = await authService.login(correo.trim(), password)
      saveAuthSession(data)

      // Si venía redirigido de una ruta protegida (ej. /checkout), lo devolvemos allá
      const destinoPrevio = location.state?.from
      if (destinoPrevio) {
        navigate(destinoPrevio, { replace: true })
        return
      }

      if (data.usuario.rol === 'ADMIN') {
        navigate('/admin/productos', { replace: true })
      } else if (data.usuario.rol === 'VENDEDOR') {
        navigate('/ordenes', { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setCargando(false)
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
              <Button variant="primary" type="submit" size="lg" disabled={cargando}>
                {cargando ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Ingresando...
                  </>
                ) : (
                  'Ingresar'
                )}
              </Button>
            </div>
          </Form>

          <div className="text-center mt-3 pt-3 border-top">
            <small className="text-muted">
              ¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link>
            </small>
          </div>

          {/* Tarjeta con los 3 roles demo para evaluación */}
          <div className="bg-light p-3 rounded mt-4 border">
            <small className="d-block fw-bold text-dark mb-1">🔑 Cuentas demo para pruebas:</small>
            <div className="small text-muted">
              • <strong>Admin:</strong> admin@milsabores.cl | <strong>Clave:</strong> admin123<br />
              • <strong>Vendedor:</strong> vendedor@milsabores.cl | <strong>Clave:</strong> vendedor123<br />
              • <strong>Cliente:</strong> cliente@milsabores.cl | <strong>Clave:</strong> 123456
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default LoginView