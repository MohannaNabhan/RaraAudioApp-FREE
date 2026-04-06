import SelectBox from '@/components/others/SelectBox.jsx'
import { useState, useEffect } from 'react'
import SubTapBar from '@/components/others/WindowSubTapBar.jsx'
import Examples from '@/components/others/Examples.jsx'
import Buttoncooldown from '@/components/others/Buttoncooldown.jsx'
import ListRestartIcon from '@/icons/ui/ListRestartIcon' 

export default function Home({ ROUTER }) {
  const [isDeviceSelected, setDeviceSelected] = useState('Loading...')
  const [isDeviceSelectedPRE, setDeviceSelectedPRE] = useState('Loading...')

  const [isConfigSelected, setConfigSelected] = useState('Loading...')

  const [isDeviceData, setDeviceData] = useState([])
  const [isConfigData, setConfigData] = useState([])

  const [isShowDevice, setShowDevice] = useState(true)

  useEffect(() => {
    const getConfigs = (configs) => {
      if (configs == undefined) return

      setConfigData(configs)
      setConfigSelected('Select Your Configuration')
    }
    window.api.ipcRenderer.send('getConfigsData')
    window.api.ipcRenderer.on('getConfigsData', getConfigs)

    const SetConfigSelecteded = (config) => {
      if (config == undefined) return
      setConfigSelected(config)
    }
    window.api.ipcRenderer.on('setConfiguration', SetConfigSelecteded)

    return () => {
      window.api.ipcRenderer.removeListener('getConfigsData', getConfigs)
    }
  }, [])

  useEffect(() => {
    if (isConfigSelected == 'Select Your Configuration') return
    if (isConfigSelected == undefined) return
    if (isConfigSelected == 'Loading...') return

    window.api.ipcRenderer.send('setConfiguration', isConfigSelected)
  }, [isConfigSelected])

  let max_interval = 3
  useEffect(() => {
    const GetDevices = (event) => {
      setDeviceData(event)
      setDeviceSelected(isDeviceSelectedPRE)
    }

    window.api.ipcRenderer.on('getDevices', GetDevices)
    window.api.ipcRenderer.send('AudioSetup', 'Home')

    let a = setInterval(() => {
      max_interval--
      if (max_interval == 0) {
        clearInterval(a)
        return
      }
      window.api.ipcRenderer.send('getDevices')
    }, 10000)
    window.api.ipcRenderer.send('getDevices')

    return () => {
      clearInterval(a)
      window.api.ipcRenderer.removeListener('getDevices', GetDevices)
    }
  }, [isDeviceSelectedPRE])

  const [InitDevicee, setDevicee] = useState('')
  useEffect(() => {
    if (isDeviceSelectedPRE == InitDevicee) return
    setDeviceSelectedPRE(InitDevicee)
  }, [InitDevicee])

  useEffect(() => {
    const SelectedDevice = (data) => {
      if (data == undefined) return
      setDevicee(data)
    }
    if (InitDevicee != '') return

    setDeviceSelectedPRE('Select Your Audio Device')
    window.api.ipcRenderer.send('initDevice')
    window.api.ipcRenderer.on('initDevice', SelectedDevice)

    return () => {
      window.api.ipcRenderer.removeListener('initDevice', SelectedDevice)
    }
  }, [isDeviceData])

  useEffect(() => {
    if (isDeviceSelected == 'Select Your Audio Device') return
    if (isDeviceSelected == undefined) return
    if (isDeviceSelected == 'Loading...') return

    window.api.ipcRenderer.send('setDevice', isDeviceSelected)
  }, [isDeviceSelected])

  useEffect(() => {
    const getVoicemeeter = (event) => {
      if (event == undefined) return
      if (event == 'Disabled') {
        setShowDevice(false)
      } else {
        setShowDevice(true)
      }
    }
    window.api.ipcRenderer.send('getVoicemeeter')
    window.api.ipcRenderer.on('getVoicemeeter', getVoicemeeter)

    return () => {
      window.api.ipcRenderer.removeListener('getVoicemeeter', getVoicemeeter)
    }
  }, [])

  const RestartAudio = () => {
    window.api.ipcRenderer.send('RestartAudio')
  }

  const TestAudio = () => {
    window.api.ipcRenderer.send('TestAudio')
  }

  const RestartVoicemeeter = () => {
    window.api.ipcRenderer.send('RestartVoicemeeter')
  }
  const RefreshListAudio = () => {
    window.api.ipcRenderer.send('getDevices')
  }
  const RefreshConfig = () => {
    window.api.ipcRenderer.send('getConfigsData')
  }

  return (
    <>
      <SubTapBar />
      <div className="flex flex-col justify-between h-full w-full">
        <div></div>
        <div className="flex justify-center gap-x-40">
          {isShowDevice ? (
            <div className="flex flex-col items-start">
              <div className="flex mb-4  gap-x-2 items-center ">
                <h1 className="text-2xl font-medium">AUDIO DEVICE</h1>
                <Buttoncooldown
                  text="Refresh&nbsp;Devices..."
                  delay={4000}
                  onClick={RefreshListAudio}
                  className="!px-2"
                >
                  <ListRestartIcon className="size-5" />
                </Buttoncooldown>
              </div>
              <SelectBox
                Is={isDeviceSelected}
                Set={setDeviceSelected}
                List={isDeviceData}
                className="!w-[343px] mb-3"
              />
              <Buttoncooldown delay={4000} onClick={TestAudio} className="btn !px-5">
                Test Audio
              </Buttoncooldown>
            </div>
          ) : null}

          <div className="w-[343px]">
            <div className="flex mb-4  gap-x-2 items-center ">
              <h1 className="  text-2xl font-medium">CONFIGURATION</h1>
              <Buttoncooldown
                text="Refresh&nbsp;Configs..."
                delay={4000}
                onClick={RefreshConfig}
                className="!px-2 group"
              >
                <ListRestartIcon className="size-5" />
              </Buttoncooldown>
            </div>
            <SelectBox
              Is={isConfigSelected}
              Set={setConfigSelected}
              List={isConfigData}
              className="!w-[343px]"
            />
            {/* <AudioRealism />*/}
            {isShowDevice ? null : (
              <p className="text-[var(--color-red)] mt-8 text-center">
                If you have another custom audio output such as Steelseries, or some other mixer,
                you must select "RARA AUDIO APP" CABLE
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 justify-between">
          <div className="flex flex-col items-start justify-end gap-y-3">
            <p className="text-[var(--color-red)] mt-8 text-xs text-center">
              {' '}
              If you have any problem, try Restart:
            </p>{' '}
            <Buttoncooldown
              delay={9000}
              onClick={() => RestartAudio()}
              className="btn w-auto !text-sm"
            >
              Restart Window Audio
            </Buttoncooldown>
            <Buttoncooldown
              delay={9000}
              onClick={() => RestartVoicemeeter()}
              className="btn w-auto !text-sm"
            >
              Restart Voicemeeter
            </Buttoncooldown>
            <Buttoncooldown
              delay={9000}
              onClick={() => window.api.ipcRenderer.send('RestartApp')}
              className="btn w-auto !text-sm"
            >
              Restart App
            </Buttoncooldown>
          </div>

          <div className="flex flex-col items-center justify-end">
            <Examples />
          </div>

          <div className="flex  flex-col-reverse items-end gap-y-3">
            <button onClick={() => ROUTER('/Voicemeeter')} className="btn w-auto">
              Change Voicemeeter
            </button>
            <button
              onClick={() =>
                window.api.ipcRenderer.send('Popup', { mode: 'tutorial', event: true })
              }
              className="btn w-auto"
            >
              Start Tutorial
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
