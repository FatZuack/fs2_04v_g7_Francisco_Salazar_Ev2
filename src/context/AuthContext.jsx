import { createContext, useContext, useEffect, useState } from 'react'
import {
  AUTH_EVENT,
  getAuthSession,
  clearAuthSession,
} from '../utils/authSession'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(getAuthSession)

  useEffect(() => {
    const updateSession = () => setSession(getAuthSession())
    window.addEventListener(AUTH_EVENT, updateSession)
    return () => window.removeEventListener(AUTH_EVENT, updateSession)
  }, [])

  useEffect(() => {
    if (!session) return
    const timeout = window.setTimeout(
      clearAuthSession,
      Math.max(0, session.expiresAt - Date.now())
    )
    return () => window.clearTimeout(timeout)
  }, [session])

  const usuario = session?.usuario || null
  const rol = usuario?.rol || null

  return (
    <AuthContext.Provider
      value={{ session, usuario, rol, logout: clearAuthSession }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}