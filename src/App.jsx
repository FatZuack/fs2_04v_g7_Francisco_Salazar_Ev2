import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import NavbarPasteleria from './components/NavbarPasteleria'
import TiendaView from './views/TiendaView'
import ProductoDetalleView from './views/ProductoDetalleView'
import CarritoView from './views/CarritoView'
import CheckoutView from './views/CheckoutView'
import AdminProductosView from './views/AdminProductosView'
import LoginView from './views/LoginView'
import RegistroView from './views/RegistroView'
import { productosIniciales } from './data/productosIniciales'

// Usuarios por defecto para testing y evaluación
const usuariosIniciales = [
  {
    id: 1,
    nombre: 'Administrador Demo',
    email: 'admin@milsabores.cl',
    password: 'admin123',
    rol: 'Administrador',
  },
  {
    id: 2,
    nombre: 'Cliente Frecuente',
    email: 'cliente@milsabores.cl',
    password: '123456',
    rol: 'Cliente',
  },
]

function App() {
  // 1. Inicializar catálogo en localStorage
  useEffect(() => {
    const productosGuardados = localStorage.getItem('productos')
    if (!productosGuardados) {
      localStorage.setItem('productos', JSON.stringify(productosIniciales))
    }

    // 2. Inicializar usuarios de prueba en localStorage
    const usuariosGuardados = localStorage.getItem('usuarios')
    if (!usuariosGuardados) {
      localStorage.setItem('usuarios', JSON.stringify(usuariosIniciales))
    }
  }, [])

  // 3. Manejo de sesión de usuario en sessionStorage
  const [usuarioSesion, setUsuarioSesion] = useState(() => {
    const sesion = sessionStorage.getItem('usuarioSesion')
    return sesion ? JSON.parse(sesion) : null
  })

  const handleLogin = (usuario) => {
    sessionStorage.setItem('usuarioSesion', JSON.stringify(usuario))
    setUsuarioSesion(usuario)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('usuarioSesion')
    setUsuarioSesion(null)
  }

  // 4. Estado del Carrito en localStorage
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem('carrito')
    return guardado ? JSON.parse(guardado) : []
  })

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito))
  }, [carrito])

  const handleAgregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id)
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: Math.min(item.cantidad + 1, item.stock) }
            : item
        )
      }
      return [...prev, { ...producto, cantidad: 1 }]
    })
  }

  const handleModificarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      handleEliminarDelCarrito(id)
      return
    }
    setCarrito((prev) =>
      prev.map((item) => (item.id === id ? { ...item, cantidad: nuevaCantidad } : item))
    )
  }

  const handleEliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id))
  }

  const handleVaciarCarrito = () => {
    setCarrito([])
  }

  const totalItemsCarrito = carrito.reduce((acc, item) => acc + item.cantidad, 0)

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <NavbarPasteleria
        totalCarrito={totalItemsCarrito}
        usuarioSesion={usuarioSesion}
        onLogout={handleLogout}
      />

      <main className="flex-grow-1">
        <Routes>
          <Route
            path="/"
            element={<TiendaView onAgregarCarrito={handleAgregarAlCarrito} />}
          />
          <Route
            path="/producto/:id"
            element={<ProductoDetalleView onAgregarCarrito={handleAgregarAlCarrito} />}
          />
          <Route
            path="/carrito"
            element={
              <CarritoView
                carrito={carrito}
                onModificarCantidad={handleModificarCantidad}
                onEliminar={handleEliminarDelCarrito}
                onVaciar={handleVaciarCarrito}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <CheckoutView
                carrito={carrito}
                onVaciarCarrito={handleVaciarCarrito}
              />
            }
          />
          {/* Ruta protegida: solo administradores tienen acceso a la gestión */}
          <Route
            path="/admin/productos"
            element={
              usuarioSesion?.rol === 'Administrador' ? (
                <AdminProductosView />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/login"
            element={<LoginView onLogin={handleLogin} />}
          />
          <Route
            path="/registro"
            element={<RegistroView onLogin={handleLogin} />}
          />
        </Routes>
      </main>

      <footer className="bg-dark text-white text-center py-3 mt-5">
        <small>© 2026 Pastelería Mil Sabores — Proyecto DSY1104 Evaluación Parcial 2</small>
      </footer>
    </div>
  )
}

export default App