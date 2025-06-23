// composables/useStatus.ts
import consola from 'consola'

export function useStatus() {
  async function getStatus(chat_id: string) {
    consola.debug('[useFormStatus] Getting status for', chat_id)
    // Use $fetch for client-initiated requests
    const data = await $fetch('/api/status', {
      method: 'POST',
      body: { chat_id },
    })
    if (!data)
      consola.error('[useFormStatus] Get status failed')
    consola.debug('[useFormStatus] Status result:', data)
    return data
  }

  return { getStatus }
}
