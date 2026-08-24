import type { CSSProperties } from 'react'

type DonationReminderProps = {
  mode: 'client' | 'ingame'
}

export function LivePixDock({ mode }: { mode: 'client' | 'ingame' }) {
  return (
    <div className={`livepix-dock livepix-dock--${mode}`} aria-hidden="true">
      <span className="livepix-dock__corner livepix-dock__corner--tl" />
      <span className="livepix-dock__corner livepix-dock__corner--br" />
      <span className="livepix-dock__label">LIVEPIX</span>
    </div>
  )
}

const reminders = [
  <>APOIE A LIVE <strong>livepix.gg/fietz</strong></>,
  <>CURTIU A LIVE? <strong>FORTALEÇA O PROJETO</strong></>,
  <>SEU APOIO AJUDA A <strong>MANTER A STREAM</strong></>,
]

export function DonationReminder({ mode }: DonationReminderProps) {
  return (
    <div className={`donation-reminder donation-reminder--${mode}`} aria-hidden="true">
      <span className="donation-reminder__dot" />
      <div className="donation-reminder__messages">
        {reminders.map((message, index) => (
          <span
            className="donation-reminder__message"
            key={index}
            style={{ '--reminder-index': index } as CSSProperties}
          >
            {message}
          </span>
        ))}
      </div>
    </div>
  )
}
