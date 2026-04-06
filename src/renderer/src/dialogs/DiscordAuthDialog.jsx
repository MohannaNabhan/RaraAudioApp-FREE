import { useEffect, useRef, useState } from 'react'
import CloseIcon from '@/icons/window/CloseIcon'
import DiscordIcon from '@/icons/social/DiscordIcon'

function DiscordAuthDialog() {
  const webviewRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isloading, setIsLoading] = useState(false)

  const URL_AUTH_DISCORD =
    'https://discord.com/oauth2/authorize?client_id=1307063298859991040&response_type=code&redirect_uri=https%3A%2F%2Fshop.raraaudioapp.com%2FAppLogin&scope=identify+email'

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
    } else {
      const timeout = setTimeout(() => setIsAnimating(false), 300) // Duración de la animación
      return () => clearTimeout(timeout)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const timeout = setTimeout(() => {
      const webview = webviewRef.current
      if (!webview) return

      setIsLoading(true)

      const handleDidNavigate = (event) => {
        const urlObj = new URL(event.url)
        const code = urlObj.searchParams.get('code')
        const error = urlObj.searchParams.get('error')
        if (code) {
          setIsOpen(false)
          window.api.ipcRenderer.send('DiscordAuth', code)
        } else if (error) {
          setIsOpen(false)
        }
      }

      webview.addEventListener('did-navigate', handleDidNavigate)
      return () => {
        webview.removeEventListener('did-navigate', handleDidNavigate)
      }
    }, 100)

    return () => clearTimeout(timeout)
  }, [isOpen])

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn !px-0 !py-0 size-12     !flex !justify-center !items-center !rounded-full"
      >
        <DiscordIcon className="fill-blue-500 size-9" />
      </button>

      {isAnimating && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center rounded-md bg-black/70 transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div
            className={`w-[900px] h-[630px] flex flex-col justify-end items-center transition-transform duration-300 ${
              isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
            }`}
          >
            <button
              className="flex mb-2 btn  border-white/60  !px-8   transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <CloseIcon />
            </button>
            <webview
              className={`overflow-hidden w-full h-full _no_move rounded-lg bg-black/50 ${!isloading && 'animate-pulse'}  `}
              ref={webviewRef}
              src={URL_AUTH_DISCORD}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default DiscordAuthDialog
