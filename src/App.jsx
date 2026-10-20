import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import NavbarPasteleria from './components/NavbarPasteleria'
import TiendaView from './views/TiendaView'
import ProductoDetalleView from './views/ProductoDetalleView'
import CarritoView from './views/CarritoView'
import CheckoutView from './views/CheckoutView'
import AdminProductosView from './views/AdminProductosView'
import { productosIniciales } from './data/productosIniciales'

function App() {
  // 1. Inicializar catálogo en localStorage si no existe
  useEffect(() => {
    const productosGuardados = localStorage.getItem('productos')
    if (!productosGuardados) {
      localStorage.setItem('productos', JSON.stringify(productosIniciales))
    }
  }, [])

  // 2. Estado persistente del carrito
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem('carrito')
    return guardado ? JSON.parse(guardado) : []
  })

  // Sincronizar cambios del carrito con localStorage
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito))
  }, [carrito])

  // Funciones controladoras del carrito
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

  // Contador total para el badge del Navbar
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
          <Route
            path="/checkout"
            element={
              <CheckoutView
                carrito={carrito}
                onVaciarCarrito={handleVaciarCarrito}
              />
            }
          />
          <Route
            path="/admin/productos"
            element={<AdminProductosView />}
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