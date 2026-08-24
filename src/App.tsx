import { ClientScene } from './scenes/ClientScene'
import { InGameScene } from './scenes/InGameScene'
import { TransitionScene } from './scenes/TransitionScene'

function normalizePath(pathname: string) {
  return pathname.replace(/\/+$/, '') || '/'
}

export default function App() {
  const path = normalizePath(window.location.pathname)

  if (path === '/ingame') return <InGameScene />
  if (path === '/starting') return <TransitionScene mode="starting" />
  if (path === '/brb') return <TransitionScene mode="brb" />
  if (path === '/ending') return <TransitionScene mode="ending" />
  if (path === '/stinger') return <TransitionScene mode="stinger" />
  return <ClientScene />
}
