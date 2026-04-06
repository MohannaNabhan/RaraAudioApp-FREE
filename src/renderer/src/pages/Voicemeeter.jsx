import ArrowLeftIcon from '@/icons/ArrowLeftIcon.jsx'

import SelectBox from '@/components/others/SelectBox'
import { APP } from '@/utils/consts.js'
import { TYPEVOICEMEETER } from '@/utils/consts.js'
import LogoCompleted from '@/icons/LogoCompleted.jsx'
import { useState, useEffect } from 'react'

export default function Voicemeeter({ ROUTER }) {
  const [isVoicemeeterSeleted, setVoicemeeterSeleted] = useState('Select You Mixer')
  const [isIntalled, setIntalled] = useState(false)
  const [isEvent, setEvent] = useState(null)

  useEffect(() => {
    const getVoicemeeter = (event) => {
      if (event == undefined) return
      setVoicemeeterSeleted(event)
    }
    window.api.ipcRenderer.send('getVoicemeeter')
    window.api.ipcRenderer.on('getVoicemeeter', getVoicemeeter)

    return () => {
      window.api.ipcRenderer.removeListener('getVoicemeeter', getVoicemeeter)
    }
  }, [])

  useEffect(() => {
    window.api.ipcRenderer.send('IsInstalledVoicemeeter', isVoicemeeterSeleted)

    const setIntalledd = ({ status, draw }) => {
      setIntalled(status)
      setEvent(draw)
    }
    window.api.ipcRenderer.on('IsInstalledVoicemeeter', setIntalledd)

    return () => {
      window.api.ipcRenderer.removeListener('IsInstalledVoicemeeter', setIntalledd)
    }
  }, [isVoicemeeterSeleted])

  function RequestInstalaction() {
    if (isEvent == 'Installer') {
      return (
        <div className="flex flex-col gap-y-2 justify-center items-center">
          <h1>Request Instalaction</h1>
          <p>THIS VERSION OF VOICEMEETER IS NOT INSTALLED</p>
          <button
            className="btn !px-10"
            onClick={() => window.api.ipcRenderer.send('otherVoicemeeter', isVoicemeeterSeleted)}
          >
            Install Now
          </button>
        </div>
      )
    } else if (isEvent == 'Disabled') {
      return (
        <div>
          <p className="text-[var(--color-red)]  max-w-2xl text-center">
            If you have another custom audio output such as Steelseries, or some other mixer, you
            must select "RARA AUDIO APP" CABLE
          </p>
        </div>
      )
    }
  }

  return (
    <div className="flex h-full justify-center flex-col gap-y-10 content-center items-center">
          <LogoCompleted className="absolute  top-1  !w-52 !h-24" />
      <button onClick={() => ROUTER('/')} className=" absolute left-10 top-3">
        <ArrowLeftIcon className="!stroke-[var(--text-color)] !fill-[var(--text-color)]" />
      </button>

      <h1 className="font-medium  text-3xl">SELECT YOU FAVORITE VIRTUAL AUDIO MIX</h1>
      <SelectBox
        className="!w-[343px]"
        List={TYPEVOICEMEETER}
        Set={setVoicemeeterSeleted}
        Is={isVoicemeeterSeleted}
      />
      {}
      {isIntalled ? null : RequestInstalaction()}

      <a
        href={APP.url + '/support'}
        target="_blank"
        className=" text-base font-medium underline decoration-blue-500"
      >
        CONTACT SUPPORT
      </a>
    </div>
  )
}
