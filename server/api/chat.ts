import { consola } from 'consola'

export default defineEventHandler((event) => {
  consola.debug('[Chat] Received event =>', event)
  return {
    hello: 'Super Nice Chat API',
  }
})
