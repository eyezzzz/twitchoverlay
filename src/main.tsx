import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/tokens.css'
import './styles/global.css'
import './styles/overlay.css'
import './styles/client-fit.css'
import './styles/client-motion.css'
import './styles/transitions.css'
import './styles/ingame.css'
import './styles/support-widgets.css'
import './debug'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
