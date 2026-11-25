import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import NavbarPasteleria from './components/NavbarPasteleria'
import ProtectedRoute from './components/ProtectedRoute'
import TiendaView from './views/TiendaView'
import ProductoDetalleView from './views/ProductoDetalleView'
import CarritoView from './views/CarritoView'
import CheckoutView from './views/CheckoutView'
import AdminProductosView from './views/AdminProductosView'
import OrdenesView from './views/OrdenesView'
import AdminUsuariosView from './views/AdminUsuariosView'
import LoginView from './views/LoginView'
import RegistroView from './views/RegistroView'

function App() {
  const [carrito, setCarrito] = useState(() => {
    try {
      const guardado = localStorage.getItem('carrito')
      return guardado ? JSON.parse(guardado) : []
    } catch {
      return []
    }
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
            ? { ...item, cantidad: Math.min(item.cantidad + 1, producto.stock) }
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
      <NavbarPasteleria totalCarrito={totalItemsCarrito} />

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

          {/* Checkout requiere usuario autenticado (cualquier rol con JWT) */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutView
                  carrito={carrito}
                  onVaciarCarrito={handleVaciarCarrito}
                />
              </ProtectedRoute>
            }
          />

          {/* Productos (ADMIN gestiona CRUD completo; VENDEDOR consulta en modo lectura) */}
          <Route
            path="/admin/productos"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'VENDEDOR']}>
                <AdminProductosView />
              </ProtectedRoute>
            }
          />

          {/* Órdenes / Boletas (ADMIN gestiona estados/elimina; VENDEDOR solo consulta lista y detalle) */}
          <Route
            path="/ordenes"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'VENDEDOR']}>
                <OrdenesView />
              </ProtectedRoute>
            }
          />

          {/* Usuarios y roles: exclusivo ADMIN */}
          <Route
            path="/admin/usuarios"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminUsuariosView />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<LoginView />} />
          <Route path="/registro" element={<RegistroView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="bg-dark text-white text-center py-3 mt-5">
        <small>© 2026 Pastelería Mil Sabores — ro7sopmi</small>
      </footer>
    </div>
  )
}

export default App