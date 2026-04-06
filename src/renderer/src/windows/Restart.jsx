import { APP } from '@/utils/consts.js'
import LogoCompleted from '@/icons/LogoCompleted.jsx'
import ReactDOM from 'react-dom/client'
import WindowBack from '@/components/window/Windowsback.jsx'
import WindowsTopbar from '@/components/window/WindowsTopbar'
import WindowContent from '@/components/window/WindowContent' 
import '@fontsource-variable/montserrat';
import '@/assets/output.css'

ReactDOM.createRoot(document.getElementById('rootRestart')).render(
  <WindowBack>
    <WindowsTopbar />
    
    <WindowContent className="flex justify-center flex-col gap-y-10 content-center items-center">
      <LogoCompleted className="absolute  top-1  !h-20" />

      <h1 className="font-medium text-3xl mb-5 mt-20">RESTART THE COMPUTER</h1>

      <p className="font-medium text-base">TO APPLY ALL CHANGES CORRECTLY.</p>
      <button
        className="btn btn-secundary"
        onClick={() => window.api.ipcRenderer.send('ForceRestart')}
      >
        RESTART Computer
      </button>

      <a
        href={APP.url + '/support'}
        target="_blank"
        className=" text-base mt-20 mb-5 font-medium underline decoration-blue-400"
      >
        CONTACT SUPPORT
      </a>
    </WindowContent>
  </WindowBack>
)
