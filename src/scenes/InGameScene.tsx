import { ChatPanel } from '../components/ChatPanel'
import { DonationReminder, LivePixDock } from '../components/SupportWidgets'
import { WebcamFrame } from '../components/WebcamFrame'

export function InGameScene() {
  return (
    <main className="overlay overlay--ingame">
      <ChatPanel compact />
      <WebcamFrame mode="ingame" />
      <LivePixDock mode="ingame" />
      <DonationReminder mode="ingame" />
    </main>
  )
}
