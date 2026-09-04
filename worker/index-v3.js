import baseWorker, { ChatRoom } from './index-v2.js'
import { handleRiotRequest } from './riot-api.js'

export { ChatRoom }

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    if (url.pathname.startsWith('/api/riot/')) {
      return handleRiotRequest(request, env)
    }

    return baseWorker.fetch(request, env, ctx)
  },
}
