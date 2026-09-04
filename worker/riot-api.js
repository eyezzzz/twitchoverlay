const AMERICAS_HOST = 'americas.api.riotgames.com'
const BR1_HOST = 'br1.api.riotgames.com'

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}

function requireRiotAuth(request, env) {
  if (!env.RIOT_API_KEY) {
    return jsonResponse({ error: 'RIOT_API_KEY is not configured in Cloudflare.' }, 503)
  }

  const provided = request.headers.get('X-Riot-Token')
  if (!provided || provided !== env.RIOT_API_KEY) {
    return jsonResponse({ error: 'Unauthorized.' }, 401)
  }

  return null
}

function copyQuery(sourceUrl, targetUrl, allowed) {
  for (const key of allowed) {
    const value = sourceUrl.searchParams.get(key)
    if (value !== null && value !== '') targetUrl.searchParams.set(key, value)
  }
}

async function riotFetch(host, path, env, sourceUrl = null, queryKeys = []) {
  const target = new URL(`https://${host}${path}`)
  if (sourceUrl) copyQuery(sourceUrl, target, queryKeys)

  return fetch(target, {
    method: 'GET',
    headers: {
      'X-Riot-Token': env.RIOT_API_KEY,
      accept: 'application/json',
    },
  })
}

async function passthrough(response) {
  const body = await response.text()
  return new Response(body, {
    status: response.status,
    headers: {
      'content-type': response.headers.get('content-type') || 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}

function safeDecode(value) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function encoded(value) {
  return encodeURIComponent(safeDecode(value))
}

function clampInteger(value, fallback, min, max) {
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed)) return fallback
  return Math.max(min, Math.min(max, parsed))
}

function participantIdForPuuid(timeline, puuid) {
  const participant = timeline.info?.participants?.find((item) => item?.puuid === puuid)
  if (Number.isInteger(participant?.participantId)) return participant.participantId

  const participants = timeline.metadata?.participants
  if (Array.isArray(participants)) {
    const index = participants.indexOf(puuid)
    if (index >= 0) return index + 1
  }

  return null
}

function eventTouchesPlayer(event, participantId) {
  if (!participantId) return false
  if (event.participantId === participantId) return true
  if (event.killerId === participantId) return true
  if (event.victimId === participantId) return true
  if (event.creatorId === participantId) return true
  if (Array.isArray(event.assistingParticipantIds) && event.assistingParticipantIds.includes(participantId)) return true
  return false
}

function compactPosition(position) {
  if (!position || typeof position !== 'object') return undefined
  if (!Number.isFinite(position.x) || !Number.isFinite(position.y)) return undefined
  return { x: position.x, y: position.y }
}

function compactEvent(event, participantId) {
  const result = {
    timestamp: event.timestamp,
    type: event.type,
    relatedToPlayer: eventTouchesPlayer(event, participantId),
  }

  const scalarKeys = [
    'participantId',
    'killerId',
    'victimId',
    'creatorId',
    'teamId',
    'itemId',
    'beforeId',
    'afterId',
    'skillSlot',
    'levelUpType',
    'wardType',
    'monsterType',
    'monsterSubType',
    'buildingType',
    'towerType',
    'laneType',
    'killType',
    'bounty',
    'shutdownBounty',
    'realTimestamp',
  ]

  for (const key of scalarKeys) {
    if (event[key] !== undefined && event[key] !== null) result[key] = event[key]
  }

  if (Array.isArray(event.assistingParticipantIds) && event.assistingParticipantIds.length) {
    result.assistingParticipantIds = event.assistingParticipantIds
  }

  const position = compactPosition(event.position)
  if (position) result.position = position

  return result
}

function buildCoachTimeline(timeline, puuid, matchId) {
  const participantId = participantIdForPuuid(timeline, puuid)
  if (!participantId) return null

  const snapshots = []
  const events = []

  const globalEventTypes = new Set([
    'CHAMPION_KILL',
    'CHAMPION_SPECIAL_KILL',
    'ELITE_MONSTER_KILL',
    'BUILDING_KILL',
    'TURRET_PLATE_DESTROYED',
    'GAME_END',
  ])

  const playerEventTypes = new Set([
    'WARD_PLACED',
    'WARD_KILL',
    'ITEM_PURCHASED',
    'ITEM_SOLD',
    'ITEM_DESTROYED',
    'ITEM_UNDO',
    'SKILL_LEVEL_UP',
  ])

  for (const frame of timeline.info?.frames || []) {
    const state = frame.participantFrames?.[String(participantId)] || frame.participantFrames?.[participantId]
    if (state) {
      snapshots.push({
        timestamp: frame.timestamp,
        minute: Math.floor((frame.timestamp || 0) / 60000),
        position: compactPosition(state.position),
        level: state.level,
        xp: state.xp,
        totalGold: state.totalGold,
        currentGold: state.currentGold,
        cs: state.minionsKilled,
        jungleCs: state.jungleMinionsKilled,
      })
    }

    for (const event of frame.events || []) {
      const touchesPlayer = eventTouchesPlayer(event, participantId)
      if (globalEventTypes.has(event.type) || (playerEventTypes.has(event.type) && touchesPlayer)) {
        events.push(compactEvent(event, participantId))
      }
    }
  }

  const maxEvents = 300
  const returnedEvents = events.slice(0, maxEvents)
  const frames = timeline.info?.frames || []
  const lastFrame = frames[frames.length - 1]

  return {
    matchId,
    puuid,
    participantId,
    frameInterval: timeline.info?.frameInterval ?? null,
    durationMs: lastFrame?.timestamp ?? null,
    snapshots,
    events: returnedEvents,
    eventCount: events.length,
    eventsTruncated: events.length > returnedEvents.length,
    participantMap: (timeline.info?.participants || []).map((participant) => ({
      participantId: participant.participantId,
      puuid: participant.puuid,
    })),
  }
}

async function handleCoachTimeline(request, env, matchId, url) {
  const puuid = url.searchParams.get('puuid')
  if (!puuid) return jsonResponse({ error: 'Missing required query parameter: puuid.' }, 400)

  const response = await riotFetch(
    AMERICAS_HOST,
    `/lol/match/v5/matches/${encoded(matchId)}/timeline`,
    env,
  )

  if (!response.ok) return passthrough(response)

  const timeline = await response.json()
  const compact = buildCoachTimeline(timeline, puuid, safeDecode(matchId))
  if (!compact) {
    return jsonResponse({ error: 'The supplied PUUID is not a participant in this timeline.' }, 404)
  }

  return jsonResponse(compact)
}

async function handleMasteries(env, puuid, url) {
  const response = await riotFetch(
    BR1_HOST,
    `/lol/champion-mastery/v4/champion-masteries/by-puuid/${encoded(puuid)}`,
    env,
  )

  if (!response.ok) return passthrough(response)
  const payload = await response.json()
  const count = clampInteger(url.searchParams.get('count'), 20, 1, 50)
  return jsonResponse(Array.isArray(payload) ? payload.slice(0, count) : payload)
}

export async function handleRiotRequest(request, env) {
  const authError = requireRiotAuth(request, env)
  if (authError) return authError

  if (request.method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed.' }, 405)
  }

  const url = new URL(request.url)
  const path = url.pathname

  const account = path.match(/^\/api\/riot\/account\/by-riot-id\/([^/]+)\/([^/]+)$/)
  if (account) {
    const response = await riotFetch(
      AMERICAS_HOST,
      `/riot/account/v1/accounts/by-riot-id/${encoded(account[1])}/${encoded(account[2])}`,
      env,
    )
    return passthrough(response)
  }

  const matchIds = path.match(/^\/api\/riot\/matches\/by-puuid\/([^/]+)\/ids$/)
  if (matchIds) {
    const response = await riotFetch(
      AMERICAS_HOST,
      `/lol/match/v5/matches/by-puuid/${encoded(matchIds[1])}/ids`,
      env,
      url,
      ['start', 'count', 'queue', 'type', 'startTime', 'endTime'],
    )
    return passthrough(response)
  }

  const coachTimeline = path.match(/^\/api\/riot\/matches\/([^/]+)\/coach-timeline$/)
  if (coachTimeline) {
    return handleCoachTimeline(request, env, coachTimeline[1], url)
  }

  const match = path.match(/^\/api\/riot\/matches\/([^/]+)$/)
  if (match) {
    const response = await riotFetch(
      AMERICAS_HOST,
      `/lol/match/v5/matches/${encoded(match[1])}`,
      env,
    )
    return passthrough(response)
  }

  const summoner = path.match(/^\/api\/riot\/summoner\/by-puuid\/([^/]+)$/)
  if (summoner) {
    const response = await riotFetch(
      BR1_HOST,
      `/lol/summoner/v4/summoners/by-puuid/${encoded(summoner[1])}`,
      env,
    )
    return passthrough(response)
  }

  const ranked = path.match(/^\/api\/riot\/ranked\/by-puuid\/([^/]+)$/)
  if (ranked) {
    const response = await riotFetch(
      BR1_HOST,
      `/lol/league/v4/entries/by-puuid/${encoded(ranked[1])}`,
      env,
    )
    return passthrough(response)
  }

  const masteries = path.match(/^\/api\/riot\/masteries\/by-puuid\/([^/]+)$/)
  if (masteries) return handleMasteries(env, masteries[1], url)

  const activeGame = path.match(/^\/api\/riot\/active-game\/by-puuid\/([^/]+)$/)
  if (activeGame) {
    const response = await riotFetch(
      BR1_HOST,
      `/lol/spectator/v5/active-games/by-summoner/${encoded(activeGame[1])}`,
      env,
    )
    return passthrough(response)
  }

  return jsonResponse({ error: 'Riot API route not found.' }, 404)
}
