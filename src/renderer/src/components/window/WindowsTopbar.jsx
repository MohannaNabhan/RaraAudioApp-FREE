import MinimizeIcon from '@/icons/window/MinimizeIcon.jsx'
import MaximizeIcon from '@/icons/window/MaximizeIcon.jsx'
import CloseIcon from '@/icons/window/CloseIcon.jsx'

export default function windowsTopbar({ Title }) {
  return (
    <div className="w-full flex justify-between px-5 pr-0 h-8 ">
      <div>{Title}</div>
      <div className="flex  items-center">
        <button
          onClick={() => window.api.ipcRenderer.send('WindowState', 'Minimize')}
          className="flex items-center justify-center w-10 h-full  hover:bg-black/10"
        >
          <MinimizeIcon />
        </button>
        <button
          onClick={() => window.api.ipcRenderer.send('WindowState', 'Maximize')}
          className="flex items-center justify-center w-10 h-full stroke-[var(--text-color)]  hover:bg-black/10"
        >
          <MaximizeIcon />
        </button>
        <button
          onClick={() => window.api.ipcRenderer.send('WindowState', 'Close')}
          className="flex items-center justify-center w-12 h-full hover:bg-red-500/20"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  )
}
