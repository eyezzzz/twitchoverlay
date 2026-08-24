import { ChatPanel } from '../components/ChatPanel'
import { WebcamFrame } from '../components/WebcamFrame'

function InstagramIcon() {
  return (
    <span className="ingame-socials__instagram" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" focusable="false">
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.4" cy="6.7" r="1.15" fill="currentColor" />
      </svg>
    </span>
  )
}

export function InGameScene() {
  return (
    <main className="overlay overlay--ingame">
      <ChatPanel compact />
      <WebcamFrame mode="ingame" />

      <footer className="ingame-socials" aria-hidden="true">
        <div className="ingame-socials__item">
          <span className="ingame-socials__platform">X</span>
          <span>@fietzlol</span>
        </div>
        <span className="ingame-socials__divider" />
        <div className="ingame-socials__item ingame-socials__item--instagram">
          <InstagramIcon />
          <span>@fietzlol</span>
        </div>
      </footer>
    </main>
  )
}
