import consola from 'consola'
// server/api/status.post.ts

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.FORM_CHAT_API_URL

  const baseUrlParts = baseUrl.split('/')
  const statusUrl = `${baseUrlParts.slice(0, -1).join('/')}/status`

  const body = await readBody(event)
  const { chat_id } = body

  consola.debug('[API/status] Proxying status request:', { chat_id, statusUrl })

  try {
    consola.info('fetching status from:', statusUrl)
    const response = await $fetch(statusUrl, {
      method: 'POST',
      body: { chat_id },
      headers: { 'Content-Type': 'application/json' },
    })
    consola.info('[API/status] Received:', response)
    return response
  }
  catch (err) {
    consola.error('[API/status] Error from Python status endpoint:', err)
    return { error: true, message: 'Could not fetch status', details: String(err) }
  }
})
