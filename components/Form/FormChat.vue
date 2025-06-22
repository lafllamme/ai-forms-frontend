<script lang="ts" setup>
const formId = useId()
const timeToInt = new Date().getTime() / 1000
const chatFormId = ref(`${formId}-chat-${timeToInt}`)
const { chatHistory, sendFormChat, clearChat } = useChat()

const userInput = ref('')
const isLoading = ref(false)
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

watch(isLoading, (val) => {
  if (val) {
    iconAnimPhase.value = 'grow'
  }
  else {
    iconAnimPhase.value = 'idle'
  }
})

async function sendMessage() {
  if (!userInput.value.trim())
    return
  isLoading.value = true
  const start = performance.now()
  try {
    await sendFormChat(userInput.value, chatFormId.value)
    userInput.value = ''
  }
  finally {
    requestTime.value = Math.round(performance.now() - start)
    isLoading.value = false
  }
}

function focusTextarea() {
  if (textArea.value) {
    textArea.value.focus()
  }
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

watch([chatHistory, isLoading], () => {
  consola.info('[Chat] Using chat form ID:', chatFormId.value)
  nextTick(() => {
    scrollToBottom()
  })
})

/**
 * Listen for the end of the grow-and-spin animation on the icon.
 * When it ends and loading is still active, switch to infinite spinning.
 */
function onGrowSpinEnd() {
  if (isLoading.value) {
    iconAnimPhase.value = 'spin'
  }
}
</script>

<template>
  <div
    class="w-full flex flex-col border bg-gray-3 p-6 h-svh"
  >
    <!-- Header -->
    <div class="mb-4 flex items-center">
      <div class="flex items-center justify-center gap-2 pb-4 md:justify-start">
        <div class="group size-12 flex items-center justify-center rounded-full bg-sky-1 hover:bg-sky-3">
          <Icon class="size-6 color-sky-12" name="iconoir:chat-bubble-empty" />
        </div>
        <div>
          <h2 class="font-prata text-xl color-sky-12 font-medium tracking-tight antialiased">
            Smart Form Assistant
          </h2>
          <p class="color-gray-11 font-thin">
            Intelligente Formular-Begleitung
          </p>
        </div>
      </div>
    </div>

    <!-- Chat window -->
    <div
      ref="chatWindow"
      class="scrollbar-none mb-4 flex-1 overflow-y-hidden pr-1 space-y-2"
    >
      <template v-for="(msg, idx) in chatHistory" :key="idx">
        <div
          :class="[
            msg.role === 'user' ? 'justify-end' : 'justify-start',
          ]" class="flex"
        >
          <div
            :class="[
              msg.role === 'user'
                ? 'bg-sky-4 text-white rounded-br-none'
                : 'bg-gray-6 text-base-content rounded-bl-none border border-base-300',
            ]"
            class="font-manrope max-w-[70%] break-words rounded-xl px-4 py-2 color-pureBlack shadow transition-colors duration-200 dark:color-pureWhite"
          >
            <span v-html="msg.content" />
          </div>
        </div>
      </template>
      <!-- Loading spinner -->
      <div v-if="isLoading" class="mt-2 flex justify-start animate-pulse">
        <span class="geist-regular ml-2 text-xs color-gray-10">Formular-Assistent denkt ...</span>
      </div>
    </div>

    <!-- Input field -->
    <form
      class="flex items-center justify-center gap-4"
      @click="focusTextarea"
      @submit.prevent="sendMessage"
    >
      <div class="max-w-[40rem] w-full flex flex-col justify-start gap-4 border rounded-[28px] bg-gray-2 p-5">
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
          rows="1"
          @keydown="handleEnter"
        />
        <div class="flex items-center justify-end">
          <div
            class="aspect-square flex items-center justify-center rounded-full bg-pureBlack p-2 color-sky-5 transition dark:bg-pureWhite"
            type="submit"
          >
            <button
              :disabled="isDisabled"
              class="aspect-square flex items-center"
              tabindex="0" type="button"
            >
              <Icon v-if="!isLoading" class="size-5" name="iconoir:arrow-up" />
              <Icon
                v-else
                :class="[
                  iconAnimPhase === 'grow' ? 'animate-grow' : '',
                  iconAnimPhase === 'spin' ? 'animate-spin-infinite' : '',
                ]" class="size-5"
                name="tabler:circle-dashed"
                @animationend="iconAnimPhase === 'grow' ? onGrowSpinEnd() : undefined"
              />
            </button>
          </div>
        </div>
      </div>
    </form>

    <!-- Debug panel -->
    <div class="mt-2 flex items-center justify-between text-xs text-gray-11">
      <span>API endpoint: <code class="text-xs">{{ $config.public.formChatApi || '/api/chat' }}</code></span>
      <div
        v-if="requestTime !== null"
        class="flex items-center text-[11px]"
      >
        <Icon
          class="sky-12 mr-1 size-3"
          name="iconoir:timer"
        />
        <span class="mr-2">Antwortzeit: </span>
        <span class="geist-regular mt-px leading-none tracking-tight">{{ requestTime }}ms</span>
      </div>
      <button class="ml-4 text-xs color-gray-11 hover:underline" @click="clearChat">
        Chat zurücksetzen
      </button>
    </div>
  </div>
</template>

<style scoped>
/**
  * Animation for an element that grows smooth with scale
 */

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
</style>
