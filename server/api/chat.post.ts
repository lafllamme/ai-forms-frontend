// server/api/chat.post.ts

import { useRuntimeConfig } from '#imports'
import { consola } from 'consola'

export default defineEventHandler(async (event) => {
  consola.info('[API][chat] Received chat event')
  const config = useRuntimeConfig()
  const endpoint = config.public.FORM_CHAT_API_URL
  consola.info('[API][chat] Using endpoint:', endpoint)
  let body
  try {
    body = await readBody(event)
    consola.debug('[API][chat] Request body:', body)
  }
  catch (err) {
    consola.error('[API][chat] Error reading body:', err)
    return { reply: '❌ Fehler beim Lesen der Anfrage.', done: true }
  }

  // Forward the request to the Python backend
  try {
    const response = await $fetch(endpoint, {
      method: 'POST',
      body,
    })
    consola.debug('[API][chat] Backend response:', response)
    return response
  }
  catch (error) {
    consola.error('[API][chat] Python backend error:', error)
    return { reply: '❌ Chat backend error.', done: true }
  }
})
