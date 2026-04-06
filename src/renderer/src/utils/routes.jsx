import Page404 from '@/pages/404.jsx'
import HomePage from '@/pages/index.jsx'
import RepairPage from '@/pages/Repair.jsx'
import VoicemeeterPage from '@/pages/Voicemeeter.jsx' 
export const ROUTES = [
  { path: '/', Component: HomePage },
  { path: '/Repair', Component: RepairPage },
  { path: '/Voicemeeter', Component: VoicemeeterPage }
]

export { Page404 }
