const ROOM_NAME = 'fietzlol-live-chat'
const TWITCH_SCOPE = 'user:read:chat'
const encoder = new TextEncoder()

function room(env) {
  const id = env.CHAT_ROOM.idFromName(ROOM_NAME)
  return env.CHAT_ROOM.get(id)
}

function json(data, init = {}) {
  const headers = new Headers(init.headers)
  headers.set('content-type', 'application/json; charset=utf-8')
  headers.set('cache-control', 'no-store')
  return new Response(JSON.stringify(data), { ...init, headers })
}

function parseCookies(request) {
  const result = {}
  const raw = request.headers.get('cookie') || ''
  for (const part of raw.split(';')) {
    const index = part.indexOf('=')
    if (index === -1) continue
    const key = part.slice(0, index).trim()
    const value = part.slice(index + 1).trim()
    if (key) result[key] = decodeURIComponent(value)
  }
  return result
}

function randomHex(bytes = 32) {
  const data = new Uint8Array(bytes)
  crypto.getRandomValues(data)
  return Array.from(data, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function hexToBytes(hex) {
  if (!hex || hex.length % 2 !== 0) return null
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i += 1) {
    const value = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16)
    if (Number.isNaN(value)) return null
    bytes[i] = value
  }
  return bytes
}

async function verifyTwitchSignature(request, body, secret) {
  if (!secret) return false

  const messageId = request.headers.get('Twitch-Eventsub-Message-Id')
  const timestamp = request.headers.get('Twitch-Eventsub-Message-Timestamp')
  const signature = request.headers.get('Twitch-Eventsub-Message-Signature')
  if (!messageId || !timestamp || !signature?.startsWith('sha256=')) return false

  const sentAt = Date.parse(timestamp)
  if (!Number.isFinite(sentAt) || Math.abs(Date.now() - sentAt) > 10 * 60 * 1000) return false

  const signatureBytes = hexToBytes(signature.slice('sha256='.length))
  if (!signatureBytes) return false

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  )

  return crypto.subtle.verify(
    'HMAC',
    key,
    signatureBytes,
    encoder.encode(`${messageId}${timestamp}${body}`),
  )
}

function configReady(env) {
  return Boolean(env.TWITCH_CLIENT_ID && env.TWITCH_CLIENT_SECRET && env.TWITCH_REDIRECT_URI)
}

async function getRoomConfig(env) {
  const response = await room(env).fetch('https://chat-room/config')
  if (!response.ok) return null
  return response.json()
}

async function saveRoomConfig(env, config) {
  return room(env).fetch('https://chat-room/config', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(config),
  })
}

async function createChatSubscription(env, config) {
  const response = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      'Client-Id': env.TWITCH_CLIENT_ID,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'channel.chat.message',
      version: '1',
      condition: {
        broadcaster_user_id: config.userId,
        user_id: config.userId,
      },
      transport: {
        method: 'webhook',
        callback: new URL('/api/twitch/eventsub', env.TWITCH_REDIRECT_URI).toString(),
        secret: config.webhookSecret,
      },
    }),
  })

  const payload = await response.text()
  // Twitch returns 409 when this exact subscription already exists. That is OK.
  if (response.ok || response.status === 409) {
    return { ok: true, status: response.status, payload }
  }

  return { ok: false, status: response.status, payload }
}

function successPage(displayName) {
  const safeName = String(displayName || 'Twitch').replace(/[<>&"']/g, '')
  return new Response(`<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Twitch conectada</title>
<style>body{font-family:system-ui;background:#080d0f;color:#eee;display:grid;place-items:center;min-height:100vh;margin:0}.card{max-width:560px;padding:36px;border:1px solid #20d3c555;background:#0b1114}.ok{color:#20d3c5;font-weight:800}small{color:#99a4a8}</style></head>
<body><div class="card"><div class="ok">TWITCH CONECTADA</div><h1>${safeName}</h1><p>O EventSub do chat foi configurado. Você pode fechar esta aba.</p><small>As novas mensagens aparecerão no painel LIVE CHAT do overlay.</small></div></body></html>`, {
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
  })
}

async function beginTwitchAuth(request, env) {
  if (!configReady(env)) return new Response('Twitch environment variables are missing.', { status: 500 })

  const state = randomHex(24)
  const authorize = new URL('https://id.twitch.tv/oauth2/authorize')
  authorize.searchParams.set('response_type', 'code')
  authorize.searchParams.set('client_id', env.TWITCH_CLIENT_ID)
  authorize.searchParams.set('redirect_uri', env.TWITCH_REDIRECT_URI)
  authorize.searchParams.set('scope', TWITCH_SCOPE)
  authorize.searchParams.set('state', state)

  return new Response(null, {
    status: 302,
    headers: {
      location: authorize.toString(),
      'set-cookie': `twitch_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
      'cache-control': 'no-store',
    },
  })
}

async function finishTwitchAuth(request, env) {
  if (!configReady(env)) return new Response('Twitch environment variables are missing.', { status: 500 })

  const url = new URL(request.url)
  if (url.searchParams.get('error')) {
    return new Response(`Twitch authorization failed: ${url.searchParams.get('error_description') || url.searchParams.get('error')}`, { status: 400 })
  }

  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const cookieState = parseCookies(request).twitch_oauth_state
  if (!code || !state || !cookieState || state !== cookieState) {
    return new Response('Invalid or expired Twitch OAuth state. Start again at /auth/twitch.', { status: 400 })
  }

  const tokenBody = new URLSearchParams({
    client_id: env.TWITCH_CLIENT_ID,
    client_secret: env.TWITCH_CLIENT_SECRET,
    code,
    grant_type: 'authorization_code',
    redirect_uri: env.TWITCH_REDIRECT_URI,
  })

  const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: tokenBody,
  })

  if (!tokenResponse.ok) {
    return new Response(`Twitch token exchange failed: ${await tokenResponse.text()}`, { status: 502 })
  }

  const tokens = await tokenResponse.json()
  const userResponse = await fetch('https://api.twitch.tv/helix/users', {
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
      'Client-Id': env.TWITCH_CLIENT_ID,
    },
  })

  if (!userResponse.ok) {
    return new Response(`Twitch user lookup failed: ${await userResponse.text()}`, { status: 502 })
  }

  const users = await userResponse.json()
  const user = users.data?.[0]
  if (!user) return new Response('Twitch did not return the authorized user.', { status: 502 })

  const previous = await getRoomConfig(env)
  const config = {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt: Date.now() + Number(tokens.expires_in || 0) * 1000,
    userId: user.id,
    login: user.login,
    displayName: user.display_name,
    webhookSecret: previous?.webhookSecret || randomHex(32),
    connectedAt: Date.now(),
  }

  await saveRoomConfig(env, config)
  const subscription = await createChatSubscription(env, config)
  if (!subscription.ok) {
    return new Response(`Twitch connected, but EventSub subscription failed (${subscription.status}): ${subscription.payload}`, { status: 502 })
  }

  return successPage(user.display_name)
}

async function handleTwitchEventSub(request, env, ctx) {
  const body = await request.text()
  const config = await getRoomConfig(env)
  if (!config?.webhookSecret) return new Response('Twitch is not configured.', { status: 503 })

  const valid = await verifyTwitchSignature(request, body, config.webhookSecret)
  if (!valid) return new Response('Invalid EventSub signature.', { status: 403 })

  let payload
  try {
    payload = JSON.parse(body)
  } catch {
    return new Response('Invalid JSON.', { status: 400 })
  }

  const messageType = request.headers.get('Twitch-Eventsub-Message-Type')

  if (messageType === 'webhook_callback_verification') {
    return new Response(payload.challenge || '', {
      status: 200,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    })
  }

  if (messageType === 'notification' && payload.subscription?.type === 'channel.chat.message') {
    const event = payload.event
    const message = {
      id: event.message_id,
      platform: 'twitch',
      user: event.chatter_user_name,
      login: event.chatter_user_login,
      text: event.message?.text || '',
      color: event.color || '',
      broadcaster: event.chatter_user_id === event.broadcaster_user_id,
      timestamp: Date.now(),
    }

    ctx.waitUntil(room(env).fetch('https://chat-room/push', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(message),
    }))
    return new Response(null, { status: 204 })
  }

  if (messageType === 'revocation') {
    ctx.waitUntil(room(env).fetch('https://chat-room/revoked', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
    }))
    return new Response(null, { status: 204 })
  }

  return new Response(null, { status: 204 })
}

export class ChatRoom {
  constructor(state, env) {
    this.state = state
    this.env = env
  }

  async fetch(request) {
    const url = new URL(request.url)

    if (url.pathname === '/config') {
      if (request.method === 'POST') {
        const config = await request.json()
        await this.state.storage.put('config', config)
        await this.state.storage.put('eventsubStatus', 'pending')
        return new Response(null, { status: 204 })
      }
      const config = await this.state.storage.get('config')
      return config ? json(config) : json(null, { status: 404 })
    }

    if (url.pathname === '/push' && request.method === 'POST') {
      const message = await request.json()
      const messages = (await this.state.storage.get('messages')) || []
      if (!messages.some((item) => item.id === message.id)) {
        messages.push(message)
        while (messages.length > 50) messages.shift()
        await this.state.storage.put('messages', messages)
      }
      await this.state.storage.put('eventsubStatus', 'connected')
      return new Response(null, { status: 204 })
    }

    if (url.pathname === '/messages') {
      const messages = (await this.state.storage.get('messages')) || []
      return json({ messages })
    }

    if (url.pathname === '/status') {
      const config = await this.state.storage.get('config')
      const eventsubStatus = (await this.state.storage.get('eventsubStatus')) || 'disconnected'
      return json({
        connected: Boolean(config?.userId),
        user: config ? { id: config.userId, login: config.login, displayName: config.displayName } : null,
        eventsubStatus,
        connectedAt: config?.connectedAt || null,
      })
    }

    if (url.pathname === '/revoked' && request.method === 'POST') {
      const payload = await request.json()
      await this.state.storage.put('eventsubStatus', 'revoked')
      await this.state.storage.put('revocation', payload)
      return new Response(null, { status: 204 })
    }

    return new Response('Not found', { status: 404 })
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    if (url.pathname === '/auth/twitch') {
      return beginTwitchAuth(request, env)
    }

    if (url.pathname === '/auth/twitch/callback') {
      return finishTwitchAuth(request, env)
    }

    if (url.pathname === '/api/twitch/eventsub' && request.method === 'POST') {
      return handleTwitchEventSub(request, env, ctx)
    }

    if (url.pathname === '/api/chat/messages') {
      return room(env).fetch('https://chat-room/messages')
    }

    if (url.pathname === '/api/chat/status') {
      return room(env).fetch('https://chat-room/status')
    }

    return new Response('Not found', { status: 404 })
  },
}
