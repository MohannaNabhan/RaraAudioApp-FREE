import { useState, useEffect } from 'react'
import ExamplesBtn from '@/components/others/ExamplesBtn'

export default function Examples({ List }) {
  // Default = 0 | X0.2 =  1 | X0.3 =  2 | X0.4 =  3
  const [isMode, setMode] = useState(
    localStorage.getItem('Examples') ? localStorage.getItem('Examples') : 0
  )

  useEffect(() => {
    if (isMode == null) return
    if (isMode < 0 || isMode > 3) return
    
    localStorage.setItem('Examples', isMode)
    window.api.ipcRenderer.send('setExamples', isMode)
  }, [isMode])

  useEffect(() => {
    window.api.ipcRenderer.invoke('Examples', (n) => {
      setMode(n)
    })
  }, [])

  return (
    <div className="flex items-center flex-col justify-center">
      <h1 className="text-sm font-medium text-center mt-6 mb-3">Fix static</h1>
      <div className="flex  items-center content-normal justify-center h-12 w-2/4 rounded-md select-none ">
        <ExamplesBtn Is={isMode} Set={setMode} Target="0" Text="256" className="!rounded-l-lg" />
        <ExamplesBtn Is={isMode} Set={setMode} Target="1" Text="512" />
        <ExamplesBtn Is={isMode} Set={setMode} Target="2" Text="1024" className="!rounded-r-lg" />
      </div>
    </div>
  )
}
