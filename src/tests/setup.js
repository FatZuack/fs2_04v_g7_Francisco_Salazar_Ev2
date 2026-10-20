import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Limpia el DOM después de cada prueba individual para evitar elementos duplicados
afterEach(() => {
  cleanup()
})