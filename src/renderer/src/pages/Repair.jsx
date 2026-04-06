import ArrowLeftIcon from '@/icons/ArrowLeftIcon.jsx'
import { APP } from '@/utils/consts.js'
import LogoCompleted from '@/icons/LogoCompleted.jsx'
export default function Repair({ ROUTER }) {
  return (
    <div className="flex h-full relative justify-center flex-col gap-y-10 content-center items-center">
      <button onClick={() => ROUTER('/')} className=" absolute left-10 top-3">
        <ArrowLeftIcon className="!stroke-[var(--text-color)] !fill-[var(--text-color)]" />
      </button>
      <LogoCompleted className="absolute  top-1  !w-52 !h-24" />

      <h1 className="font-medium text-3xl mb-5 mt-20">REPAIR APP</h1>
      <button
        className="btn btn-secundary"
        onClick={() => window.api.ipcRenderer.send('Reinstall')}
      >
        REINSTALL APLICATION
      </button>

      <a
        href={APP.url + '/support'}
        target="_blank"
        className=" text-base mt-20 mb-5 font-medium underline decoration-blue-400"
      >
        CONTACT SUPPORT
      </a>
    </div>
  )
}
