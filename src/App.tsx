import { ClientScene } from './scenes/ClientScene'
import { InGameScene } from './scenes/InGameScene'

function normalizePath(pathname: string) {
  return pathname.replace(/\/+$/, '') || '/'
}

export default function App() {
  const path = normalizePath(window.location.pathname)

  if (path === '/ingame') return <InGameScene />
  return <ClientScene />
}
