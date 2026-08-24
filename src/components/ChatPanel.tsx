import { useMemo } from 'react'

type ChatMessage = {
  id: number
  user: string
  text: string
  accent?: boolean
}

const demoMessages: ChatMessage[] = [
  { id: 1, user: 'RakinDoSuporte', text: 'salve!' },
  { id: 2, user: 'leonamain', text: 'bora duo' },
  { id: 3, user: 'user123', text: 'support diff' },
  { id: 4, user: 'MainNami', text: 'visão é tudo' },
  { id: 5, user: 'junglegap', text: 'kkkkkkkkk' },
  { id: 6, user: 'fietzlol', text: 'vlw pelo apoio!', accent: true },
  { id: 7, user: 'supdiff', text: 'gg' }
]

function demoEnabled() {
  return new URLSearchParams(window.location.search).get('demo') === '1'
}

export function ChatPanel({ compact = false }: { compact?: boolean }) {
  const demo = useMemo(demoEnabled, [])
  const messages = demo ? demoMessages : []

  return (
    <aside className={`chat-panel ${compact ? 'chat-panel--compact' : ''}`}>
      <header className="chat-panel__header">
        <span className="live-dot" />
        <span>LIVE CHAT</span>
      </header>

      <div className="chat-panel__messages">
        {messages.map(message => (
          <div className="chat-message" key={message.id}>
            <span className={`chat-message__user ${message.accent ? 'is-accent' : ''}`}>
              {message.user}
            </span>
            <span className="chat-message__text">{message.text}</span>
          </div>
        ))}
      </div>

      <footer className="chat-panel__footer">
        <span />
        <span />
        <span />
      </footer>
    </aside>
  )
}
