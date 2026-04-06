import React, { createContext, useState, useEffect } from 'react'

// Crear el contexto
export const AuthContext = createContext()

// Proveedor del contexto
export default function AuthProvider({ children }) {
  const [isAuthToken, setAuthToken] = useState('')

  useEffect(() => {
    const getAuthToken = (token) => {
      return setAuthToken(token)
    }

    window.api.ipcRenderer.on('AuthToken', getAuthToken)

    return () => {
      window.api.ipcRenderer.removeListener('AuthToken', getAuthToken)
    }
  }, [])


  const contextValue = { isAuthToken, setAuthToken }
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
