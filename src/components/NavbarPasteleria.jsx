import { Container, Nav, Navbar, Badge, Button } from 'react-bootstrap'
import { NavLink, useNavigate } from 'react-router-dom'

function NavbarPasteleria({ totalCarrito = 0, usuarioSesion, onLogout }) {
  const navigate = useNavigate()

  const handleCerrarSesion = () => {
    onLogout()
    navigate('/')
  }

  const esAdmin = usuarioSesion?.rol === 'Administrador'

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="fw-bold text-warning">
          🍰 Pastelería Mil Sabores
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="menu-navegacion" />

        <Navbar.Collapse id="menu-navegacion">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/">
              Catálogo
            </Nav.Link>
            <Nav.Link as={NavLink} to="/carrito">
              Carrito{' '}
              {totalCarrito > 0 && (
                <Badge bg="warning" text="dark" pill>
                  {totalCarrito}
                </Badge>
              )}
            </Nav.Link>
            {/* Solo se habilita la opción de administración si el usuario es Administrador */}
            {esAdmin && (
              <Nav.Link as={NavLink} to="/admin/productos" className="text-info fw-semibold">
                ⚙️ Administración
              </Nav.Link>
            )}
          </Nav>

          <Nav className="ms-auto align-items-center gap-2">
            {usuarioSesion ? (
              <>
                <div className="text-light me-2 small">
                  Hola, <strong>{usuarioSesion.nombre}</strong>{' '}
                  <Badge bg={esAdmin ? 'danger' : 'primary'} className="ms-1">
                    {usuarioSesion.rol}
                  </Badge>
                </div>
                <Button variant="outline-light" size="sm" onClick={handleCerrarSesion}>
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login">
                  Iniciar Sesión
                </Nav.Link>
                <Nav.Link as={NavLink} to="/registro">
                  Registrarse
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavbarPasteleria