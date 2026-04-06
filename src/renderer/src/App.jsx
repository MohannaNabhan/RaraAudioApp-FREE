import { Router } from '@/components/functions/Router.jsx'
import { ROUTES, Page404 } from '@/utils/routes.jsx'
import WindowsTopbar from '@/components/window/WindowsTopbar.jsx'
import Windowsback from '@/components/window/Windowsback.jsx'
import WindowContent from '@/components/window/WindowContent.jsx'
import { useEffect, useState, useContext } from 'react' 


export default function App() {
  const [isActualPath, setActualPath] = useState('/')

  useEffect(() => {
    const ROOTER = (event) => {
      setActualPath(event)
    }
    window.api.ipcRenderer.on('ROOTER', ROOTER)
  }, [])

  return (
    <Windowsback>
      <WindowsTopbar />
      <WindowContent>
        <Router
          routes={ROUTES}
          defaultComponent={Page404}
          Is={isActualPath}
          Set={setActualPath}
        ></Router>
      </WindowContent>
    </Windowsback>
  )
}
