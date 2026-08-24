import { ChatPanel } from '../components/ChatPanel'
import { WebcamFrame } from '../components/WebcamFrame'
import { Brand } from '../components/Brand'

export function InGameScene() {
  return (
    <main className="overlay overlay--ingame">
      <WebcamFrame mode="ingame" />
      <ChatPanel compact />
      <div className="ingame-signature" aria-hidden="true">
        <Brand compact />
        <span className="vision-mark" />
      </div>
    </main>
  )
}
