import { useEffect, useMemo, useState } from 'react'

type ChatMessage = {
  id: string
  platform: 'twitch'
  user: string
  login?: string
  text: string
  color?: string
  broadcaster?: boolean
  timestamp: number
}

const VISIBLE_CHAT_MESSAGES = 12

const demoMessages: ChatMessage[] = [
  { id: '1', platform: 'twitch', user: 'RakinDoSuporte', text: 'salve!', timestamp: 1 },
  { id: '2', platform: 'twitch', user: 'leonamain', text: 'bora duo', timestamp: 2 },
  { id: '3', platform: 'twitch', user: 'user123', text: 'support diff', timestamp: 3 },
  { id: '4', platform: 'twitch', user: 'MainNami', text: 'visão é tudo', timestamp: 4 },
  { id: '5', platform: 'twitch', user: 'junglegap', text: 'kkkkkkkkk', timestamp: 5 },
  { id: '6', platform: 'twitch', user: 'fietzlol', text: 'vlw pelo apoio!', broadcaster: true, timestamp: 6 },
  { id: '7', platform: 'twitch', user: 'supdiff', text: 'gg', timestamp: 7 },
]

function demoEnabled() {
  return new URLSearchParams(window.location.search).get('demo') === '1'
}

function safeUserColor(color?: string) {
  return color && /^#[0-9a-f]{6}$/i.test(color) ? color : undefined
}

export function ChatPanel({ compact = false }: { compact?: boolean }) {
  const demo = useMemo(demoEnabled, [])
  const [messages, setMessages] = useState<ChatMessage[]>(demo ? demoMessages : [])

  useEffect(() => {
    if (demo) return

    let active = true
    let timer: number | undefined

    const loadMessages = async () => {
      try {
        const response = await fetch('/api/chat/messages', { cache: 'no-store' })
        if (!response.ok) return

        const payload = await response.json() as { messages?: ChatMessage[] }
        if (!active) return

        const next = (payload.messages || [])
          .filter(message => message?.id && message?.text)
          .sort((a, b) => a.timestamp - b.timestamp)
          .slice(-VISIBLE_CHAT_MESSAGES)

        setMessages(next)
      } catch {
        // OBS can briefly lose network during scene/source refreshes. The next poll retries.
      }
    }

    void loadMessages()
    timer = window.setInterval(loadMessages, 1000)

    return () => {
      active = false
      if (timer !== undefined) window.clearInterval(timer)
    }
  }, [demo])

  return (
    <aside className={`chat-panel ${compact ? 'chat-panel--compact' : ''}`}>
      <header className="chat-panel__header">
        <span className="live-dot" />
        <span>LIVE CHAT</span>
      </header>

      <div className="chat-panel__messages">
        {messages.map(message => (
          <div className="chat-message" key={message.id}>
            <span
              className={`chat-message__user ${message.broadcaster ? 'is-accent' : ''}`}
              style={message.broadcaster ? undefined : { color: safeUserColor(message.color) }}
            >
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
