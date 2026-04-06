import { useEffect, useState, useRef } from 'react'
import NotificationBtnSubMenu from '@/components/others/NotificationBtnSubMenu.jsx'

export default function NotificationBtn({ Is, children, Set, target, Icon }) {
  const [isShowMenu, setShowMenu] = useState(false)
  const [isNotifications, setNotifications] = useState(0)
  const [isMsg, setMsg] = useState([])

  // Crear una referencia para el contenedor principal
  // Manejar la apertura y cierre del menú basado en la propiedad 'Is'
  useEffect(() => {
    if (Is === target) {
      setNotifications(0)
      setShowMenu(true)
    } else {
      setShowMenu(false)
    }
  }, [Is, target])

  // Escuchar las notificaciones del renderer
  useEffect(() => {
    const handleNotifications = ({ event, nums, data }) => {
      if (event === target) {
        setNotifications(nums)
        setShowMenu(false)
        setMsg(data)
        Set(null)
      }
    }

    window.api.ipcRenderer.on('Notifications', handleNotifications)

    return () => {
      window.api.ipcRenderer.removeListener('Notifications', handleNotifications)
    }
  }, [target])

  // Manejar el clic en el botón
  const handleClick = (btn) => {
    Set((prev) => (prev === btn ? null : btn)) // Toggle activo/inactivo
  }

  return (
    <div className="relative">
      <div className="flex justify-center items-center">
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleClick(target)
          }}
          className={`size-9 ${isNotifications ? 'border border-[var(--color-green)]' : ''} relative flex justify-center items-center bg-secundary rounded-full ${Is ? 'active-class' : ''}`}
        >
          <Icon className="size-5" />
        </button>
        {isShowMenu && (
          <div className="w-auto bg-secundary min-w-10 absolute top-14 right-0 p-2 ">
            <div className="bg-secundary size-5 clip-triangle absolute right-2 -top-4"></div>
            <NotificationBtnSubMenu mode={target} msg={isMsg} Set={setShowMenu} Sett={Set} />
          </div>
        )}
      </div>
    </div>
  )
}
