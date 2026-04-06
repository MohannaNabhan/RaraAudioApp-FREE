import ReactDOM from 'react-dom/client'
import WindowBack from '@/components/window/Windowsback'
import WindowTop from '@/components/window/WindowsTopbar'
import LogoCompleted from '@/icons/LogoCompleted'
import { APP } from '@/utils/consts.js'
import '@/assets/output.css'
import '@fontsource-variable/montserrat'
import { useState } from 'react'
import InputBox from '@/components/others/InputBox.jsx'
import Cooldown from '@/components/others/Cooldown.jsx'
import DiscordAuthDialog from '@/dialogs/DiscordAuthDialog'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [generalError, setGeneralError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isButtonLoginBlocked, setButtonLoginBlocked] = useState(false)

  const HandleLoginButton = () => {
    setEmailError('')
    setPasswordError('')
    setGeneralError('')
    setSuccessMessage('')

    let valid = true

    // Validaciones antes de enviar el formulario
    if (!email) {
      setEmailError('Please enter your email')
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Invalid email format')
      valid = false
    }

    if (!password) {
      setPasswordError('Please enter your password')
      valid = false
    } else if (password.length < 4) {
      setPasswordError('Password must be at least 4 characters')
      valid = false
    }

    if (!valid) return

    setButtonLoginBlocked(true)

    window.api.ipcRenderer.invoke('login', { email, password }).then((data) => {
      if (data.status != 'success') return setGeneralError(data.msg), setButtonLoginBlocked(false)
      setSuccessMessage(data.msg)
      setTimeout(() => {
        setButtonLoginBlocked(false)
      }, 8000)
    })
  }

  return (
    <WindowBack>
      <WindowTop />
      <div className="w-full flex h-[calc(100%-50px)] items-center mt-16 justify-center">
        <div className="w-[60%] h-full flex flex-col gap-y-10 items-center justify-center md:px-20">
          <div className="w-full">
            {/* Logo */}
            <div className="w-full h-50 mb-10 overflow-hidden flex justify-center">
              <LogoCompleted className="h-32 _move hidden md:block" />
            </div>

            {/* Título */}
            <h1 className="w-full text-4xl font-semibold">Sign In</h1>
            <p className="mb-5">Welcome to Rara Audio App.</p>

            {/* Mensajes de error o éxito */}
            {generalError && (
              <p className="text-red-500 text-sm text-center mb-4">{generalError}</p>
            )}
            {successMessage && (
              <p className="text-green-500 text-sm text-center mb-4">{successMessage}</p>
            )}

            {/* Input Email */}
            <InputBox
              Set={setEmail}
              Is={email}
              label="Email"
              placeHolder="Email"
              type="email"
              className="mb-2"
              maxLength={255}
            />
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

            {/* Input Password */}
            <InputBox
              Set={setPassword}
              Is={password}
              label="Password"
              placeHolder="Password"
              maxLength={50}
              type="password"
              className="mb-2"
            />
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}

            {/* Opciones de login */}
            <div className="flex mt-5 flex-col gap-5 md:flex-row justify-between items-center md:items-start">
              <div className="flex gap-x-3">
                <DiscordAuthDialog />
              </div>
              <a href={APP.url + '/resetpassword'} target="_blank" className="text-red-400 text-sm">
                Forgot Password
              </a>
            </div>

            {/* Botón de login */}
            <div className="flex flex-col justify-center md:justify-end items-center md:items-end">
              <Cooldown Is={isButtonLoginBlocked} className="btn !h-auto !py-3">
                <button
                  className="btn !text-base !py-2 !px-16 mb-5"
                  onClick={() => HandleLoginButton()}
                  disabled={isButtonLoginBlocked}
                >
                  Sign&nbsp;In
                </button>
              </Cooldown>
              <a href={APP.url + '/register'} target="_blank" className="text-sm">
                Don't have an account?
                <strong className="text-red-400"> SIGN UP</strong>
              </a>
            </div>
          </div>
        </div>
      </div>
    </WindowBack>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<Login />)
