import NotificationBtn from '@/components/others/NotificationBtn.jsx'
import ToggleBtn from '@/components/others/ToggleBtn.jsx'
import MessageIcon from '@/icons/MessageIcon.jsx'
import TimeIcon from '@/icons/TimeIcon.jsx'
import BellIcon from '@/icons/BellIcon.jsx'
import MoonIcon from '@/icons/MoonIcon.jsx'
import SunIcon from '@/icons/SunIcon.jsx'
import LogoCompleted from '@/icons/LogoCompleted.jsx'
import { APP } from '@/utils/consts.js'
import { useState, useContext, useEffect } from 'react'
import { ThemeContext } from '@/context/ThemeContext'
import ExitIcon from '@/icons/ExitIcon.jsx'
import adimg from '@/assets/adimg.png'

export default function SubTapBar() {
  const { isTheme, setTheme } = useContext(ThemeContext)
  const [isActiveBtn, setActiveBtn] = useState(null) // Inicialmente ningún botón activo
  const [newSubShow, setNewSubShow] = useState(false)

  useEffect(() => {
    const handleStorageChange = (status) => {
      setNewSubShow(localStorage.getItem('AdnewSubShow') == 'true')
      if (!status) {
        localStorage.setItem('AdnewSubShow', 'false')

        setNewSubShow(false)
      } else {
        localStorage.setItem('AdnewSubShow', 'true')
        setNewSubShow(true)
      }
    }
    window.api.ipcRenderer.on('Ad', handleStorageChange)

    return () => {
      window.api.ipcRenderer.removeListener('Ad', handleStorageChange)
    }
  }, [])

  return (
    <div className="absolute left-0 top-0 w-full z-50 flex justify-between px-5 items-center">
      <div className="flex gap-x-3">
        <LogoCompleted className="select-none pointer-events-none _move !w-36 !h-16" />
        {newSubShow ? (
          <div
            className="left-44 w-96 h-20 text-sm bg-cover absolute  "
            style={{ backgroundImage: `url(${adimg})` }}
          >
            <div className="w-full h-full flex flex-col justify-center   font-bold items-center bg-white/80">
              <h1 className="text-base font-bold text-black ">
                YOU ARE USING A <span className="text-red-500">FREE </span> VERSION
              </h1>
              <a
                href={APP.url + '/'}
                target="_blank"
                className="btn bg-gradient-to-r from-[#BDF60A] to-[#FFF404] !text-sm !px-5 !py-1 !text-black"
              >
                Buy now
              </a>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex gap-x-3 justify-center items-center">
        <button
          className="btn btn-secundary !text-xs !px-5 !flex justify-center items-center gap-x-2"
          onClick={() => window.api.ipcRenderer.send('logout')}
        >
          <ExitIcon className="size-3" />
          Logout
        </button>
        {/*<NotificationBtn Is={isActiveBtn} target="support" Icon={MessageIcon} Set={setActiveBtn} />

        <NotificationBtn Is={isActiveBtn} Icon={TimeIcon} target="events" Set={setActiveBtn} />

        <NotificationBtn Is={isActiveBtn} Icon={BellIcon} target="alerts" Set={setActiveBtn} />*/}
        <ToggleBtn InactiveIcon={SunIcon} ActiveIcon={MoonIcon} Is={isTheme} Set={setTheme} />
      </div>
    </div>
  )
}
