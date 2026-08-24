import { ChatPanel } from '../components/ChatPanel'
import { ClientChrome } from '../components/ClientChrome'
import { WebcamFrame } from '../components/WebcamFrame'

export function ClientScene() {
  return (
    <main className="overlay overlay--client">
      <ClientChrome />
      <WebcamFrame mode="client" />
      <ChatPanel />
    </main>
  )
}
