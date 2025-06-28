import consola from 'consola'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  phase?: string // Optionally attach phase for per-message state
}

export interface ChatStatus {
  phase: string
  form_id?: string
  answers?: Record<string, string>
  receiver?: string
}

export const useChatStore = defineStore('chat', () => {
  // ---- State ----
  const sessionId = ref<string>('')
  const history = ref<ChatMessage[]>([])
  const status = ref<ChatStatus | null>(null)
  const isLoading = ref(false)
  const isOpen = ref(true)

  // ---- Logging ----
  function _log(msg: string, ...args: any[]) {
    consola.debug('[Chat Store] =>', msg, ...args)
  }

  // ---- Actions / Mutations ----
  function setSessionId(id: string) {
    sessionId.value = id
    _log('Session ID set:', id)
  }

  function addMessage(msg: ChatMessage) {
    history.value.push(msg)
    _log('Message added:', msg)
  }

  function setHistory(h: ChatMessage[]) {
    history.value = h
    _log('History replaced:', h)
  }

  function setStatus(s: ChatStatus | null) {
    status.value = s
    _log('Status set:', s)
  }

  function clear() {
    sessionId.value = ''
    history.value = []
    status.value = null
    _log('Store cleared')
  }

  function setLoading(val: boolean) {
    isLoading.value = val
  }

  function setOpen(val: boolean) {
    isOpen.value = val
    _log('Chat open state set:', val)
  }

  // ---- Getters / Computed ----
  const lastMessage = computed(() => history.value.at(-1) ?? null)
  const phase = computed(() => {
    if (status.value?.phase)
      return status.value.phase
  })

  // ---- Watches ----
  watch(sessionId, v => _log('Session ID changed:', v))
  watch(status, v => _log('Status changed:', v), { deep: true })

  // ---- Exported State & Methods ----
  return {
    // State
    sessionId,
    history,
    status,
    isLoading,
    isOpen,

    // Computed
    lastMessage,
    phase,

    // Actions
    setSessionId,
    setOpen,
    addMessage,
    setHistory,
    setStatus,
    setLoading,
    clear,
  }
})
