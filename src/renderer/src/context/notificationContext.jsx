import React, { createContext, useState, useEffect } from 'react'

// Crear el contexto
export const NotificationContext = createContext()

// Proveedor del contexto
export default function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  const AddNotifications = (data) => {
    setNotifications((prevNotifications) => {
      const updatedNotifications = [data, ...prevNotifications]
      return updatedNotifications.slice(0, 5)
    })
  }
  useEffect(() => {
    window.api.ipcRenderer.on('AddNotification', AddNotifications)
  }, [])

  const contextValue = { AddNotifications, notifications, setNotifications }
  return (
    <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>
  )
}
