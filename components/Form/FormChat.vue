<script lang="ts" setup>
const formId = useId()
const chatFormId = ref(`${formId}-chat`)
const { chatHistory, sendFormChat, clearChat } = useChat()

const userInput = ref('')
const isLoading = ref(false)
const requestTime = ref<number | null>(null)
const isDisabled = computed(() => isLoading.value || !userInput.value.trim())

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

function handleEnter(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}
</script>

<template>
  <div
    class="w-full flex flex-col border bg-sand-3 p-6 shadow-xl h-svh"
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
    <div class="mb-4 flex-1 overflow-y-auto pr-1 space-y-2">
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
            class="font-manrope max-w-[75%] break-words rounded-xl px-4 py-2 color-pureBlack shadow transition-colors duration-200 dark:color-pureWhite"
          >
            <span v-html="msg.content" />
          </div>
        </div>
      </template>
      <!-- Loading spinner -->
      <div v-if="isLoading" class="mt-2 flex justify-start animate-pulse">
        <div class="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span class="geist-regular ml-2 text-xs color-gray-10">Formular-Assistent denkt ...</span>
      </div>
    </div>

    <!-- Input field -->
    <form
      class="flex gap-2"
      @submit.prevent="sendMessage"
    >
      <textarea
        v-model="userInput"
        :disabled="isLoading"
        class="geist-regular flex-1 resize-none border rounded-full bg-gray-2 p-3 color-gray-12 font-medium tracking-tight transition focus:outline-none focus:ring-2 focus:ring-primary/60"
        placeholder="Deine Nachricht …"
        rows="1"
        @keydown="handleEnter"
      />
      <div
        class="aspect-square flex items-center justify-center rounded-full bg-pureBlack color-sky-11 transition dark:bg-pureWhite"
        type="submit"
      >
        <button
          :disabled="isDisabled"
          class="aspect-square"
          tabindex="0" type="button"
        >
          <Icon v-if="!isLoading" class="size-6" name="iconoir:arrow-up" />
          <Icon v-else class="size-6 animate-spin" name="tabler:circle-dashed" />
        </button>
      </div>
    </form>

    <!-- Debug panel -->
    <div class="mt-2 flex items-center justify-between text-xs text-gray-11">
      <span>API endpoint: <code class="text-xs">{{ $config.public.formChatApi || '/api/chat' }}</code></span>
      <span v-if="requestTime !== null">
        ⏱️ Antwortzeit: <b>{{ requestTime }}ms</b>
      </span>
      <button class="text-gray-500 ml-4 text-xs hover:underline" @click="clearChat">
        Chat zurücksetzen
      </button>
    </div>
  </div>
</template>
