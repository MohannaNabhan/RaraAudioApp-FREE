import ReactDOM from 'react-dom/client'
import WindowBack from '@/components/window/Windowsback'
import WindowTop from '@/components/window/WindowsTopbar'
import FailedIcon from '@/icons/FailedIcon.jsx'
import LogoCompleted from '@/icons/LogoCompleted'
import { APP } from '@/utils/consts.js'
import '@/assets/output.css' 
import '@fontsource-variable/montserrat';

ReactDOM.createRoot(document.getElementById('rootLostConnection')).render(
  <WindowBack>
    <WindowTop />
    <div className="flex h-[calc(100vh-32px)] relative justify-center flex-col gap-y-10 content-center items-center">
      <LogoCompleted className="absolute  top-1  !h-20" />
      <FailedIcon className=" size-20" />
      <h1 className="font-medium text-3xl ">Failed Connections</h1>
      <p className="font-medium text-xl">RECONNECT YOUR INTERNET CONNECTION</p>

      <a
        href={APP.url + '/support'}
        target="_blank"
        className=" text-base mt-20 mb-5 font-medium underline decoration-[var(--color-green)]"
      >
        CONTACT SUPPORT
      </a>
    </div>
  </WindowBack>
)
