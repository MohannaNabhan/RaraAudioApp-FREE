//import NotificationBtn from '@/components/others/NotificationBtn.jsx'
//import ToggleBtn from '@/components/others/ToggleBtn.jsx'
//import MessageIcon from '@/icons/MessageIcon.jsx'
//import TimeIcon from '@/icons/TimeIcon.jsx'
//import BellIcon from '@/icons/BellIcon.jsx'
//import MoonIcon from '@/icons/MoonIcon.jsx'
//import SunIcon from '@/icons/SunIcon.jsx'
import LogoCompleted from '@/icons/LogoCompleted.jsx'
//import { APP } from '@/utils/consts.js'
import { useState, useContext, useEffect } from 'react'
//import { ThemeContext } from '@/context/ThemeContext'
import ExitIcon from '@/icons/ExitIcon.jsx'
//import adimg from '@/assets/adimg.png'
import DiscordIcon from '@/icons/social/DiscordIcon'
import YoutubeIcon from '@/icons/social/YoutubeIcon.jsx'
import XIcon from '@/icons/social/XIcon.jsx'

export default function SubTapBar() {
  //const { isTheme, setTheme } = useContext(ThemeContext)
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
      <div className="flex gap-x-3 items-center">
        <LogoCompleted className="select-none pointer-events-none _move !w-40 !h-16 fill-white" />
        <a href="https://discord.gg/UfSjPKkFqu" target="_blank">
          <DiscordIcon className={'fill-white  size-8 transition-all hover:scale-110  '} />
        </a>
        <a href="https://www.youtube.com/raratoman" target="_blank">
          <YoutubeIcon className={'fill-white  size-7 transition-all hover:scale-110'} />
        </a>
        <a href="https://x.com/raratoman" target="_blank">
          <XIcon className={'fill-white  size-6 transition-all hover:scale-110'} />
        </a>
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

        <NotificationBtn Is={isActiveBtn} Icon={BellIcon} target="alerts" Set={setActiveBtn} />
        <ToggleBtn InactiveIcon={SunIcon} ActiveIcon={MoonIcon} Is={isTheme} Set={setTheme} />*/}
      </div>
    </div>
  )
}
