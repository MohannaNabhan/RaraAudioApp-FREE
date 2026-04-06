import LogoCompleted from '@/icons/LogoCompleted.jsx'
import LoadingIcon from '@/icons/LoadingIcon.jsx'
import { useState, useEffect } from 'react'
import '@/assets/output.css'
import ReactDOM from 'react-dom/client'// Supports weights 100-900
import '@fontsource-variable/montserrat';
import Windowsback from '@/components/window/Windowsback.jsx'
import WindowsTopbar from '@/components/window/WindowsTopbar.jsx'
import WindowContent from '@/components/window/WindowContent.jsx'

function DownloadWindow() {
  const [isPercent, setPercent] = useState(0)
  const [isCounter, setCounter] = useState('')
  const [isText, setText] = useState('Downloading Setups...')

  useEffect(() => {
    const Percent = (event) => {
      setPercent(event)
    }
    const TotalToDownload = (text) => {
      setCounter(text)
    }
    const SetText = (text) => {
      setText(text)
    }

    window.api.ipcRenderer.on('Percent', Percent)
    window.api.ipcRenderer.on('TotalToDownload', TotalToDownload)
    window.api.ipcRenderer.on('DownloadText', SetText)

    return () => {
      window.api.ipcRenderer.removeListener('Percent', Percent)
      window.api.ipcRenderer.removeListener('TotalToDownload', TotalToDownload)
      window.api.ipcRenderer.removeListener('DownloadText', SetText)
    }
  })

  return (
    <Windowsback>
      <WindowsTopbar />
      <WindowContent className="flex  relative justify-between flex-col gap-y-10 content-center items-center">
        <div className="grid grid-cols-2">
          <div className="flex justify-center  pl-14 items-center">
            <h1 className="font-bold text-4xl">{isText}</h1>
          </div>
          <div className=" h-full flex-col items-center flex justify-center  ">
            <LoadingIcon className="animate-spin" />
            <h1 className="-mt-28 mb-32">{isPercent}%</h1>
            <h1 className="-mt-32 mb-32 text-xs">{isCounter}</h1>
            <div className="w-full h-1 bg-secundary rounded overflow-hidden">
              <div
                className="h-1 bg-[var(--text-color-main)]"
                style={{ width: isPercent + '%' }}
              ></div>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center gap-x-5">
          <h1 className="text-xs font-medium bg-secundary px-5 rounded py-4">
            MODIFY YOUR <span className="text-[var(--color-green)]">SETTINGS</span>
            &nbsp;TO&nbsp;YOUR PREFERNCE
          </h1>
          <h1 className="text-xs font-medium bg-secundary px-5 rounded py-4">
            <span className="text-[var(--color-green)]">EXCLUSIVE</span> AUDIO SETTINGS FOR WARZONE
          </h1>
          <h1 className="text-xs font-medium bg-secundary px-5 rounded py-4">
            UPGRADE YOUR <span className="text-[var(--color-green)]">AUDIO</span> EXPERIENCE
          </h1>
        </div>
        <div>
          <div className="w-full grid grid-cols-3 gap-x-8 font-semibold">
            <div className="flex justify-center">
              <LogoCompleted className="!w-36 !h-16" />
            </div>
            <div className="border-l border-[var(--text-color)] pl-5">
              <h3 className="py-6 text-balance pr-5 text-sm">
                RECOMMENDED BY <br /> <span className="text-main text-color-main">TOP&nbsp;</span>
                JUGADORES
              </h3>
            </div>
            <div className="border-l border-[var(--text-color)] pl-5">
              <h3 className="py-6 text-balance text-sm">
                THE BEST APP TO <span className="text-color-main">EQUALIZE&nbsp;</span>
                YOUR CALL OF DUTY AUDIO
              </h3>
            </div>
          </div>
        </div>
      </WindowContent>
    </Windowsback>
  )
}

ReactDOM.createRoot(document.getElementById('rootDownload')).render(<DownloadWindow />)
