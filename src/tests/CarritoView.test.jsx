import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import CarritoView from '../views/CarritoView'

describe('Pruebas unitarias para <CarritoView />', () => {
  it('debe mostrar mensaje de carrito vacío si no hay productos agregados', () => {
    render(
      <MemoryRouter>
        <CarritoView carrito={[]} />
      </MemoryRouter>
    )

    expect(screen.getByText(/Tu carrito de compras está vacío/i)).toBeInTheDocument()
    // En React-Bootstrap, un botón con as={Link} tiene role="button"
    expect(screen.getByRole('button', { name: /explorar catálogo/i })).toBeInTheDocument()
  })

  it('debe calcular y mostrar el subtotal y total correcto de los productos', () => {
    const carritoMock = [
      {
        id: 1,
        nombre: 'Torta Cuatro Leches',
        precio: 20000,
        cantidad: 2,
        stock: 5,
        categoria: 'Tortas Tradicionales',
        imagen: 'https://images.unsplash.com/foto.jpg',
      },
      {
        id: 2,
        nombre: 'Pie de Limón',
        precio: 10000,
        cantidad: 1,
        stock: 4,
        categoria: 'Postres',
        imagen: 'https://images.unsplash.com/foto2.jpg',
      },
    ]

    render(
      <MemoryRouter>
        <CarritoView carrito={carritoMock} />
      </MemoryRouter>
    )

    // Verificamos presencia de los ítems
    expect(screen.getByText('Torta Cuatro Leches')).toBeInTheDocument()
    expect(screen.getByText('Pie de Limón')).toBeInTheDocument()

    // Subtotal y Total muestran $50.000, usamos getAllByText para tolerar múltiples coincidencias
    const totales = screen.getAllByText('$50.000')
    expect(totales.length).toBeGreaterThanOrEqual(1)

    expect(screen.getByRole('button', { name: /proceder al pago/i })).toBeInTheDocument()
  })
})