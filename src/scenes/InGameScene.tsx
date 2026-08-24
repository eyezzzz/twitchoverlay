import { ChatPanel } from '../components/ChatPanel'
import { WebcamFrame } from '../components/WebcamFrame'

export function InGameScene() {
  return (
    <main className="overlay overlay--ingame">
      <WebcamFrame mode="ingame" />
      <ChatPanel compact />
    </main>
  )
}
