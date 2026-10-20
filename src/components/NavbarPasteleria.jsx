import { Container, Nav, Navbar, Badge } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

function NavbarPasteleria({ totalCarrito = 0 }) {
  // Leemos si hay un usuario logueado en sessionStorage
  const usuarioSesion = JSON.parse(sessionStorage.getItem('usuarioSesion') || 'null')

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
            <Nav.Link as={NavLink} to="/admin/productos">
              Administración
            </Nav.Link>
          </Nav>

          <Nav className="ms-auto align-items-center">
            {usuarioSesion ? (
              <span className="navbar-text me-3 text-light">
                Hola, <strong>{usuarioSesion.nombre}</strong> ({usuarioSesion.rol})
              </span>
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