<script lang="ts" setup>
import consola from 'consola'
import { storeToRefs } from 'pinia'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useChat } from '@/composables/useChat'
import { useChatStore } from '@/stores/chat'
import { generateSessionId } from '@/utils/uuid'
import NumberTicker from '~/components/Text/NumberTicker/NumberTicker.vue'
import RadiantText from '~/components/Text/RadiantText/RadiantText.vue'
// <--- utility as before

const chatStore = useChatStore()
const { sessionId, status } = storeToRefs(chatStore)
const { chatHistory, sendFormChat, clearChat, cancelFormChat } = useChat()
const isMounted = ref(false)

const userInput = ref('')
const { isLoading } = storeToRefs(chatStore)
const { setLoading } = chatStore
const requestTime = ref<number | null>(null)
const isDisabled = computed(() => isLoading.value || !userInput.value.trim())
const textArea = useTemplateRef('textArea')
const chatWindow = useTemplateRef('chatWindow')

/**
 * Controls which animation phase the loading icon is in:
 * 'grow' = grow and spin once,
 * 'spin' = infinite spinning,
 * 'idle' = no animation
 */
const iconAnimPhase = ref<'idle' | 'grow' | 'spin'>('idle')
const showCancelIcon = ref(false)
let cancelIconTimeout: ReturnType<typeof setTimeout> | null = null

watch(isLoading, (val) => {
  iconAnimPhase.value = val ? 'grow' : 'idle'
  // Cancel any pending timer
  if (cancelIconTimeout)
    clearTimeout(cancelIconTimeout)
  showCancelIcon.value = false
  if (val) {
    // After 8s, show the cancel icon
    cancelIconTimeout = setTimeout(() => {
      showCancelIcon.value = true
    }, 8000)
  }
})

function generateSessionIdIfNeeded() {
  if (!sessionId.value) {
    const newId = generateSessionId()
    chatStore.setSessionId(newId)
    consola.debug('[Chat] Generated and set new sessionId:', newId)
  }
}

generateSessionIdIfNeeded()

async function sendMessage() {
  if (!userInput.value.trim())
    return
  setLoading(true)
  const start = performance.now()
  try {
    const inputContent = userInput.value.trim()
    userInput.value = ''
    await sendFormChat(inputContent, sessionId.value)
  }
  finally {
    requestTime.value = Math.round(performance.now() - start)
    setLoading(false)
  }
}

function focusTextarea() {
  if (textArea.value)
    textArea.value.focus()
}

function scrollToBottom() {
  consola.debug('[Chat] Scrolling to bottom')
  if (chatWindow.value) {
    chatWindow.value.scrollTo({
      top: chatWindow.value.scrollHeight,
      behavior: 'smooth',
    })
  }
}

function handleEnter(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

function resetChat() {
  clearChat()
  chatStore.setSessionId(generateSessionId())
}

watch([chatHistory, isLoading], () => {
  consola.info('[Chat] Using chat session ID:', sessionId.value)
  nextTick(() => {
    scrollToBottom()
    if (textArea.value)
      textArea.value.focus()
  })
})

function onGrowSpinEnd() {
  if (isLoading.value)
    iconAnimPhase.value = 'spin'
}

const thinkPhrase = computed(() => {
  if (status.value?.phase === 'formFields')
    return 'Form Assistent füllt das Formular aus ...'
  else if (status.value?.phase === 'confirmFields')
    return 'Form Assistent überprüft die Eingaben ...'
  else if (status.value?.phase === 'done')
    return 'Form Assistent sendet das Formular ...'
  return 'Form Assistant denkt nach ...'
})
onMounted(() => {
  isMounted.value = true
})
</script>

<template>
  <div
    class="w-full flex flex-col border bg-gray-3"
    style="height: 100svh; overflow: hidden;"
  >
    <div class="relative min-h-0 flex flex-1 flex-col">
      <div ref="chatWindow" class="chat-window flex-1 overflow-y-auto pr-1 space-y-2" style="scroll-padding-top: 120px;">
        <div
          :class="useClsx(
            isMounted ? 'animate-fade-in' : 'opacity-0',
            'font-thin tracking-tight',
            'uppercase flex items-center gap-2',
            'font-dm-mono mb-2 text-xs',
            'pt-24',
          )"
        >
          <span class="color-gray-10 lowercase">~/chat/</span>
          <span class="color-sky-11"> {{ sessionId }}</span>
          <div class="h-4 w-2 bg-sky-8 animate-pulse" />
        </div>
        <template v-for="(msg, idx) in chatHistory" :key="idx">
          <div
            :class="[
              msg.role === 'user' ? 'justify-end' : 'justify-start',
            ]" class="flex"
          >
            <div
              :class="useClsx(
                'font-manrope slide-up max-w-[70%] my-4 break-words',
                'rounded-2xl px-4 py-3 color-pureBlack shadow',
                'transition-colors duration-200 dark:color-pureWhite',
                msg.role === 'user'
                  ? 'bg-indigo-8 text-white rounded-br-none'
                  : 'bg-gray-8 text-base-content rounded-bl-none border border-base-300',
              )"
            >
              <span class="whitespace-pre-line" v-html="msg.content" />
            </div>
          </div>
        </template>
        <div v-if="isLoading" class="mt-2 flex justify-start">
          <RadiantText
            class="font-manrope inline-flex items-center justify-start py-1 transition-all ease-out hover:text-gray-6 hover:duration-300"
          >
            <span class="text-sm font-bold">{{ thinkPhrase }}</span>
          </RadiantText>
        </div>
        <div class="pb-8" />
      </div>
      <form
        class="flex items-center justify-center gap-4"
        @click="focusTextarea"
        @submit.prevent="sendMessage"
      >
        <div class="max-w-[45rem] w-full flex flex-col justify-start gap-4 border rounded-[28px] bg-gray-2 p-5 2xl:max-w-[60rem]">
          <textarea
            ref="textArea"
            v-model="userInput"
            :class="useClsx(
              'geist-regular w-full selection:color-sky-2 selection:bg-sky-11',
              'resize-none bg-transparent color-gray-12',
              'font-medium tracking-tight transition placeholder:hidden focus:outline-none',
            )"
            :disabled="isLoading"
            autofocus
            placeholder="Stelle irgendeine Frage"
            @keydown="handleEnter"
          />
          <div class="flex items-center justify-end">
            <div
              class="aspect-square flex items-center justify-center rounded-full bg-pureBlack p-2 color-sky-8 transition dark:bg-pureWhite"
              type="submit"
            >
              <button
                :disabled="isDisabled && !isLoading"
                :title="isLoading ? (showCancelIcon ? 'Anfrage abbrechen' : 'Antwort wird geladen …') : 'Absenden'"
                class="aspect-square flex items-center"
                tabindex="0"
                type="button"
                @click="isLoading ? cancelFormChat() : sendMessage()"
              >
                <Icon
                  v-if="!isLoading"
                  class="size-5"
                  name="iconoir:arrow-up"
                />
                <Icon
                  v-else
                  :class="[
                    showCancelIcon ? ''
                    : (iconAnimPhase === 'grow' ? 'animate-grow' : ''),
                    showCancelIcon ? ''
                    : (iconAnimPhase === 'spin' ? 'animate-spin-infinite' : ''),
                  ]"
                  :name="showCancelIcon ? 'tabler:square-filled' : 'tabler:circle-dashed'"
                  class="size-5"
                  @animationend="iconAnimPhase === 'grow' && !showCancelIcon ? onGrowSpinEnd() : undefined"
                />
              </button>
            </div>
          </div>
        </div>
      </form>
      <div class="mt-2 flex items-center justify-between text-xs text-gray-11">
        <span>API endpoint: <code class="text-xs">{{ $config.public.formChatApi || '/api/chat' }}</code></span>
        <div v-if="requestTime !== null" class="flex items-center text-[11px]">
          <Icon
            class="sky-12 mr-1 size-3"
            name="iconoir:timer"
          />
          <span class="mr-2">Antwortzeit: </span>
          <span class="geist-regular mt-px leading-none tracking-tight">
            <NumberTicker :value="requestTime" />
            <span>ms</span>
          </span>
        </div>
        <button class="ml-4 text-xs color-gray-11 hover:underline" @click="resetChat">
          Chat zurücksetzen
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes grow {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.2);
  }
}

@keyframes spinInfinite {
  0% {
    transform: scale(1.2) rotate(0deg);
  }
  100% {
    transform: scale(1.2) rotate(360deg);
  }
}

.animate-grow {
  animation: grow 0.7s cubic-bezier(0.4, 2, 0.6, 1) forwards;
}

.animate-spin-infinite {
  animation: spinInfinite 0.7s linear infinite;
}

.slide-up {
  animation: slideUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  opacity: 0;
  transform: translateY(50px);
}

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hide scrollbar for Chrome, Safari, Opera */
.chat-window::-webkit-scrollbar {
  display: none !important;
}

/* Hide scrollbar for Firefox */
.chat-window {
  scrollbar-width: none;
  -ms-overflow-style: none; /* IE and Edge */
}
</style>
