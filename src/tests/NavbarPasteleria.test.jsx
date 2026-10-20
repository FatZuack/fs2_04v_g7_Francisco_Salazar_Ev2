import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import NavbarPasteleria from '../components/NavbarPasteleria'

describe('Pruebas unitarias para <NavbarPasteleria />', () => {
  it('muestra enlaces de Login y Registro cuando no hay sesión iniciada', () => {
    render(
      <MemoryRouter>
        <NavbarPasteleria totalCarrito={0} usuarioSesion={null} />
      </MemoryRouter>
    )

    expect(screen.getByText(/Pastelería Mil Sabores/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /iniciar sesión/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /registrarse/i })).toBeInTheDocument()
    // No debe mostrar el acceso a administración
    expect(screen.queryByText(/Administración/i)).not.toBeInTheDocument()
  })

  it('muestra el badge con la cantidad correcta de ítems en el carrito', () => {
    render(
      <MemoryRouter>
        <NavbarPasteleria totalCarrito={5} usuarioSesion={null} />
      </MemoryRouter>
    )

    const badge = screen.getByText('5')
    expect(badge).toBeInTheDocument()
  })

  it('muestra el enlace a Administración y los datos de usuario cuando el rol es Administrador', () => {
    const adminMock = {
      nombre: 'Francisco Admin',
      rol: 'Administrador',
    }

    render(
      <MemoryRouter>
        <NavbarPasteleria totalCarrito={0} usuarioSesion={adminMock} />
      </MemoryRouter>
    )

    expect(screen.getByText('Francisco Admin')).toBeInTheDocument()
    expect(screen.getByText('Administrador')).toBeInTheDocument()
    expect(screen.getByText(/Administración/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cerrar sesión/i })).toBeInTheDocument()
  })
})