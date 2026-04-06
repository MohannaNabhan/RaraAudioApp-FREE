import { useState, useEffect } from 'react'
import NotificationProvider from '@/context/notificationContext.jsx'
import Notifications from '@/components/others/Notification.jsx'
import Popup from '@/components/others/Popup.jsx'

export default function Windowsback({ children }) {
  const [isMaximize, setMaximize] = useState(true)

  useEffect(() => {
    window.api.ipcRenderer.on('WindowState', (event) => {
      console.log('[Event] WindowState:', event)
      if (event == 'Maximize') setMaximize(false)
      if (event == 'UnMaximize') setMaximize(true)
    })
  }, [])

  return (
    <NotificationProvider>
      <main
        id="window-back"
        className={` w-full h-full ${isMaximize ? 'rounded-lg' : 'rounded-none'}`}
      >
        <Notifications />
        <Popup />
        {children}
      </main>
    </NotificationProvider>
  )
}
