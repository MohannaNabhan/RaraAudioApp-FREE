import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Lista de canales válidos
const validChannels = [
  'WindowState',
  'Notifications',
  'Ad',
  'getDevices',
  'setDevice',
  'ROOTER',
  'logout',
  'Popup',
  'login',
  'ForceRestart',
  'AudioSetup',
  'getPort',
  'OpenVoicemeeter',
  'RestartAudio',
  'TestAudio',
  'SetGripOWN',
  'setDevices',
  'getVoicemeeter',
  'Examples',
  'setExamples',
  'setVoicemeeter',
  'IsInstalledVoicemeeter',
  'TotalToDownload',
  'Percent',
  'otherVoicemeeter',
  'getConfigVoicemeeter',
  'Reinstall',
  'DownloadText',
  'getConfigsData',
  'RestartVoicemeeter',
  'setConfiguration',
  'getDeviceMain',
  'AuthToken',
  'AddNotification',
  'initDevice',
  'DiscordAuth',
  'RestartApp',
  
]

// API personalizada para el renderer
const api = {
  ipcRenderer: {
    send: (channel, ...args) => {
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, ...args)
        console.log(`[Sent]: ${channel}`)
      }
    },
    on: (channel, func) => {
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (_, ...args) => func(...args))
        console.log(`[Listener]: ${channel}`)
      }
    },
    removeListener: (channel, func) => {
      if (validChannels.includes(channel)) {
        ipcRenderer.removeListener(channel, func)
        console.log(`[Listener Removed]: ${channel}`)
      }
    },
    invoke: (channel, ...args) => {
      return new Promise((resolve, reject) => {
        if (validChannels.includes(channel)) {
          ipcRenderer
            .invoke(channel, ...args)
            .then((result) => {
              resolve(result)
              console.log(`[Invoked]: ${channel}`)
            })
            .catch((err) => {
              reject(err)
              console.error(`[Invoke Error]: ${channel} - Error: ${err}`)
            })
        }
      })
    }
  }
}

// Exponer APIs de Electron al renderer si `contextIsolation` está habilitado
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error('Error exposing API:', error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
