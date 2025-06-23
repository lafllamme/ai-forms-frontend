// composables/useStatus.ts
import { useFetch } from '#app'
import consola from 'consola'

export function useStatus() {
  async function getStatus(chat_id: string) {
    consola.debug('[useFormStatus] Getting status for', chat_id)
    const { data, error } = await useFetch('/api/status', {
      method: 'POST',
      body: { chat_id },
    })
    if (error.value) {
      consola.error('[useFormStatus] Error:', error.value)
      throw error.value
    }
    consola.debug('[useFormStatus] Status result:', data.value)
    return data.value
  }

  return { getStatus }
}
