import { useEffect, useState } from 'react'
import SelectBoxOpctions from '@/components/others/SelectBoxOpctions'
import LogoCompleted from '@/icons/LogoCompleted.jsx'
import CloseIcon from '@/icons/window/CloseIcon.jsx'
import { APP, PRICING } from '@/utils/consts.js'
import Pricing from '@/components/others/Pricing.jsx'
import TutorialPopup from '@/components/Popup/tutorial.jsx'

function PopupMode({ mode, data, Set, setmode, info }) {
  if (mode === 'NewSubcription') {
    if (localStorage.getItem('newSubShoweeeeeeee') == 'Showeded' + info[0]) {
      return Set(false)
    }
    localStorage.setItem('newSubShoweeeeeeee', 'Showeded' + info[0])

    info.shift()

    return (
      <div className=" w-[550px] relative  h-[550px] bg-secundary flex justify-center items-center shadow shadow-black/20 rounded-md pt-8 flex-col">
        <button
          className="absolute cursor-pointer hover:fill-[var(--color-green)] top-5 right-5"
          onClick={() => Set(false)}
        >
          <CloseIcon />
        </button>
        <h1 className="font-bold text-2xl mb-3 ">Thank you for your purchase</h1>
        <h2 className="font-medium text-base mb-3">WELCOME TO RARA AUDIO APP PREMIUM</h2>
        <p className="text-xs mt-2">Enjoy Exclusive Audio Configurations</p>
        <div className=" grid grid-cols-2 gap-x-8 scale-75  overflow-y-auto">
          {info.map((item) => (
            <SelectBoxOpctions mode={item.mode} game={item.game} onClick={() => null} key={item.id}>
              {item.name}
            </SelectBoxOpctions>
          ))}
        </div>
        <LogoCompleted className="size-28" />
      </div>
    )
  } else if ('Mensage' === mode) {
    return (
      <div className="min-w-[550px] relative min-h-[550px] bg-secundary flex justify-center items-center shadow shadow-black/20 rounded-md pt-8 flex-col">
        <button
          className="absolute cursor-pointer hover:fill-[var(--color-green)] top-5 right-5"
          onClick={() => Set(false)}
        >
          <CloseIcon />
        </button>
        <h1 className="font-bold text-2xl mb-3 ">Thank you for your purchase</h1>
        <h2 className="font-medium text-base mb-3">WELCOME TO RARA AUDIO APP PREMIUM</h2>
        <p className="text-xs mt-2">Enjoy Exclusive Audio Configurations</p>
      </div>
    )
  } else if ('tutorial' === mode) {
    return <TutorialPopup Set={Set} />
  } else if (mode === 'Error') {
    return (
      <div className="min-w-[550px] relative py-10  bg-secundary flex justify-center items-center shadow shadow-black/20 rounded-md pt-8 flex-col">
        <button
          className="absolute cursor-pointer hover:fill-[var(--color-green)] top-5 right-5"
          onClick={() => Set(false)}
        >
          <CloseIcon />
        </button>
        <h1 className="font-bold text-2xl mb-3 ">Error</h1>
        <p>{info}</p>
      </div>
    )
  } else if (mode === 'Loading') {
    return (
      <div className="min-w-[450px] relative min-h-[150px] bg-secundary flex justify-center items-center shadow shadow-black/20 rounded-md   flex-col">
        <h1 className="font-bold text-2xl mb-3 ">Loading...</h1>
        <p>We are loading our configuration.</p>
        <p>{info}</p>
      </div>
    )
  } else if (mode === 'open-premium-add') {
    return (
      <div className="w-[90%] relative h-[90%] bg-secundary flex flex-col justify-center items-center shadow shadow-black/20 rounded-md  ">
        <button
          className="absolute cursor-pointer hover:fill-[var(--color-green)] top-5 right-5"
          onClick={() => {
            Set(false)
          }}
        >
          <CloseIcon />
        </button>
        <h1 className="mb-20">You need a Subcription</h1>
        <div className="flex justify-center gap-x-5 items-center w-full">
          {PRICING.map((plan) => (
            <Pricing
              duration={plan.duration}
              month={plan.month}
              price={plan.price}
              popularity={plan.popularity}
              percent={plan.percent}
              discount={plan.discount}
              href={`${APP.url}`}
            />
          ))}
        </div>
      </div>
    )
  } else {
    return null
  }
}

export default function Popup({ children }) {
  const [isPopup, setPopup] = useState(false)
  const [isMode, setMode] = useState(null)
  const [isMsg, setMsg] = useState(null)

  useEffect(() => {
    window.api.ipcRenderer.on('Popup', ({ msg, event, mode }) => {
      console.log('[Event] Popup:', event)
      setMode(mode)
      setPopup(event)
      setMsg(msg)
    })
  }, [])

  if (!isPopup) return null
  return (
    <div className=" absolute z-[99999999999] _move rounded-b-lg flex items-center justify-center left-0 top-[25px] w-full h-[calc(100%-25px)] backdrop-blur-sm">
      {PopupMode({ mode: isMode, Set: setPopup, setmode: setMode, info: isMsg })}
    </div>
  )
}
