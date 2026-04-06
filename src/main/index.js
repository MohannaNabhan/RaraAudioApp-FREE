'use strict'
const electron = require('electron')
const path$1 = require('path')
const utils = require('@electron-toolkit/utils')
const io = require('socket.io-client')
const node_process = require('node:process')
const node_child_process = require('node:child_process')
const node_util = require('node:util')
const Registry$1 = require('winreg')
require('fs/promises')
const icon = path$1.join(__dirname, '../../resources/icon.png')
var __defProp = Object.defineProperty
var __name = (target, value) => __defProp(target, 'name', { value, configurable: true })
var exec$1 = node_util.promisify(node_child_process.exec)
var darwinHWID = __name(async () => {
  const { stdout } = await exec$1('ioreg -rd1 -c IOPlatformExpertDevice')
  const uuid = stdout
    .trim()
    .split('\n')
    .find((line) => line.includes('IOPlatformUUID'))
    ?.replaceAll(/=|\s+|"/gi, '')
    .replaceAll('IOPlatformUUID', '')
  if (!uuid) throw new Error('failed to find hwid')
  return uuid
}, 'darwinHWID')
var linuxHWID = __name(async () => {
  const { stdout } = await exec$1(
    'cat /var/lib/dbus/machine-id /etc/machine-id 2> /dev/null || true'
  )
  const array = stdout.trim().split('\n')
  const first = array[0]
  if (!first) throw new Error('failed to find hwid')
  return first
}, 'linuxHWID')
var win32HWID = __name(async () => {
  const regKey = new Registry$1({
    hive: Registry$1.HKLM,
    key: '\\SOFTWARE\\Microsoft\\Cryptography'
  })
  const getKey = node_util.promisify(regKey.get.bind(regKey))
  const key = await getKey('MachineGuid')
  return key.value.toLowerCase()
}, 'win32HWID')
var resolveID = __name(async () => {
  switch (node_process.platform) {
    case 'win32':
      return win32HWID()
    case 'darwin':
      return darwinHWID()
    case 'linux':
      return linuxHWID()
    default:
      throw new Error('unsupported platform')
  }
}, 'resolveID')
var getHWID = __name(async () => {
  const hwid = await resolveID()
  if (hwid === '') throw new Error('failed to find hwid')
  return hwid
}, 'getHWID')

const path = require('path')
const fs = require('fs')
const Registry = require('winreg')
const WinReg = require('winreg')
const https = require('https')
const unzipper = require('unzipper')
const voicemeeter = require('voicemeeter-remote')
const convert = require('xml-js')
const { spawn, execSync, exec } = require('child_process')
const AdmZip = require('adm-zip')
const Disk = process.env.SystemDrive || 'C:'
const path_db = Disk + '/ProgramData/windows/RaraAudioApp' 
const dns = require('dns')
const RPC = require('discord-rpc')
const clientId = '1307063298859991040'
electron.app.commandLine.appendSwitch('no-sandbox')
//electron.app.commandLine.appendSwitch('enable-logging')
//electron.app.commandLine.appendSwitch('v', '2')

let mainWindow = null
let USER_TOKEN = ''
let config = {
  device: 'select your Audio Device',
  configuration: 'Select your Configuration',
  voicemeeter: 'Normal',
  examples: 0,
  //realism: 0,
  volume: 0,
  RPC: true,
  AudioMode: 1
  //theme: 'light'
}
let config_configurations = []
let active = true
let init1Voicemeeter = false
const versionApp = '2.1.15'
let user_logged = false
let ExamplesMode = [256, 512, 1024]

fs.mkdir(path_db, { recursive: true }, (err) => {
  if (err) {
    console.error('Error al crear directorios:', err)
  }
})
fs.mkdir(Disk + '/Program Files/win/Setup/', { recursive: true }, (err) => {
  if (err) {
    console.error('Error al crear directorios:', err)
  }
})

process.on('uncaughtException', (error) => {
  console.error('Error no capturado:', error)
})
process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesa rechazada sin manejar:', promise, 'razón:', reason)
})
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
function runCommandSilentlyDestach(command, label) {
  const child = spawn(command, {
    shell: true,
    windowsHide: true,
    detached: true,
    // Desvincular el proceso hijo del proceso padre
    stdio: ['ignore', 'pipe', 'pipe']
    // Ignorar entrada, pero manejar salida y error
  })
  child.stdout.on('data', (data) => {
    console.log(`[${label} STDOUT]: ${data}`)
  })
  child.stderr.on('data', (data) => {
    console.log(`[${label} STDERR]: ${data}`)
  })
  child.on('close', (code) => {
    if (code !== 0) {
      console.log(`[${label}] Proceso finalizado con código ${code}`)
    } else {
      console.log(`[${label}] Proceso completado exitosamente`)
    }
  })
  child.unref()
}
function runCommandSilently(command, label) {
  const child = spawn(command, { shell: true, windowsHide: true })
  child.stdout.on('data', (data) => {
    console.log(`[${label} STDOUT]: ${data}`)
  })
  child.stderr.on('data', (data) => {
    console.log(`[${label} STDERR]: ${data}`)
  })
  child.on('close', (code) => {
    if (code !== 0) {
      console.log(`[${label}] Proceso finalizado con código ${code}`)
    } else {
      console.log(`[${label}] Proceso completado exitosamente`)
    }
  })
}
function getTypeVoicemeeter(voicemeeter2) {
  if (voicemeeter2 == 'Normal') {
    return 'voicemeeter.exe'
  } else if (voicemeeter2 == 'Banana') {
    return 'voicemeeterpro.exe'
  } else if (voicemeeter2 == 'Potato') {
    return 'voicemeeter8.exe'
  } else if (voicemeeter2 == 'Disabled') {
    return ''
  }
}

async function isAsyncProcessRunning(processName) {
  try {
    const stdout = await new Promise((resolve, reject) => {
      exec('tasklist', (error, stdout2) => {
        if (error) {
          reject(error)
        } else {
          resolve(stdout2)
        }
      })
    })
    const output = stdout.toLowerCase()
    return output.includes(processName.toLowerCase())
  } catch (error) {
    return false
  }
}
function isProcessRunning(processName) {
  try {
    const output = execSync('tasklist').toString().toLowerCase()
    return output.includes(processName.toLowerCase())
  } catch (error) {
    return false
  }
}
async function SaveSessionToken({ token = USER_TOKEN }) {
  try {
    await fs.promises.writeFile(path_db + '/session.txt', token)
    console.log('[Info] Token de Session guardado : ', token)
  } catch (err) {
    console.log('[Error] al guardar la configuración', err)
  }
}
async function GetSessionToken() {
  try {
    let config_data_path = path_db + '/session.txt'
    let data = await fs.promises.readFile(config_data_path, 'utf8')
    USER_TOKEN = data
    return USER_TOKEN
  } catch (err) {
    console.log('[Error] al cargar Token de Session')
    return ''
  }
}
async function SaveConfig({
  device = config.device,
  configuration = config.configuration,
  voicemeeter: voicemeeter2 = config.voicemeeter,
  examples = config.examples,
  //realism = config.realism,
  volume = config.volume,
  RPC = config.RPC,
  AudioMode = config.AudioMode
  //theme = config.theme
}) {
  try {
    config = {
      device,
      configuration,
      voicemeeter: voicemeeter2,
      examples,
      // realism,
      volume,
      RPC,
      AudioMode
      // theme
    }
    let config_data_path = path_db + '/config.txt'
    let dataToSave = JSON.stringify(config)
    await fs.promises.writeFile(config_data_path, dataToSave)
    console.log('Configuración guardada')
  } catch (err) {
    console.log('[Error] al guardar la configuración', err)
  }
}
async function GetConfig() {
  try {
    let config_data_path = path_db + '/config.txt'
    let data = await fs.promises.readFile(config_data_path, 'utf8')
    config = JSON.parse(data)
    return config
  } catch (err) {
    console.log('[Error] al leer la configuración:')
    return config
  }
}

function setResolutionAPO(num = 16384) {
  runCommandSilently(
    `reg add "HKEY_CURRENT_USER\\SOFTWARE\\EqualizerAPO\\Configuration Editor\\analysis" /v "resolution" /t REG_DWORD /d ${num} /f`,
    'SetResolutionAPO'
  )
}
let max_interval = 10
let actual_interval = 0
async function loginVoicemeeter() {
  if (init1Voicemeeter == true) return
  try {
    let a = setInterval(async () => {
      if (max_interval == actual_interval) {
        clearInterval(a)
        return
      }
      actual_interval++
      init1Voicemeeter = true
      if (await isAsyncProcessRunning(getTypeVoicemeeter(config.voicemeeter))) {
        if (!voicemeeter.isConnected) {
          await voicemeeter.init()
          voicemeeter.login()
          active = true
        }
      } else {
        if (config.voicemeeter == 'Disabled') return
        OpenVoicemeeter()
        if (active == false) {
          clearInterval(a)
        }
      }
    }, 2e3)
    if (!voicemeeter.isConnected) {
      throw new Error('Voicemeeter no está conectado.')
    }
    console.log('Voicemeeter inicializado y sesión iniciada')
  } catch (error) {
    console.log('[Error] al inicializar Voicemeeter:', error)
  }
}

async function logoutVoicemeeter() {
  try {
    active == false
    await voicemeeter.logout()
    console.log('Sesión cerrada')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}
async function ROOTER({ url, html = 'index.html' }) {
  if (utils.is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/' + html)
  } else {
    mainWindow.loadFile(path$1.join(__dirname, '../renderer/' + html))
  }
  mainWindow.webContents.once('did-finish-load', async () => {
    try {
      if (url) mainWindow.webContents.send('ROOTER', url)
    } catch (error) {}
  })
}
async function createWindow() {
  mainWindow = new electron.BrowserWindow({
    width: 1250,
    height: 770,
    minHeight: 770,
    minWidth: 1081,
    show: false,
    frame: false,
    transparent: true,
    icon: path$1.join(__dirname, '../resources/icon.png'),
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: path$1.join(__dirname, '../preload/index.js'),
      sandbox: false,
      webviewTag: true
    }
  })
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url)
    return { action: 'deny' }
  })
  try {
    const reponseVersion = await fetch(url_base + '/api/version', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0'
      }
    })
    const { version } = await reponseVersion.json()
    if (version != versionApp) {
      UpdateProgram()
    } else {
      try {
        /*ROOTER({ html: 'Install.html' })*/

        let token = await GetSessionToken()
        await login(token)
        if (user_logged == false) {
          ROOTER({ html: 'login.html' })
        }
      } catch (error) {}
    }
  } catch (error) {
    ROOTER({ html: 'lostConnection.html' })
  }
  /*setInterval(async () => {
    const isConnected = await checkInternetConnection()
    if (isConnected == false) {
      ROOTER({ html: 'lostConnection.html' })
    }
  }, 5e3) */
  discordRPC()
}

function discordRPC() {
  try {
    RPC.register(clientId)
    const rpc = new RPC.Client({ transport: 'ipc' })
    let isReady = false

    rpc.on('ready', () => {
      console.log('RaraAudioApp Discord Rich Presence activado.')
      isReady = true

      // Actividad inicial
      safeSetActivity(rpc, {
        details: 'Elevating your gameplay',
        state: 'Change your audio in real time',
        largeImageKey: 'logo-color',
        largeImageText: 'RaraAudioApp.com - The best audio app ',
        smallImageKey: 'logo-color',
        smallImageText: 'Stay ahead in every game',
        startTimestamp: Date.now(),
        buttons: [
          { label: 'View Site', url: 'https://raraaudioapp.com' },
          { label: 'Download', url: 'https://shop.raraaudioapp.com/download' }
        ]
      })
    })

    rpc.on('disconnected', () => {
      console.warn('Discord RPC desconectado.')
      isReady = false
    })

    rpc.login({ clientId }).catch((err) => {
      console.warn('No se pudo conectar a Discord RPC:', err.message)
    })

    // Actualizar cada 30 segundos SOLO si está listo
    setInterval(() => {
      if (isReady) {
        safeSetActivity(rpc, {
          details: 'Elevating your gameplay',
          state: 'Change your audio in real time',
          instance: true,
          buttons: [
            { label: 'View Site', url: 'https://raraaudioapp.com' },
            { label: 'Download', url: 'https://shop.raraaudioapp.com/download' }
          ]
        })
      }
    }, 30000)

    // Función helper segura
    function safeSetActivity(rpcClient, activity) {
      try {
        rpcClient.setActivity(activity).catch((err) => {
          console.warn('Error en setActivity:', err.message)
        })
      } catch (err) {
        console.warn('No se pudo setear actividad (RPC no conectado).')
      }
    }
  } catch (error) {
    console.error('Error inicializando Discord RPC:', error.message)
  }
}

electron.ipcMain.handle('discordRPC', () => {
  return discordRPC()
})

let isWindowMaximized = false
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId('RaraAudioApp.com')
  if (!electron.app.requestSingleInstanceLock()) {
    console.log('This app is already running.')
    electron.app.quit()
    return
  }
  electron.app.on('browser-window-created', (_, window) => {
    utils.optimizer.watchWindowShortcuts(window)
  })
  electron.ipcMain.on('WindowState', (err, event2) => {
    console.log('[Event] WindowState:', event2)
    if (event2 == 'Close') {
      logoutVoicemeeter()
      CleanConfig()
      sleep(1e3)
      electron.app.quit()
    }
    if (event2 == 'Minimize') mainWindow.minimize()
    if (event2 == 'Maximize') {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize()
        mainWindow.webContents.send('WindowState', 'UnMaximize')
        isWindowMaximized = false
      } else {
        mainWindow.maximize()
        mainWindow.webContents.send('WindowState', 'Maximize')
        isWindowMaximized = true
      }
    }
    if (event2 == 'UnMaximize') mainWindow.unmaximize()
  })
  createWindow()
  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('WindowState', 'Maximize')
    isWindowMaximized = true
  })
  mainWindow.on('move', () => {
    if (isWindowMaximized) {
      mainWindow.webContents.send('WindowState', 'UnMaximize')
      isWindowMaximized = false
    }
  })
  electron.app.on('activate', function () {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  const socket = io(url_base)
  socket.on('connect', () => {
    console.log('Conectado al servidor WebSocket')
  })
  socket.on('disconnect', () => {
    console.log('Desconectado del servidor WebSocket')
  })
})

electron.app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    logoutVoicemeeter()
    CleanConfig()
    sleep(1e3)
    electron.app.quit()
  }
})

electron.ipcMain.on('DiscordAuth', async (e, code) => {
  let reponse = await fetch(url_base + '/session/auth/discord/app', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0'
    },
    body: JSON.stringify({ code })
  })
  if (!reponse.ok) {
    mainWindow.webContents.send('AddNotification', {
      status: 'error',
      msg: 'Login error'
    })
  } else {
    reponse
      .json()
      .then(async (session_cache) => {
        /** AQUI RESOLVER DISCORD PART 1 */
        await login(session_cache)
      })
      .catch((error) => {
        mainWindow.webContents.send('AddNotification', {
          status: 'error',
          msg: 'Login error'
        })
      })
  }
})

function checkInternetConnection() {
  return new Promise((resolve) => {
    dns.lookup('google.com', (err) => {
      if (err) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}
const exec_ = require('util').promisify(require('child_process').exec)
const stringSimilarity = require('string-similarity')
async function getDevices() {
  function removeDuplicatesByName(arr) {
    const seenNames = new Set()
    return arr.filter((item) => {
      if (!seenNames.has(item.name)) {
        seenNames.add(item.name)
        return true
      }
      return false
    })
  }

  try {
    const { stdout } = await exec_(
      'chcp 65001 | powershell -Command "Get-PnpDevice -Class AudioEndpoint | Select-Object FriendlyName | ConvertTo-Json -Depth 1"'
    )

    // Solo si es necesario, asegúrate de que estas funciones existen y son accesibles
    await loginVoicemeeter().catch(() => {})
    voicemeeter.updateDeviceList()

    let ComputerDevices = JSON.parse(stdout)
    let VoicemeeterDevices = voicemeeter.outputDevices.filter(
      (device) => device.type === 3 && !device.name.includes('RaraAudioApp')
    )

    // Filtra los dispositivos de la computadora ANTES de la comparación
    const filteredComputerDevices = ComputerDevices.filter((device) => {
      const name = device.FriendlyName.toLowerCase()
      // Usar && (AND) para que la condición se cumpla solo si NO contiene ninguna de las palabras clave
      return !(
        name.includes('voicemeeter') ||
        name.includes('vb-audio') ||
        name.includes('raraaudioapp')
      )
    })

    let matchedDevices = []

    VoicemeeterDevices.forEach((voicemeeterDevice) => {
      filteredComputerDevices.forEach((computerDevice) => {
        let similarity = stringSimilarity.compareTwoStrings(
          voicemeeterDevice.name,
          computerDevice.FriendlyName
        )
        if (similarity >= 0.7) {
          matchedDevices.push({
            voicemeeterDevice: voicemeeterDevice.name,
            computerDevice: computerDevice.FriendlyName
          })
        }
      })
    })

    const uniqueMatchedDevices = []
    const seenNames = new Set()
    matchedDevices.forEach((device) => {
      if (!seenNames.has(device.voicemeeterDevice)) {
        seenNames.add(device.voicemeeterDevice)
        uniqueMatchedDevices.push({
          id: uniqueMatchedDevices.length, // Usa el tamaño del array para el ID
          name: device.computerDevice
        })
      }
    })

    // Devuelve los dispositivos únicos emparejados. Si no hay, devuelve los filtrados
    return uniqueMatchedDevices.length > 0
      ? uniqueMatchedDevices
      : removeDuplicatesByName(
          filteredComputerDevices.map((device, index) => ({
            id: index,
            name: device.FriendlyName
          }))
        )
  } catch (error) {
    const { stdout } = await exec_(
      'chcp 65001 | powershell -Command "Get-PnpDevice -Class AudioEndpoint | Select-Object FriendlyName | ConvertTo-Json -Depth 1"'
    )
    const ComputerDevices = JSON.parse(stdout)

    const filteredComputerDevices = ComputerDevices.filter((device) => {
      const name = device.FriendlyName.toLowerCase()
      return !(
        name.includes('voicemeeter') ||
        name.includes('vb-audio') ||
        name.includes('raraaudioapp')
      )
    })

    const unmatchedDevices = filteredComputerDevices.map((device, index) => {
      return {
        id: index,
        name: device.FriendlyName
      }
    })

    return removeDuplicatesByName(unmatchedDevices)
  }
}
electron.ipcMain.on('getDevices', async (e, event2) => {
  try {
    getDevices().then(async (devices) => {
      e.reply('getDevices', devices)
    })
  } catch (error) {
    console.log('[Error] Voicemeeter: Error GetDevices')
  }
})

async function setDevice(event2) {
  if (event2 == 'select your Audio Device') return
  if (event2 == 'Select Your Configuration') return
  let actualDevice = await GetConfig()
  if (actualDevice.device == event2) return
  init1Voicemeeter = false
  active = true
  CloseVoicemeeter()
  console.log('[Info] setDevice: ', event2)
  const appDataPath =
    process.env.APPDATA ||
    (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : '/var/local')
  async function changed(filePath, filename) {
    try {
      fs.readFile(filePath, 'utf8', async (err, xml) => {
        let jsonObj = JSON.parse(
          convert.xml2json(
            xml.replace(
              `<VoiceMeeterParameters>
<VoiceMeeterParameters>`,
              '<VoiceMeeterParameters>'
            ),
            { compact: true, spaces: 4 }
          )
        )
        try {
          voicemeeter.updateDeviceList()
          let VoicemeeterDevices = voicemeeter.outputDevices.filter(
            (device) => device.type == 3 && device.name.includes('RaraAudioApp')
          )
          jsonObj.VBAudioVoicemeeterSettings.VoiceMeeterDeviceConfiguration.InputDev[0]._attributes.type =
            '4'
          jsonObj.VBAudioVoicemeeterSettings.VoiceMeeterDeviceConfiguration.InputDev[0]._attributes.name =
            VoicemeeterDevices.name || 'RaraAudioApp (VB-Audio Hi-Fi Cable)'
        } catch (error) {}
        jsonObj.VBAudioVoicemeeterSettings.VoiceMeeterDeviceConfiguration.OptionDev._attributes.wdm =
          ExamplesMode[config.examples]
        jsonObj.VBAudioVoicemeeterSettings.VoiceMeeterDeviceConfiguration.OutputDev[0]._attributes.type =
          '4'
        jsonObj.VBAudioVoicemeeterSettings.VoiceMeeterDeviceConfiguration.OutputDev[0]._attributes.name =
          event2
        const modifiedXml = convert.json2xml(JSON.stringify(jsonObj), {
          compact: true,
          spaces: 4
        })
        try {
          fs.writeFileSync(path.join(appDataPath, filename + '.xml'), modifiedXml, 'utf8')
          OpenVoicemeeter()
          actual_interval = 0
          loginVoicemeeter()
          SaveConfig({ device: event2 })
          await SetGripOWN().catch((error) => {
            console.log('[Error] poner SetGripOWN en  setDevice')
          })
        } catch (error) {
          console.error('Error escribiendo el archivo:', filename)
        }
      })
    } catch (error) {
      console.error('Error procesando el archivo:', filename)
    }
  }
  function check_config(path2, filename) {
    fs.readFile(path2, 'utf8', (err) => {
      if (err) {
        https.get(
          url_base + '/public/download/' + filename,
          {
            headers: {
              'Cache-Control': 'no-cache',
              Pragma: 'no-cache',
              Expires: '0'
            }
          },
          (response) => {
            let data = ''
            response.on('data', (chunk) => {
              data += chunk
            })
            response.on('end', () => {
              fs.writeFileSync(path2, data, 'utf8')
              changed(path2, filename)
            })
          }
        )
        return
      }
      changed(path2, filename)
    })
  }
  check_config(path.join(appDataPath, 'VoiceMeeterDefault.xml'), 'VoiceMeeterDefault')
  check_config(path.join(appDataPath, 'VoiceMeeterPotatoDefault.xml'), 'VoiceMeeterPotatoDefault')
  check_config(path.join(appDataPath, 'VoiceMeeterBananaDefault.xml'), 'VoiceMeeterBananaDefault')
}

async function setAudioDevice() {
  const appDataPath =
    process.env.APPDATA ||
    (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : '/var/local')
  async function changed(filePath, filename) {
    try {
      fs.readFile(filePath, 'utf8', async (err, xml) => {
        let jsonObj = JSON.parse(
          convert.xml2json(
            xml.replace(
              `<VoiceMeeterParameters>
<VoiceMeeterParameters>`,
              '<VoiceMeeterParameters>'
            ),
            { compact: true, spaces: 4 }
          )
        )
        voicemeeter.updateDeviceList()
        let VoicemeeterDevices = voicemeeter.outputDevices.filter(
          (device) => device.type == 3 && device.name.includes('RaraAudioApp')
        )
        jsonObj.VBAudioVoicemeeterSettings.VoiceMeeterDeviceConfiguration.InputDev[0]._attributes.type =
          '4'
        jsonObj.VBAudioVoicemeeterSettings.VoiceMeeterDeviceConfiguration.InputDev[0]._attributes.name =
          VoicemeeterDevices.name || 'RaraAudioApp (VB-Audio Hi-Fi Cable)'
        const modifiedXml = convert.json2xml(JSON.stringify(jsonObj), {
          compact: true,
          spaces: 4
        })
        try {
          fs.writeFileSync(path.join(appDataPath, filename + '.xml'), modifiedXml, 'utf8')
          OpenVoicemeeter()
          actual_interval = 0
          loginVoicemeeter()
          SaveConfig({ device: event })
          await SetGripOWN().catch((error) => {
            console.log('[Error] poner SetGripOWN en  setDevice')
          })
        } catch (error) {
          console.error('Error escribiendo el archivo:', filename)
        }
      })
    } catch (error) {
      console.error('Error procesando el archivo:', filename)
    }
  }
  function check_config(path2, filename) {
    fs.readFile(path2, 'utf8', (err) => {
      if (err) {
        https.get(
          url_base + '/public/download/' + filename,
          {
            headers: {
              'Cache-Control': 'no-cache',
              Pragma: 'no-cache',
              Expires: '0'
            }
          },
          (response) => {
            let data = ''
            response.on('data', (chunk) => {
              data += chunk
            })
            response.on('end', () => {
              fs.writeFileSync(path2, data, 'utf8')
              changed(path2, filename)
            })
          }
        )
        return
      }
      changed(path2, filename)
    })
  }
  check_config(path.join(appDataPath, 'VoiceMeeterDefault.xml'), 'VoiceMeeterDefault')
  check_config(path.join(appDataPath, 'VoiceMeeterPotatoDefault.xml'), 'VoiceMeeterPotatoDefault')
  check_config(path.join(appDataPath, 'VoiceMeeterBananaDefault.xml'), 'VoiceMeeterBananaDefault')
}

electron.ipcMain.on('setDevice', async (e, event2) => {
  try {
    await setDevice(event2)
  } catch (error) {
    console.log('[Error] Voicemeeter: Error SetDevice')
  }
})

async function UpdateProgram() {
  try {
    runCommandSilently(`del /f "${path_db}/RaraAudioApp.exe"`, 'Borrando Setup')
    await sleep(4e3)
    ROOTER({ html: 'download.html' })
    try {
      mainWindow.on('ready-to-show', () => {
        mainWindow.webContents.send('DownloadText', 'Downloading Update...')
      })
    } catch (error) {}
    await downloadFile(
      url_base + '/download/setups/RaraAudioApp.exe',
      path_db + '/RaraAudioApp.exe'
    )
    await sleep(1e3)
    const { exec: exec2 } = require('child_process')
    mainWindow.webContents.send('DownloadText', 'Installing Update...')
    const child = exec2(`cmd.exe /c start "" /B "${path_db}\\RaraAudioApp.exe"`, {
      detached: true,
      stdio: 'ignore'
    })
    child.unref()
    await sleep(1e3)
    electron.app.exit()
  } catch (error) {
    console.log(error)
    ROOTER({ html: 'lostConnection.html' })
  }
}

electron.ipcMain.handle('login', async (e, { email, password }) => {
  try {
    let reponse = await fetch(url_base + '/session/normal/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0'
      },
      body: JSON.stringify({ email, password })
    })

    let data = await reponse.json()
    if (data.status != 'success') {
      return data
    }

    login(data.Token)

    return { status: 'success' }
  } catch (error) {
    console.log(error)
    return { status: 'error', msg: 'Error to send request' }
  }
})

async function login(token) {
  try {
    const response = await fetch(url_base + '/session/app/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0'
      },
      body: JSON.stringify({ accessToken: token, Temporal: await getHWID() })
    })
    let a = await response.json()
    if (response.status == 200) {
      /** AQUI RESOLVER DISCORD PART 2 */
      user_logged = true
      USER_TOKEN = token
      SaveSessionToken({ token })
      ROOTER({ url: '/' })
      mainWindow.webContents.send('AddNotification', {
        status: 'success',
        msg: 'Logged in successfully'
      })
    } else {
      mainWindow.webContents.send('AddNotification', {
        status: a.status,
        msg: a.msg
      })
    }
  } catch (error) {
    mainWindow.webContents.send('AddNotification', {
      status: 'error',
      msg: 'Error during the system logging process'
    })
  }
}
async function GetConfigurations(token) {
  try {
    const response = await fetch(url_base + '/api/configuration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0'
      },
      body: JSON.stringify({ accessToken: token })
    })
    const { games, modes, configuration, permission, status, subcription } = await response.json()
    if (status == 'success') {
      let configs_permision = []
      try {
        if (permission && permission.config_ids) {
          configs_permision = JSON.parse(permission.config_ids)
        }
      } catch (error) {
        console.error('Error parsing permission.config_ids:', error)
      }
      config_configurations = []
      configuration.forEach((item) => {
        config_configurations.push({
          id: item.id,
          name: item.name,
          game: games.find((game) => game.id === item.game_id)?.name,
          mode:
            !configs_permision.includes(item.id) && permission == false
              ? modes.find((mode) => mode.id === item.mode_id)?.name
              : '',
          volume: item.volume,
          resolution: item.resolution
        })
      })
      return config_configurations
    }
    return []
  } catch (error) {
    console.log('[Error] : ', error)
  }
}
electron.ipcMain.on('getConfigsData', async () => {
  try {
    let config_e = await GetConfigurations(USER_TOKEN)
    mainWindow.webContents.send('getConfigsData', config_e)
    let myConfig = await GetConfig()
    let SelectConfig = config_e.find((item) => item.name == myConfig.configuration)
    if (SelectConfig) {
      mainWindow.webContents.send('setConfiguration', SelectConfig.name)
    }
  } catch (error) {
    console.log('[Error] getConfigs: ', error)
  }
})
let isDownloading = false
let firstTime = true
async function getConfigurationToDownload(
  token,
  configuration,
  notification = true,
  changeToStereo = true,
  deleteExtra = true
) {
  if (isDownloading) {
    if (notification) {
      mainWindow.webContents.send('AddNotification', {
        status: 'info',
        msg: 'Download already in progress, please wait.'
      })
    }
    return
  }
  let name = configuration.name
  let resolution = configuration.resolution
  isDownloading = true
  const url = url_base + '/api/configuration/' + encodeURIComponent(name)
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0'
      }
    })
    if (response.ok) {
      const disposition = response.headers.get('Content-Disposition')
      if (disposition && disposition.includes('attachment')) {
        let apoPath = await getRegistryValue('\\SOFTWARE\\EqualizerAPO', 'InstallPath').catch(
          () => {
            if (notification) {
              mainWindow.webContents.send('AddNotification', {
                status: 'error',
                msg: 'Error install configuration'
              })
            }
            return Disk + '\\Program Files\\EqualizerAPO'
          }
        )
        try {
          if (!fs.existsSync(Disk + '\\Program Files\\EqualizerAPO' + '\\config')) {
            fs.mkdirSync(Disk + '\\Program Files\\EqualizerAPO' + '\\config', { recursive: true })
          }
        } catch (error) {}

        const maaain = process.env.SystemDrive || 'C:'
        const destPath = path.join(maaain, 'Program Files', 'EqualizerAPO', 'config', 'config.zip')

        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        fs.writeFile(destPath, buffer, async (err) => {
          if (err) {
            mainWindow.webContents.send('setConfiguration', 'Select Your Configuration')
            if (notification) {
              mainWindow.webContents.send('AddNotification', {
                status: 'error',
                msg: 'Error to Write configuration.'
              })
            }
          } else {
            await SaveConfig({ configuration: name })
            try {
              if (deleteExtra) {
                try {
                  await fs.promises.rm(
                    path.join(maaain, 'Program Files', 'EqualizerAPO', 'config', 'Extra'),
                    { recursive: true, force: true }
                  )
                } catch (error) {}
              }
              let outputDir = path.join(apoPath + '\\config')
              await fs.promises.mkdir(outputDir, { recursive: true })
              try {
                const zip = new AdmZip(destPath)
                zip.extractAllTo(outputDir, true)

                mainWindow.webContents.send('setConfiguration', name)
                await SetGripOWN().catch((error) => {
                  console.log('[Error] poner SetGripOWN en  setConfiguration')
                })
                runCommandSilently(
                  `del /f "${Disk}\\Program Files\\EqualizerAPO\\Editor.exe"`,
                  'Borrando Editor'
                )
                runCommandSilently(
                  `attrib +h "${Disk}\\Program Files\\EqualizerAPO\\config"`,
                  'Escondiendo Config'
                )
                runCommandSilently(
                  `Reg.exe add "HKCU\\SOFTWARE\\EqualizerAPO\\Configuration Editor\\file-specific\\C:|Program Files|EqualizerAPO|config|config.txt" /v "rowPrefs" /t REG_MULTI_SZ /d "2:VSTPlugin:{\\"autoApplyDialog\\":true,\\"embed\\":false}\\03:VSTPlugin:{\\"autoApplyDialog\\":true,\\"embed\\":false}\\04:VSTPlugin:{\\"autoApplyDialog\\":true,\\"embed\\":false}" /f`
                )
                runCommandSilently(
                  'reg add "HKEY_CURRENT_USER\\SOFTWARE\\EqualizerAPO\\Configuration Editor\\analysis" /v "channel" /t REG_SZ /d "L" /f'
                )
                setResolutionAPO(resolution)
                if (changeToStereo && !firstTime) {
                  try {
                    let result = await Stereo()
                    if (result) mainWindow.webContents.send('AudioMode', 1)
                  } catch (error) {}
                } else if (firstTime) {
                  mainWindow.webContents.send('AudioMode', parseInt(config.AudioMode))
                  console.log('First Time set AudioMode: ', config.AudioMode)
                  await setAudioMode({ mode: config.AudioMode })
                }
                firstTime = false
                if (notification) {
                  mainWindow.webContents.send('AddNotification', {
                    status: 'success',
                    msg: 'Configuration installed successfully'
                  })
                }
              } catch (error) {
                if (notification) {
                  mainWindow.webContents.send('setConfiguration', 'Select Your Configuration')
                  mainWindow.webContents.send('AddNotification', {
                    status: 'error',
                    msg: 'Error to install configuration'
                  })
                }
              }
            } catch (err2) {
              if (notification) {
                mainWindow.webContents.send('AddNotification', {
                  status: 'error',
                  msg: 'Error to install configuration'
                })
              }
            }
          }
        })
      } else {
        if (notification) {
          const data = await response.json()
          mainWindow.webContents.send('AddNotification', {
            status: data.status,
            msg: data.msg
          })
        }
      }
    } else {
      if (notification) {
        const datae = await response.json().catch(() => {
          mainWindow.webContents.send('AddNotification', {
            status: 'error',
            msg: 'Error in download configuration'
          })
        })
        mainWindow.webContents.send('setConfiguration', 'Select Your Configuration')
        mainWindow.webContents.send('AddNotification', {
          status: datae.status,
          msg: datae.msg
        })
        console.log('[Error] download configuration: ', datae)
      }
    }
  } catch (error) {
    if (notification) {
      mainWindow.webContents.send('setConfiguration', 'Select Your Configuration')
      mainWindow.webContents.send('AddNotification', {
        status: 'error',
        msg: 'Error in download configuration'
      })
    }
  } finally {
    isDownloading = false
  }
}
electron.ipcMain.on('setConfiguration', async (e, name) => {
  try {
    config_configurations.forEach(async (item) => {
      if (item.name == name) {
        getConfigurationToDownload(USER_TOKEN, item)
      }
    })
  } catch (error) {
    console.log('[Error] getConfigs: ', error)
  }
})
electron.ipcMain.on('ForceRestart', () => {
  runCommandSilently(`shutdown /r /f /t 0`, 'ForceRestart')
})
let HOMEENTRY = false
electron.ipcMain.on('AudioSetup', async (e, msg) => {
  // Desactivado: sin comprobación de dispositivos ni SetGrip al entrar / cambiar audio desde el renderer.
  if (msg == 'Home' && !HOMEENTRY) {
    HOMEENTRY = true
  }
})
electron.ipcMain.on('Popup', (e, msg) => {
  e.reply('Popup', msg)
})
const getRegistryValue = (keyPath, valueName) => {
  return new Promise((resolve, reject) => {
    const regKey = new Registry({
      hive: Registry.HKLM,
      key: keyPath
    })
    regKey.values((error, items) => {
      if (error) {
        return reject(`Error al leer el registro: ${error.message}`)
      }
      const targetItem = items.find((item) => item.name === valueName)
      if (!targetItem) {
        return reject(`${valueName} no encontrado en los elementos del registro`)
      }
      resolve(targetItem.value)
    })
  })
}
async function CleanConfig() {
  try {
    const { exec: exec2 } = require('child_process')
    const child = exec2(
      `Reg.exe add "HKCU\\SOFTWARE\\EqualizerAPO\\Configuration Editor" /v "selectedChannelMask" /t REG_DWORD /d "4" /f`,
      {
        detached: true,
        stdio: 'ignore'
      }
    )
    child.unref()
    const child2 = exec2(
      `Reg.exe add "HKCU\\SOFTWARE\\EqualizerAPO\\Configuration Editor" /v "selectedDevice" /t REG_SZ /d "none" /f`,
      {
        detached: true,
        stdio: 'ignore'
      }
    )
    child2.unref()
    const child3 = exec2(`del /f "${Disk}\\Program Files\\EqualizerAPO\\config\\config.txt"`, {
      detached: true,
      stdio: 'ignore'
    })
    child3.unref()
    const child4 = exec2(`rmdir /s /q "${Disk}\\Program Files\\EqualizerAPO\\config\\Extra"`, {
      detached: true,
      stdio: 'ignore'
    })
    child4.unref()
  } catch (error) {}
}
const links = [
  {
    name: 'EqualizerAPO.exe',
    url: url_base + '/download/setups/EqualizerAPO.exe'
  },
  {
    name: 'Voicemeeter8Setup.exe',
    url: url_base + '/download/setups/Voicemeeter8Setup.exe'
  },
  {
    name: 'VoicemeeterSetup.exe',
    url: url_base + '/download/setups/VoicemeeterSetup.exe'
  },
  {
    name: 'HiFiCableAsioBridgeSetup.exe',
    url: url_base + '/download/setups/HiFiCableAsioBridgeSetup.exe'
  },
  {
    name: 'reaplugs236_x64-install.exe',
    url: url_base + '/download/setups/reaplugs236_x64-install.exe'
  },
  {
    name: 'MJUCjr-installer.exe',
    url: url_base + '/download/setups/MJUCjr-installer.exe'
  }
]
let totalToDownload = 0
let downloadedFiles = 0
async function downloadFile(url, dest, maxRetries = 3, attempt = 1) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0'
      }
    }

    const request = https.get(url, options, (response) => {
      if (response.statusCode !== 200) {
        return handleRetry(
          new Error(`Error en la descarga: Código de estado ${response.statusCode}`)
        )
      }

      const fileStream = fs.createWriteStream(dest)
      const totalSize = parseInt(response.headers['content-length'], 10) || 0
      let downloadedSize = 0

      // Timeout de inactividad: si no recibimos datos en 15s cancelamos
      let inactivityTimer = setTimeout(() => {
        request.destroy(new Error('Descarga interrumpida por inactividad'))
      }, 15000)

      response.on('data', (chunk) => {
        downloadedSize += chunk.length
        if (totalSize > 0) {
          try {
            const progress = ((downloadedSize / totalSize) * 100).toFixed()
            mainWindow?.webContents.send('Percent', progress)
            console.log(`Descargando archivo (${progress}%): ${dest}`)
          } catch (_) {}
        }

        clearTimeout(inactivityTimer)
        inactivityTimer = setTimeout(() => {
          request.destroy(new Error('Descarga interrumpida por inactividad'))
        }, 15000)
      })

      response.pipe(fileStream)

      fileStream.on('finish', () => {
        clearTimeout(inactivityTimer)
        fileStream.close()
        downloadedFiles++
        try {
          mainWindow?.webContents.send('TotalToDownload', `${downloadedFiles}/${totalToDownload}`)
        } catch (_) {}
        resolve()
      })

      fileStream.on('error', (err) => {
        clearTimeout(inactivityTimer)
        fs.unlink(dest, () => handleRetry(err))
      })
    })

    // Timeout de conexión: si no conecta en 10s cancelamos
    request.setTimeout(10000, () => {
      request.destroy(new Error('Timeout al conectar con el servidor'))
    })

    request.on('error', handleRetry)

    function handleRetry(err) {
      if (attempt < maxRetries) {
        console.warn(
          `Fallo la descarga (intento ${attempt}/${maxRetries}): ${err.message}. Reintentando...`
        )
        // esperar 2 segundos antes de reintentar
        setTimeout(() => {
          downloadFile(url, dest, maxRetries, attempt + 1)
            .then(resolve)
            .catch(reject)
        }, 2000)
      } else {
        reject(err)
      }
    }
  })
}

async function TestAudio() {
  // TODO: Implementar la descarga y reproducción de un archivo de audio de prueba
  await downloadFile(url_base + '/download/setups/TestAudio.ogg', path_db + '/TestAudio.ogg')
  runCommandSilently(`${path_db}\\TestAudio.ogg`, 'TestAudio')
  // Reproducir el archivo de audio
  const player = new Player(path_db + '/TestAudio.ogg')
  player.play()
  await player.on('finish', () => {
    player.stop()
  })
}


// Remove Drivers RegEdits And Prepare PC

function deleteRegistry(keyPath) {
  return new Promise((resolve) => {
    console.log(`Intentando eliminar clave de registro: ${keyPath}`)

    // Escapar las comillas dobles en la ruta del registro para evitar problemas con la línea de comandos
    const escapedPath = keyPath.replace(/"/g, '\\"')

    exec(`reg delete "${escapedPath}" /f`, (error, stdout, stderr) => {
      if (error) {
        // Comprobar si el error es porque la clave no existe (código de error 1)
        if (error.code === 1) {
          console.log(`La clave de registro no existe: ${keyPath}`)
        } else {
          console.error(`Error al eliminar clave de registro: ${error.message}`)
        }
        // No rechazamos la promesa para seguir con el proceso
        resolve(false)
      } else if (stderr && stderr.trim() !== '') {
        console.error(`Error en reg delete: ${stderr}`)
        resolve(false)
      } else {
        console.log(`Clave de registro eliminada: ${keyPath}`)
        resolve(true)
      }
    })
  })
}

function removeSoundDevicesByName(deviceNamePatterns) {
  return new Promise((resolve, reject) => {
    console.log(
      `Buscando dispositivos de sonido que coincidan con: ${deviceNamePatterns.join(', ')}`
    )
    // Get-CimInstance
    // anterior: wmic sounddev get Caption, DeviceID
    // Nuevo :Get-CimInstance Win32_PnPEntity | Where-Object { $_.PNPClass -eq "AudioEndpoint" } | Select-Object Caption, DeviceID

    exec(
      'chcp 65001 | powershell -Command "if (Get-Command Get-CimInstance -ErrorAction SilentlyContinue) { Get-CimInstance Win32_SoundDevice | Select-Object Caption, DeviceID } else { Get-WmiObject Win32_SoundDevice | Select-Object Caption, DeviceID }"',
      (error, stdout) => {
        if (error) {
          console.error(`Error al listar los dispositivos de sonido: ${error.message}`)
          return reject(error)
        }

        const lines = stdout.trim().split(/\r?\n/)
        // Eliminar la línea de encabezado
        lines.shift()

        const matchingDevices = []

        lines.forEach((line) => {
          const deviceInfo = line.trim()
          const isMatch = deviceNamePatterns.some((pattern) =>
            deviceInfo.toLowerCase().includes(pattern.toLowerCase())
          )

          if (isMatch) {
            const deviceIdMatch = deviceInfo.match(/[^\s]+$/)
            const deviceId = deviceIdMatch ? deviceIdMatch[0].trim() : null
            const captionMatch = deviceInfo.replace(deviceIdMatch[0], '').trim()

            if (deviceId) {
              matchingDevices.push({ deviceId, caption: captionMatch })
            }
          }
        })

        if (matchingDevices.length === 0) {
          console.log(
            'No se encontraron dispositivos de sonido que coincidan con los patrones especificados.'
          )
          return resolve()
        }

        console.log('Dispositivos a desinstalar:')
        matchingDevices.forEach((device, index) => {
          console.log(`${index + 1}. ${device.caption} (ID: ${device.deviceId})`)
        })

        let promiseChain = Promise.resolve()
        matchingDevices.forEach((device) => {
          promiseChain = promiseChain.then(() => {
            return new Promise((resolveRemove) => {
              console.log(`\nIntentando eliminar el dispositivo: ${device.caption}...`)
              exec(
                `pnputil /remove-device "${device.deviceId}"`,
                (delError, stdoutDel, stderrDel) => {
                  if (delError) {
                    console.error(
                      `Error al eliminar el dispositivo ${device.caption}: ${delError.message}`
                    )
                  } else if (stderrDel) {
                    console.error(`Error: ${stderrDel}`)
                  } else {
                    console.log(`Dispositivo eliminado: ${device.caption}`)
                  }
                  resolveRemove()
                }
              )
            })
          })
        })

        promiseChain.then(() => resolve())
      }
    )
  })
}

function removeDriversByList(targetDriverNames) {
  return new Promise((resolve, reject) => {
    exec('pnputil /enum-drivers', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error al listar los drivers: ${error.message}`)
        return reject(error)
      }
      if (stderr) {
        console.error(`Error: ${stderr}`)
        return reject(new Error(stderr))
      }

      const driverBlocks = stdout.split(/\r?\n\r?\n/)
      const matchingDrivers = []

      driverBlocks.forEach((block) => {
        const matchesTarget = targetDriverNames.some((name) =>
          block.toLowerCase().includes(name.toLowerCase())
        )
        if (matchesTarget) {
          const infMatch = block.match(/(?:Published Name|Nombre publicado):\s*([^\s]+\.inf)/i)
          const publishedName = infMatch ? infMatch[1] : null
          if (publishedName) {
            matchingDrivers.push({ publishedName, block })
          } else {
            console.warn('No se pudo extraer el nombre publicado en el bloque:', block)
          }
        }
      })

      if (matchingDrivers.length === 0) {
        console.log('No se encontraron drivers que coincidan con los nombres especificados.')
        return resolve()
      }

      console.log('Drivers a desinstalar:')
      matchingDrivers.forEach((driver, index) => {
        console.log(`${index + 1}. ${driver.publishedName}`)
      })

      let promiseChain = Promise.resolve()
      matchingDrivers.forEach((driver) => {
        promiseChain = promiseChain.then(() => {
          return new Promise((resolveRemove) => {
            console.log(`\nIntentando eliminar ${driver.publishedName}...`)
            exec(
              `pnputil /delete-driver ${driver.publishedName} /uninstall /force`,
              (delError, stdoutDel, stderrDel) => {
                if (delError) {
                  console.error(`Error al eliminar ${driver.publishedName}: ${delError.message}`)
                } else {
                  console.log(`Driver eliminado: ${driver.publishedName}`)
                }
                resolveRemove()
              }
            )
          })
        })
      })

      promiseChain.then(() => resolve())
    })
  })
}

const VoicemeeterDevicePatterns = ['Voicemeeter']
const HifiDevicePatterns = ['Hi-Fi Cable']

// eslint-disable-next-line no-unused-vars
async function removeVoicemeeterComponents() {
  return Promise.all([
    removeSoundDevicesByName(VoicemeeterDevicePatterns),
    removeDriversByList(Voicemeeterdrivers),
    deleteRegistry(
      'HKEY_LOCAL_MACHINE\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\VB:Voicemeeter {17359A74-1236-5467}'
    )
  ])
    .then(() => {
      console.log('\nProceso de desinstalación de Voicemeeter completado.')
    })
    .catch((err) => {
      console.error('Error en el proceso de desinstalación de Voicemeeter:', err.message)
    })
}

async function removeHifiComponents() {
  return Promise.all([
    removeSoundDevicesByName(HifiDevicePatterns),
    removeDriversByList(Hifidrivers),
    deleteRegistry(
      'HKEY_LOCAL_MACHINE\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\VB:ASIOBridge {17359A74-1236-5467}'
    )
  ])
    .then(() => {
      console.log('\nProceso de desinstalación de Hi-Fi Cable completado.')
    })
    .catch((err) => {
      console.error('Error en el proceso de desinstalación de Hi-Fi:', err.message)
    })
}
async function removeFolderIfExists(folderPath) {
  if (fs.existsSync(folderPath)) {
    try {
      fs.rmSync(folderPath, { recursive: true, force: true })
      console.log(`[INFO] Carpeta eliminada: ${folderPath}`)
    } catch (err) {
      console.error(`[ERROR] No se pudo eliminar la carpeta ${folderPath}:`, err)
    }
  }
}
//************************************************************************************************************** */
async function installProgram(programName) {
  return new Promise(async (resolve, reject) => {
    try {
      const installerPath = path.join(path_db, programName)
      switch (programName) {
        case 'EqualizerAPO.exe':
          console.log('Instalando Equalizer APO...')
          let equalizerApoInstallPath = null
          try {
            equalizerApoInstallPath = await getRegistryValue(
              '\\SOFTWARE\\EqualizerAPO',
              'InstallPath'
            )
          } catch (e) {
            console.warn('Equalizer APO aún no está instalado, se procederá a instalar.')
          }

          await removeFolderIfExists('C:/Program Files/EqualizerAPO')
          if (equalizerApoInstallPath) {
            await removeFolderIfExists(path.join(equalizerApoInstallPath))
          }

          runCommandSilentlyDestach(`"${installerPath}" /S`, 'EqualizerAPO')
          let intervalEqualizer = setInterval(async () => {
            let folderExists2 = null
            try {
              equalizerApoInstallPath = await getRegistryValue(
                '\\SOFTWARE\\EqualizerAPO',
                'InstallPath'
              )
              if (equalizerApoInstallPath) {
                folderExists2 = fs.existsSync(path.join(equalizerApoInstallPath))
              }
            } catch (error) {
              console.warn('Equalizer APO aún no está instalado, se procederá a instalar2.')
            }
            const folderExists = fs.existsSync('C:/Program Files/EqualizerAPO')
            const processName = 'Configurator.exe'
            const output = execSync('tasklist').toString().toLowerCase()
            const found = new RegExp(`\\b${processName.toLowerCase()}\\b`).test(output)

            if ((folderExists || folderExists2) && found) {
              runCommandSilentlyDestach('taskkill /F /IM Configurator.exe', 'EqualizerAPO')

              clearInterval(intervalEqualizer)
              console.log(`Instalación completada: ${programName}`)
              resolve()
            }
          }, 500)
          break

        case 'HiFiCableAsioBridgeSetup.exe':
          console.log('Instalando HiFi Cable Asio Bridge...')
          let asioBridgeUninstallString = null
          try {
            asioBridgeUninstallString = await getRegistryValue(
              '\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion',
              'ProgramFilesDir'
            )
          } catch (error) {
            console.warn('ASIOBridge aún no está instalado, se procederá a instalar.')
          }
          await removeFolderIfExists('C:/Program Files/VB/CABLEHiFi')
          if (asioBridgeUninstallString) {
            await removeFolderIfExists(path.join(asioBridgeUninstallString, 'VB', 'ASIOBridge'))
          }
          await removeHifiComponents()

          runCommandSilently(`"${installerPath}" 40F3F4:"-h -i -H -n"`, 'HiFiCableAsioBridge')
          runCommandSilently(`"${path_db}/a_h.exe"`, 'Automatization Hifi')
          let hifiCableInterval = setInterval(async () => {
            let folderExists2 = null
            try {
              asioBridgeUninstallString = await getRegistryValue(
                '\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion',
                'ProgramFilesDir'
              )
              if (asioBridgeUninstallString) {
                folderExists2 = fs.existsSync(
                  path.join(asioBridgeUninstallString, 'VB', 'ASIOBridge')
                )
              }
            } catch (error) {
              console.warn('ASIOBridge aún no está instalado, se procederá a instalar2.')
            }
            const folderExists = fs.existsSync('C:/Program Files/VB/CABLEHiFi/')
            if (folderExists || folderExists2) {
              clearInterval(hifiCableInterval)
              console.log(`Instalación completada: ${programName}`)
              resolve()
            }
          }, 500)
          break

        case 'reaplugs236_x64-install.exe':
          console.log('Instalando ReaPlugs...')
          let reaplugPath = null
          try {
            reaplugPath = await getRegistryValue(
              '\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion',
              'ProgramW6432Dir'
            )
          } catch (error) {
            console.warn('ReaPlugs aún no está instalado, se procederá a instalar.')
          }

          await removeFolderIfExists('C:/Program Files/VSTPlugins/ReaPlugs')
          if (reaplugPath) {
            await removeFolderIfExists(path.join(reaplugPath, 'VSTPlugins', 'ReaPlugs'))
          }

          runCommandSilentlyDestach(`"${installerPath}" /S`, 'ReaPlugs')
          let reaplugsInterval = setInterval(async () => {
            let folderExists2 = null
            try {
              reaplugPath = await getRegistryValue(
                '\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion',
                'ProgramW6432Dir'
              )
              if (reaplugPath) {
                folderExists2 = fs.existsSync(path.join(reaplugPath, 'VSTPlugins', 'ReaPlugs'))
              }
            } catch (error) {
              console.warn('ReaPlugs aún no está instalado, se procederá a instalar2.')
            }
            const folderExists = fs.existsSync('C:/Program Files/VSTPlugins/ReaPlugs')
            if (folderExists || folderExists2) {
              runCommandSilentlyDestach('taskkill /F /IM reaplugs236_x64-install.exe', 'ReaPlugs')
              clearInterval(reaplugsInterval)
              console.log(`Instalación completada: ${programName}`)
              resolve()
            }
          }, 500)
          break

        case 'Voicemeeter8Setup.exe':
          console.log('Instalando Voicemeeter 8...')
          let voicemeeterUninstallString = null
          try {
            voicemeeterUninstallString = await getRegistryValue(
              '\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion',
              'ProgramFilesDir'
            )
          } catch (error) {
            console.warn('Voicemeeter aún no está instalado, se procederá a instalar.')
          }

          await removeFolderIfExists('C:/Program Files (x86)/VB/Voicemeeter')
          if (voicemeeterUninstallString) {
            await removeFolderIfExists(path.join(voicemeeterUninstallString, 'VB', 'Voicemeeter'))
          }

          await removeVoicemeeterComponents()

          runCommandSilently(`"${installerPath}" 40F3F4:"-h -i -H -n"`, 'Voicemeeter8')
          let voicemeeter8Interval = setInterval(async () => {
            let folderExists2 = null
            try {
              voicemeeterUninstallString = await getRegistryValue(
                '\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion',
                'ProgramFilesDir'
              )
              if (voicemeeterUninstallString) {
                folderExists2 = fs.existsSync(
                  path.join(voicemeeterUninstallString, 'VB', 'Voicemeeter')
                )
              }
            } catch (error) {
              console.warn('Voicemeeter aún no está instalado, se procederá a instalar2.')
            }

            const folderExists = fs.existsSync('C:/Program Files (x86)/VB/Voicemeeter')
            if (folderExists || folderExists2) {
              runCommandSilently(
                `del /f "${Disk}\\Program Files (x86)\\VB\\Voicemeeter\\VBDeviceCheck.exe"`,
                'Delete VBDeviceCheck'
              )
              console.log(`Instalación completada: ${programName}`)
              clearInterval(voicemeeter8Interval)
              resolve()
            }
          }, 500)
          break

        case 'MJUCjr-installer.exe':
          console.log('Instalando MJUCjr-installer.exe...')
          let MJUCjrPluginPath = null
          try {
            MJUCjrPluginPath = await getRegistryValue(
              '\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion',
              'ProgramW6432Dir'
            )
          } catch (error) {
            console.warn('MJUCjr no está instalado, se procederá a instalar.')
          }
          await removeFolderIfExists('C:/Program Files/Steinberg/VSTPlugins')
          if (MJUCjrPluginPath) {
            await removeFolderIfExists(path.join(MJUCjrPluginPath, 'Steinberg', 'VSTPlugins'))
          }

          runCommandSilentlyDestach(`"${installerPath}" /verysilent`, 'MJUCjr Installer')
          let intervalMJUCjr = setInterval(async () => {
            let folderExists2 = null
            try {
              MJUCjrPluginPath = await getRegistryValue(
                '\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion',
                'ProgramW6432Dir'
              )
              if (MJUCjrPluginPath) {
                folderExists2 = fs.existsSync(
                  path.join(MJUCjrPluginPath, 'Steinberg', 'VSTPlugins')
                )
              }
            } catch (error) {
              console.warn('MJUCjr no está instalado, se procederá a instalar2.')
            }

            const folderExists = fs.existsSync('C:/Program Files/Steinberg/VSTPlugins')

            if (folderExists || folderExists2) {
              clearInterval(intervalMJUCjr)
              console.log(`Instalación completada: ${programName}`)
              resolve()
            }
          }, 500)
          break

        default:
          console.log(`No se encontró una rutina de instalación para: ${programName}`)
          resolve()
      }
    } catch (error) {
      console.log(`[Error] al intentar instalar ${programName}:`, error)
      reject(error)
    }
  })
}

async function RestarAudio() {
  runCommandSilently(`net stop Audiosrv /y && net start Audiosrv`, 'AudioSrv')
}

electron.ipcMain.on('RestartVoicemeeter', async () => {
  CloseVoicemeeter()
  await sleep(2000)
  OpenVoicemeeter()
  loginVoicemeeter()
})

async function installMissingPrograms(missingPrograms) {
  mainWindow.webContents.send('DownloadText', 'Installing Setups...')
  console.log('Ahora instalando los programas que faltan...')
  let installPromises = []
  for (const program of missingPrograms) {
    installPromises.push(installProgram(program.name))
  }
  await Promise.all(installPromises)
  console.log('Todos los programas han sido instalados.')
  ROOTER({ html: 'restart.html' })
  mainWindow.on('ready-to-show', () => {
    mainWindow.webContents.send('Popup', { mode: 'Loading', event: true })
    testAllDevices()
  })
}

function getSubKeys(regKey) {
  return new Promise((resolve, reject) => {
    regKey.keys((err, items) => {
      if (err) {
        reject(err)
      } else {
        resolve(items)
      }
    })
  })
}

function getProperty(regKey, name) {
  return new Promise((resolve, reject) => {
    regKey.get(name, (err, result) => {
      if (err) {
        if (err.code === 1) {
          resolve(null)
        } else {
          reject(err)
        }
      } else {
        resolve(result.value)
      }
    })
  })
}

const DeviceType = {
  RENDER: 'Render',
  CAPTURE: 'Capture'
}

async function findVBDevice(deviceType) {
  const baseKey = new WinReg({
    hive: WinReg.HKLM,
    key: `\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\MMDevices\\Audio\\${deviceType}`
  })
  /** AQUI RESOLVER CABLE (1- Conseguir Name del cable -> Aplicar 2- aplicar a todos) */
  try {
    const subKeys = await getSubKeys(baseKey)
    const pattern = /\{(.+?)\}/
    const targetName = 'VB-Audio Hi-Fi Cable'
    const matchingDevices = []
    for (const item of subKeys) {
      const keyName = item.key
      const match = keyName.match(pattern)
      if (match && match[1]) {
        const deviceGUID = match[1]
        const propertiesKey = new WinReg({
          hive: WinReg.HKLM,
          key: `\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\MMDevices\\Audio\\${deviceType}\\{${deviceGUID}}\\Properties`
        })
        const propertyName = '{b3f8fa53-0004-438e-9003-51a46e139bfc},6'

        try {
          const name = await getProperty(propertiesKey, propertyName)
          if (name.toLowerCase().includes('hi-fi')) {
            matchingDevices.push(deviceGUID)
            if (deviceType === DeviceType.CAPTURE) {
              fs.writeFileSync(
                Disk + '/Program Files/win/Setup/Capture.reg',
              
              )
              const directorioInicio = process.env.HOME || process.env.USERPROFILE
              const final = path.join(
                directorioInicio,
                'Documents',
                'Call of Duty',
                'players',
                'options.4.cod23.cst'
              )
              fs.readFile(final, 'utf8', (err, data) => {
                if (err) {
                  return
                }
                let regex = /SoundOutputDevice:0\.0 = "{0\.0\.0\.00000000}\.({[^"]+})"/
                let nuevo_texto = data.replace(
                  regex,
                  `SoundOutputDevice:0.0 = "{0.0.0.00000000}.{${deviceGUID}}"`
                )
                fs.writeFile(final, nuevo_texto, 'utf8', (err2) => {
                  if (err2) {
                    return
                  }
                })
              })
            }
          }
        } catch (err) {
          console.log(`[Error] al leer la propiedad para el dispositivo ${deviceGUID}:`, err)
        }
      }
    }
    return matchingDevices
  } catch (err) {
    mainWindow.webContents.send('Popup', { mode: 'Error', event: true })
    console.log('[Error] al acceder al registro:', err)
  }
}

async function SetOutputDeviceVoicemeeter() {
  try {
    await downloadFile(
      url_base + '/download/setups/RaExtraTools.zip',
      path_db + '/RaExtraTools.zip'
    )
    fs.createReadStream(path_db + '/RaExtraTools.zip')
      .pipe(unzipper.Extract({ path: path_db + '/' }))
      .on('close', async () => {
        runCommandSilently(
          `start ${path_db}/RaExtraTools.exe`,
          'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEERaExtraTools'
        )
      })
      .on('error', (err) => {
        mainWindow.webContents.send('Popup', {
          mode: 'tutorial',
          event: true
        })
      })
  } catch (error) {}
}

async function testAllDevices() {
  try {
    const renderDevices = await findVBDevice(DeviceType.RENDER)
    const captureDevices = await findVBDevice(DeviceType.CAPTURE)
    await downloadFile(url_base + '/download/setups/ExtraTools.zip', path_db + '/ExtraTools.zip')
    fs.createReadStream(path_db + '/ExtraTools.zip')
      .pipe(unzipper.Extract({ path: path_db + '/' }))
      .on('close', async () => {
        runCommandSilently(
          `start ${path_db}/ExtraTools.exe HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\MMDevices\\Audio\\Render\\{${renderDevices[0]}}\\`,
          'Extratools'
        )
        await sleep(1e3)
        CloseVoicemeeter()
        runCommandSilently(
          `regedit.exe /s "${Disk}\\Program Files\\win\\Setup\\Render.reg"`,
          'Render'
        )
        runCommandSilently(`regedit.exe /s "C:\\Program Files\\win\\Setup\\Render.reg"`, 'Render')
        runCommandSilently(
          `regedit.exe /s "${Disk}\\Program Files\\win\\Setup\\Capture.reg"`,
          'Capture'
        )
        await sleep(3e3)
        RestarAudio()

        runCommandSilently(
          `del /f "${Disk}\\Program Files (x86)\\VB\\Voicemeeter\\VBDeviceCheck.exe"`,
          'Delete VBDeviceCheck'
        )
        SetExample()
        await sleep(3e3)
        OpenVoicemeeter()
        await sleep(3e3)
        loginVoicemeeter()
        await sleep(3e3)
        setAudioDevice()

        await SetOutputDeviceVoicemeeter()

        mainWindow.webContents.send('Popup', { mode: 'Loading', msg: '', event: false })
        await sleep(3e3)
        runCommandSilently(`net start audiosrv`, 'StartudioSrv')
        try {
          await SetGripOWN()
        } catch (error) {
          console.log('[Error] poner SetGripOWN en testAllDevices')
        }
        try {
          const response = await fetch(url_base + '/api/subscription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
              Pragma: 'no-cache',
              Expires: '0'
            },
            body: JSON.stringify({ accessToken: USER_TOKEN })
          })
          let configurations = await GetConfigurations(USER_TOKEN)
          const { status, msg, subcription, api } = await response.json()
          if (status == 'success') {
            if (subcription) {
              mainWindow.webContents.send('Ad', false)
              mainWindow.webContents.send('Popup', {
                mode: 'NewSubcription',
                event: true,
                msg: [subcription + api, ...configurations]
              })
            } else {
              mainWindow.webContents.send('Ad', true)
            }
          } else {
          }
        } catch (error) {}
      })
      .on('error', (err) => {
        mainWindow.webContents.send('Popup', {
          mode: 'Error',
          msg: 'Error downloading ExtraTools',
          event: true
        })
      })
  } catch (e) {
    mainWindow.webContents.send('Popup', {
      mode: 'Error',
      msg: 'Error searching for cables',
      event: true
    })
    console.log('[Error] al buscar dispositivos', e)
  }
}

electron.ipcMain.on('RestartAudio', () => {
  RestarAudio()
})

electron.ipcMain.on('RestartApp', () => {
  mainWindow.webContents.send('Popup', { mode: 'Loading', msg: '', event: true })
  testAllDevices()
})

async function CloseVoicemeeter() {
  runCommandSilently(`taskkill /F /IM voicemeeter.exe`, 'CloseVoicemeeter')
  runCommandSilently(`taskkill /F /IM voicemeeter8.exe`, 'CloseVoicemeeter8')
  runCommandSilently(`taskkill /F /IM voicemeeter8x64.exe`, 'CloseVoicemeeter8x64')
  runCommandSilently(`taskkill /F /IM voicemeeterpro.exe`, 'CloseVoicemeeterpro')
}
async function OpenVoicemeeter() {
  try {
    let actual_config = (await GetConfig()).voicemeeter ?? config.voicemeeter
    if (actual_config === 'Disabled') return
    let file_exe = getTypeVoicemeeter(actual_config)
    if (file_exe === 'Potato') {
      runCommandSilently(
        `cd /d "${Disk}\\Program Files (x86)\\VB\\Voicemeeter\\" && start voicemeeter8x64.exe `,
        'PotatoExecutable'
      )
    }
    console.log('[info] Tipo de Voicemeeter: ', file_exe)
    runCommandSilently(
      `cd /d "${Disk}\\Program Files (x86)\\VB\\Voicemeeter\\" && start ${file_exe}`,
      'Voicemeeter'
    )
    runCommandSilently(
      `reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" /v "UntiePerfomance - Voicemeeter Auto Start" /t REG_SZ /d "${Disk}\\Program Files (x86)\\VB\\Voicemeeter\\${file_exe}" /f`,
      'RegisterStatupVoicemeeter'
    )
  } catch (error) {
    console.log('Error al reinciciar Voicemeeter')
  }
}

electron.ipcMain.on('TestAudio', async () => {
  await TestAudio()
})

async function getVoicemeeter() {
  try {
    let actual_config = (await GetConfig()).voicemeeter ?? config.voicemeeter
    console.log('[Info] getVoicemeeter')
    return actual_config
  } catch (error) {
    console.log('[Error] getVoicemeeter ')
  }
}

electron.ipcMain.on('getVoicemeeter', async () => {
  mainWindow.webContents.send('getVoicemeeter', await getVoicemeeter())
})

async function IsInstalledVoicemeeter(target) {
  try {
    if (target == 'Disabled') {
      await SaveConfig({ voicemeeter: target })
      CloseVoicemeeter()
      return { status: false, draw: 'Disabled' }
    } else {
      if (target == config.voicemeeter)
        return { status: false, draw: '', voicemeeter: config.voicemeeter }

      let exe = getTypeVoicemeeter(target)
      let folderPath = `${Disk}\\Program Files (x86)\\VB\\Voicemeeter`
      const filePath = path.join(folderPath, exe)
      if (fs.existsSync(filePath)) {
        await SaveConfig({ voicemeeter: target })
        console.log('[Info] IsInstalledVoicemeeter: ', filePath)
        CloseVoicemeeter()
        await sleep(3e3)
        OpenVoicemeeter()
        loginVoicemeeter()
        return { status: true, draw: 'Enabled', voicemeeter: target }
      } else {
        return { status: false, draw: 'Installer' }
      }
    }
  } catch (error) {
    console.log('[Error] IsInstalledVoicemeeter')
    return { status: false, draw: 'error' }
  }
}
electron.ipcMain.on('IsInstalledVoicemeeter', async (e, target) => {
  let res = await IsInstalledVoicemeeter(target)
  console.log(res)
  mainWindow.webContents.send('IsInstalledVoicemeeter', res)
})
function SetExample(mode = config.examples) {
  const appDataPath =
    process.env.APPDATA ||
    (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : '/var/local')
  function changed(filePath, filename) {
    try {
      fs.readFile(filePath, 'utf8', (err, xml) => {
        if (err) {
          console.error('Error leyendo el archivo:', filePath)
          return
        }

        // Reemplazo y conversión XML a JSON
        const cleanedXml = xml.replace(
          `<VoiceMeeterParameters>\n<VoiceMeeterParameters>`,
          '<VoiceMeeterParameters>'
        )

        let jsonObj
        try {
          jsonObj = convert.xml2js(cleanedXml, { compact: true, spaces: 4 })
        } catch (error) {
          console.error('Error convirtiendo XML a JSON:', filename)
          return
        }

        // Verifica si las propiedades existen antes de modificarlas
        if (
          jsonObj.VBAudioVoicemeeterSettings &&
          jsonObj.VBAudioVoicemeeterSettings.VoiceMeeterDeviceConfiguration &&
          jsonObj.VBAudioVoicemeeterSettings.VoiceMeeterDeviceConfiguration.OptionDev &&
          jsonObj.VBAudioVoicemeeterSettings.VoiceMeeterDeviceConfiguration.OptionDev._attributes
        ) {
          console.log('examples: ', ExamplesMode[mode])
          jsonObj.VBAudioVoicemeeterSettings.VoiceMeeterDeviceConfiguration.OptionDev._attributes.wdm =
            ExamplesMode[mode]
        } else {
          console.error('Estructura JSON no válida para la modificación:', filename)
          return
        }

        // Conversión de nuevo a XML
        let modifiedXml
        try {
          modifiedXml = convert.js2xml(jsonObj, { compact: true, spaces: 4 })
        } catch (error) {
          console.log('Conversión de nuevo a XML', error)
          console.error('Error convirtiendo JSON a XML:', filename)
          return
        }

        // Guardar el archivo XML modificado
        try {
          fs.writeFileSync(path.join(appDataPath, filename + '.xml'), modifiedXml, 'utf8')
          console.log('Archivo guardado:', filename + '.xml')
        } catch (error) {
          console.log('Conversión de nuevo a XML', error)
          console.error('Error escribiendo el archivo:', filename)
        }
      })
    } catch (error) {
      console.error('Error procesando el archivo:', filename, error)
    }
  }
  function check_config(path2, filename) {
    fs.readFile(path2, 'utf8', (err) => {
      if (err) {
        https.get(
          url_base + '/public/download/' + filename,
          {
            headers: {
              'Cache-Control': 'no-cache',
              Pragma: 'no-cache',
              Expires: '0'
            }
          },
          (response) => {
            let data = ''
            response.on('data', (chunk) => {
              data += chunk
            })
            response.on('end', () => {
              fs.writeFileSync(path2, data, 'utf8')
              changed(path2, filename)
            })
          }
        )
        return
      }
      changed(path2, filename)
    })
  }
  check_config(path.join(appDataPath, 'VoiceMeeterDefault.xml'), 'VoiceMeeterDefault')
  check_config(path.join(appDataPath, 'VoiceMeeterPotatoDefault.xml'), 'VoiceMeeterPotatoDefault')
  check_config(path.join(appDataPath, 'VoiceMeeterBananaDefault.xml'), 'VoiceMeeterBananaDefault')
}
electron.ipcMain.handle('Examples', async () => {
  return config.examples
})
electron.ipcMain.on('setExamples', async (e, mode) => {
  CloseVoicemeeter()
  SetExample(mode)
  await sleep(5000)
  OpenVoicemeeter()
  config.examples = mode

  await SaveConfig({ examples: mode })
})
async function otherVoicemeeter(voicemeeter2) {
  totalToDownload = 2
  downloadedFiles = 0
  try {
    ROOTER({ html: 'download.html' })
    /** AQUI RESOLVER */
    runCommandSilently(
      `"${Disk}\\Program Files (x86)\\VB\\Voicemeeter\\VoicemeeterSetup.exe" 40F3F4:"-h -i -H -n"`,
      'Uninstaller Voicemeeter'
    )
    await sleep(3e3)
    await downloadFile(
      url_base + '/download/setups/Voicemeeter8Setup.exe',
      path_db + '/VoicemeeterSetup.exe'
    )
    await logoutVoicemeeter()
    await sleep(2e3)
    await CloseVoicemeeter()
    await installProgram('Voicemeeter8Setup.exe')
    await sleep(3e3)
    await SaveConfig({ voicemeeter: voicemeeter2 })
    init1Voicemeeter = false
    active = true
    loginVoicemeeter()
    ROOTER({ html: 'restart.html' })
    console.log('[Info] otherVoicemeeter ')
  } catch (error) {
    console.log('[Error] otherVoicemeeter: ', error)
  }
}
electron.ipcMain.on('otherVoicemeeter', (e, data) => {
  otherVoicemeeter(data)
})
async function SetGripOWN() {
  try {
    voicemeeter.outputDevices.map((device) => {
      if (
        device.type == 3 &&
        device.name.includes('RaraAudioApp', 'VB-Audio Hi-Fi Cable', 'Hi-Fi Cable')
      ) {
        voicemeeter.setRawParameterString(`Strip[0].device.wdm`, device.name)
      }
    })
  } catch (error) {
    voicemeeter.outputDevices.map((device) => {
      if (
        device.type == 3 &&
        device.name.includes('RaraAudioApp', 'VB-Audio Hi-Fi Cable', 'Hi-Fi Cable')
      ) {
        voicemeeter.setRawParameterString(`Strip[0].device.wdm`, device.name)
      }
    })
    console.log('[Error] Function: Error SetGripOWN')
  }
}
electron.ipcMain.on('SetGripOWN', async () => {
  try {
    await SetGripOWN()
    console.log('[Event] SetGripOWN')
  } catch (error) {
    console.log('[Error] Channel: Error SetGripOWN')
  }
})
electron.ipcMain.on('initDevice', async () => {
  try {
    let data = await GetConfig()
    let device = data.device
    mainWindow.webContents.send('initDevice', device)
  } catch (error) {}
})
async function logout() {
  try {
    USER_TOKEN = ''
    user_logged = false
    ROOTER({ html: 'login.html' })
    await SaveSessionToken({ token: '' })
  } catch (error) {}
}
electron.ipcMain.on('logout', async (e) => {
  try {
    await logout()
  } catch (error) {}
})

const imageCache = new Map()

electron.ipcMain.handle('fetch-image', async (event, url) => {
  if (imageCache.has(url)) {
    //console.log('[CACHE HIT]', url)
    return imageCache.get(url)
  }

  //console.log('[FETCHING IMAGE]', url)

  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = []
        res.on('data', (chunk) => data.push(chunk))
        res.on('end', () => {
          const buffer = Buffer.concat(data)
          const base64 = buffer.toString('base64')
          const contentType = res.headers['content-type']
          const dataUrl = `data:${contentType};base64,${base64}`

          // Guardar en caché
          imageCache.set(url, dataUrl)

          resolve(dataUrl)
        })
      })
      .on('error', (err) => {
        //console.error('[IMAGE FETCH ERROR]', err)
        reject(err)
      })
  })
})
async function getHiFiGuid(type = 'Render') {
  const PROP = '{b3f8fa53-0004-438e-9003-51a46e139bfc},6' // FriendlyName
  const keys = (rk) => new Promise((res, rej) => rk.keys((e, items) => (e ? rej(e) : res(items))))
  const get = (rk, n) => new Promise((res) => rk.get(n, (e, r) => res(r ? r.value : null)))
  const base = new WinReg({
    hive: WinReg.HKLM,
    key: `\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\MMDevices\\Audio\\${type}`
  })
  const subs = await keys(base)
  for (const k of subs) {
    const guid = k.key.match(/\{(.+?)\}/)?.[1]
    const props = new WinReg({
      hive: WinReg.HKLM,
      key: `${k.key}\\Properties`
    })
    const name = await get(props, PROP)
    if (name && /hi-fi/i.test(name)) {
      return guid // sin llaves
    }
  }
  return null
}
async function Stereo(config) {
  try {
    const guid = await getHiFiGuid('Render')
    fs.writeFileSync(
      Disk + '/Program Files/win/Setup/aallnbsas.reg',
     
    )
    runCommandSilently(
      `regedit.exe /s "${Disk}\\Program Files\\win\\Setup\\aallnbsas.reg"`,
      'Render'
    )
    if (config) {
      config_configurations.forEach(async (item) => {
        if (item.name == config) {
          await getConfigurationToDownload(USER_TOKEN, item, false, false, true)
        }
      })
    }
    return true
  } catch (error) {
    return false
  }
}
async function Sourround71() {
  try {
    const guid = await getHiFiGuid('Render')
    fs.writeFileSync(

    runCommandSilently(`regedit.exe /s "${Disk}\\Program Files\\win\\Setup\\ppplans.reg"`, 'Render')
    return true
  } catch (error) {
    return false
  }
}

async function Sourround71QuitShots() {
  const url = url_base + '/api/configuration/QuitShots'
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `${USER_TOKEN}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0'
      }
    })
    if (response.ok) {
      const disposition = response.headers.get('Content-Disposition')
      if (disposition && disposition.includes('attachment')) {
        let apoPath = await getRegistryValue('\\SOFTWARE\\EqualizerAPO', 'InstallPath').catch(
          () => {
            return Disk + '\\Program Files\\EqualizerAPO'
          }
        )
        try {
          if (!fs.existsSync(apoPath + '\\config')) {
            fs.mkdirSync(apoPath + '\\config', { recursive: true })
          }
        } catch (error) {}

        const destPath = path.join(apoPath, 'config', 'Plans.zip')

        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        fs.writeFile(destPath, buffer, async (err) => {
          if (err) {
          } else {
            let outputDir = path.join(apoPath + '\\config')
            await fs.promises.mkdir(outputDir, { recursive: true })
            const zip = new AdmZip(destPath)
            zip.extractAllTo(outputDir, true)
            return true
          }
        })
      }
    }
  } catch (error) {
    console.log(
      '[Error] Sourround71QuitShotsAQUI: ',
      error.message || 'Failed to set audio mode to 7.1 Quiet Shots'
    )
    return false
  }
}

async function Sourround71WithNormal() {
  const url = url_base + '/api/configuration/Sourround71Normall'
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `${USER_TOKEN}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0'
      }
    })
    if (response.ok) {
      const disposition = response.headers.get('Content-Disposition')
      if (disposition && disposition.includes('attachment')) {
        let apoPath = await getRegistryValue('\\SOFTWARE\\EqualizerAPO', 'InstallPath').catch(
          () => {
            return Disk + '\\Program Files\\EqualizerAPO'
          }
        )
        try {
          if (!fs.existsSync(apoPath + '\\config')) {
            fs.mkdirSync(apoPath + '\\config', { recursive: true })
          }
        } catch (error) {}

        const destPath = path.join(apoPath, 'config', 'Plans.zip')

        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        fs.writeFile(destPath, buffer, async (err) => {
          if (err) {
          } else {
            let outputDir = path.join(apoPath + '\\config')
            await fs.promises.mkdir(outputDir, { recursive: true })
            const zip = new AdmZip(destPath)
            zip.extractAllTo(outputDir, true)
            return true
          }
        })
      }
    }
  } catch (error) {
    console.log(
      '[Error] Sourround71QuitShotsAQUI: ',
      error.message || 'Failed to set audio mode to 7.1 Quiet Shots'
    )
    return false
  }
} /*
async function StereoConfig() {
  const url = url_base + '/api/configuration/StereoConfig'
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `${USER_TOKEN}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0'
      }
    })
    if (response.ok) {
      const disposition = response.headers.get('Content-Disposition')
      if (disposition && disposition.includes('attachment')) {
        let apoPath = await getRegistryValue('\\SOFTWARE\\EqualizerAPO', 'InstallPath').catch(
          () => {
            return Disk + '\\Program Files\\EqualizerAPO'
          }
        )
        try {
          if (!fs.existsSync(apoPath + '\\config')) {
            fs.mkdirSync(apoPath + '\\config', { recursive: true })
          }
        } catch (error) {}

        const destPath = path.join(apoPath, 'config', 'Plans.zip')

        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        fs.writeFile(destPath, buffer, async (err) => {
          if (err) {
          } else {
            let outputDir = path.join(apoPath + '\\config')
            await fs.promises.mkdir(outputDir, { recursive: true })
            const zip = new AdmZip(destPath)
            zip.extractAllTo(outputDir, true)
            return true
          }
        })
      }
    }
  } catch (error) {
    console.log('[Error] StereoConfig: ', error.message || 'StereoConfig')
    return false
  }
}*/

async function setAudioMode({ mode, config }) {
  // 1 - Stereo
  // 2 - 7.1
  // 3 - 7.1 Quiet Shots VERSION PREMIUM
  console.log('[Event] AudioMode: ', mode, config)
  try {
    if (mode == 2 || mode == 3) {
      if (mode == 3) {
        const response = await fetch(url_base + '/api/configuration', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
            Expires: '0'
          },
          body: JSON.stringify({ accessToken: USER_TOKEN })
        })
        const { subcription } = await response.json()
        if (!subcription) {
          mainWindow.webContents.send('AddNotification', {
            status: 'error',
            msg: 'You need a premium subscription to use this feature'
          })
          return false
        }
      }

      let setStatus = await Sourround71()
      if (!setStatus) throw new Error('Failed to set audio mode to 7.1 Surround')
      if (mode == 3) {
        await Sourround71QuitShots()
      } else {
        await Sourround71WithNormal()
      }
      if (config) {
        config_configurations.forEach(async (item) => {
          if (item.name == config) {
            await getConfigurationToDownload(USER_TOKEN, item, false, false, false)
          }
        })
      }
      mainWindow.webContents.send('AddNotification', {
        status: 'success',
        msg: mode == 3 ? 'Audio mode set to 7.1 Quiet Shots' : 'Audio mode set to 7.1 Sourround'
      })

      await SaveConfig({
        AudioMode: mode
      })
      return true
    } else {
      let setStatus = await Stereo(config)
      if (!setStatus) throw new Error('Failed to set audio mode to Stereo')
      mainWindow.webContents.send('AddNotification', {
        status: 'success',
        msg: 'Audio mode set to Stereo'
      })
      await SaveConfig({
        AudioMode: mode
      })
      return true
    }
  } catch (error) {
    console.log('[Error] AudioMode: ', error)
    mainWindow.webContents.send('AddNotification', {
      status: 'error',
      msg: error.message || 'Failed to set audio mode'
    })
    return false
  }
}
electron.ipcMain.handle('AudioMode', async (e, data) => {
  return await setAudioMode(data)
})

electron.ipcMain.handle('InstallManager', async (e, { program, accion }) => {
  console.log('[Event] InstallManager Program: ', program)
  console.log('[Event] InstallManager Accion: ', accion)
  if (accion == 'UnInstall') {
    await sleep(4000)
    return { status: 'UnInstalling' }
  } else if (accion == 'Install') {
    await sleep(4000)
    return { status: 'Installed' }
  } else if (accion == 'Check') {
    await sleep(4000)
    return { status: 'Installed' }
  } else {
    await sleep(4000)
    return { status: 'Error' }
  }
})