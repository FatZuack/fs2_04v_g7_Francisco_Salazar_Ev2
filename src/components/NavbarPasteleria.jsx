import { Container, Nav, Navbar, Badge, Button } from 'react-bootstrap'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function NavbarPasteleria({ totalCarrito = 0, usuarioSesion, onLogout }) {
  const navigate = useNavigate()
  const auth = useAuth()

  // Usa AuthContext en la app real y mantiene props como respaldo para tests unitarios
  const usuario = auth ? auth.usuario : usuarioSesion
  const cerrarSesion = auth ? auth.logout : onLogout

  const handleCerrarSesion = () => {
    if (cerrarSesion) cerrarSesion()
    navigate('/')
  }

  const esAdmin = usuario?.rol === 'ADMIN' || usuario?.rol === 'Administrador'
  const esVendedor = usuario?.rol === 'VENDEDOR'

  const colorRol = esAdmin ? 'danger' : esVendedor ? 'warning' : 'primary'
  const textoRol = esVendedor ? 'dark' : undefined

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

            {/* ADMIN y VENDEDOR ven Productos (Vendedor en modo solo lectura) y Órdenes */}
            {(esAdmin || esVendedor) && (
              <>
                <Nav.Link as={NavLink} to="/admin/productos" className="text-info fw-semibold">
                  {esAdmin ? '⚙️ Administración' : '📋 Productos'}
                </Nav.Link>
                <Nav.Link as={NavLink} to="/ordenes" className="text-info fw-semibold">
                  📦 Órdenes
                </Nav.Link>
              </>
            )}

            {/* Gestión de usuarios: exclusiva de ADMIN (oculta para VENDEDOR y CLIENTE) */}
            {esAdmin && (
              <Nav.Link as={NavLink} to="/admin/usuarios" className="text-info fw-semibold">
                👥 Usuarios
              </Nav.Link>
            )}
          </Nav>

          <Nav className="ms-auto align-items-center gap-2">
            {usuario ? (
              <>
                <div className="text-light me-2 small">
                  Hola, <strong>{usuario.nombre}</strong>{' '}
                  <Badge bg={colorRol} text={textoRol} className="ms-1">
                    {usuario.rol}
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