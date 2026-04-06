import React, { createContext, useState, useEffect } from 'react'

export const ThemeContext = createContext()

export default function NotificationProvider({ children }) {
  const [isTheme, setTheme] = useState() // `null` para evitar cambios prematuros.
  const [isInitialized, setInitialized] = useState(false) // Controla la inicialización.

  // Efecto para manejar los cambios en `isTheme` solo después de la inicialización.
  useEffect(() => {
    if (isInitialized) {
      if (isTheme) {
        window.api.ipcRenderer.send('setTheme', 'dark')
        document.body.classList.add('dark')
      } else {
        document.body.classList.remove('dark')
        window.api.ipcRenderer.send('setTheme', 'light')
      }
    }
  }, [isTheme, isInitialized])

  // Efecto para inicializar el tema desde el backend y configurar el escuchador.
  useEffect(() => {
    const handleThemeChange = (event) => {
      if (event === 'light') setTheme(false)
      if (event === 'dark') setTheme(true)
    }

    // Escuchador temporal para recibir el tema inicial.
    const initListener = (initialTheme) => {
      if (initialTheme === 'light') setTheme(false)
      if (initialTheme === 'dark') setTheme(true)
      setInitialized(true) // Marca como inicializado después de recibir el tema.
      window.api.ipcRenderer.removeListener('initTheme', initListener) // Limpia este escuchador.
    }

    // Solicita la configuración inicial al backend.
    window.api.ipcRenderer.send('initTheme')
    window.api.ipcRenderer.on('initTheme', initListener)

    // Configura el escuchador general una vez que se haya inicializado.
    window.api.ipcRenderer.on('Theme', handleThemeChange)

    return () => {
      window.api.ipcRenderer.removeListener('Theme', handleThemeChange)
      window.api.ipcRenderer.removeListener('initTheme', initListener)
    }
  }, [])

  const contextValue = { isTheme, setTheme }
  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}
