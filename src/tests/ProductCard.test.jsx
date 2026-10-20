import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import ProductCard from '../components/ProductCard'

describe('Pruebas unitarias para <ProductCard />', () => {
  const productoMock = {
    id: 1,
    nombre: 'Torta Cuatro Leches',
    precio: 22990,
    categoria: 'Tortas Tradicionales',
    descripcion: 'Bizcocho remojado en cuatro leches',
    imagen: 'https://images.unsplash.com/foto.jpg',
    stock: 8,
  }

  it('debe renderizar correctamente la información del producto', () => {
    render(
      <MemoryRouter>
        <ProductCard producto={productoMock} />
      </MemoryRouter>
    )

    expect(screen.getByText('Torta Cuatro Leches')).toBeInTheDocument()
    expect(screen.getByText('Tortas Tradicionales')).toBeInTheDocument()
    expect(screen.getByText(/Stock: 8/i)).toBeInTheDocument()
    expect(screen.getByText('$22.990')).toBeInTheDocument()
  })

  it('debe ejecutar onAgregarCarrito al hacer clic en el botón "Añadir al Carrito"', async () => {
    const handleAgregarMock = vi.fn()
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <ProductCard producto={productoMock} onAgregarCarrito={handleAgregarMock} />
      </MemoryRouter>
    )

    const boton = screen.getByRole('button', { name: /añadir al carrito/i })
    await user.click(boton)

    expect(handleAgregarMock).toHaveBeenCalledTimes(1)
    expect(handleAgregarMock).toHaveBeenCalledWith(productoMock)
  })
})