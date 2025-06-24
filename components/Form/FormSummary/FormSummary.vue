<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import ToggleButton from '@/components/Buttons/ToggleButton/ToggleButton.vue'
import CheatHeader from '@/components/Chat/ChatHeader/CheatHeader.vue'
import { useStatus } from '@/composables/useStatus'
import { useChatStore } from '@/stores/chat'
import ProgressBar from '~/components/Form/ProgressBar/ProgressBar.vue'

const summaryOpen = ref(true)
const status = useStatus()
const chatStore = useChatStore()
const { sessionId } = storeToRefs(chatStore)

const { getStatus } = status

function toggleSummary() {
  summaryOpen.value = !summaryOpen.value
}

const statusData = ref<any>(null)
const isLoading = ref(false)
const errorMsg = ref<string | null>(null)

function fetchStatus() {
  isLoading.value = true
  getStatus(sessionId.value)
    .then((res) => {
      statusData.value = res // No .data!
      errorMsg.value = null
      isLoading.value = false
      setTimeout(fetchStatus, 15000)
    })
    .catch((error) => {
      statusData.value = null
      errorMsg.value = 'Fehler beim Laden des Status'
      isLoading.value = false
      setTimeout(fetchStatus, 15000)
    })
}

fetchStatus()
</script>

<template>
  <div
    :style="{
      width: summaryOpen ? '20rem' : '1.75rem',
      minWidth: summaryOpen ? '20rem' : '1.75rem',
      overflow: 'visible',
      boxShadow: summaryOpen ? '0 2px 24px 0 #0002' : '',
      background: summaryOpen ? 'var(--un-bg-gray-6, #333)' : 'transparent',
    }"
    class="fixed right-0 top-0 z-50 h-full flex items-start transition-all duration-300"
  >
    <ToggleButton
      :class="useClsx(
        'absolute top-12 z-20 z-50',
        summaryOpen ? '-left-7' : 'left-0',
      )"
      :open="summaryOpen"
      @click="toggleSummary"
    />
    <Transition mode="out-in" name="slide-panel">
      <div
        v-if="summaryOpen"
        key="open"
        class="relative h-full w-full flex flex-col justify-start border-l border-gray-2 bg-gray-6 p-6 color-sky-11 animate-fade-in"
        style="transition: background 0.3s;"
      >
        <div class="mt-6">
          <CheatHeader />
        </div>

        <div class="mt-4">
          <div v-if="isLoading" class="text-gray-400 text-xs">
            Lade Status…
          </div>
          <div v-else-if="errorMsg" class="text-red-400 text-xs">
            {{ errorMsg }}
          </div>
          <template v-else-if="statusData">
            <h3 class="geist-regular mb-2 text-lg color-pureBlack font-bold dark:color-pureWhite">
              Übersicht des Formulars
            </h3>
            <ProgressBar :percent="60" show-percent />
            <div class="text-xs leading-relaxed space-y-1">
              <div><b>Phase:</b> {{ statusData.phase }}</div>
              <div><b>Formular-ID:</b> {{ statusData.form_id }}</div>
              <div>
                <b>Answers:</b>
                <ul class="ml-2 list-disc">
                  <li v-for="(val, key) in statusData.answers" :key="key">
                    <b>{{ key }}:</b> {{ val }}
                  </li>
                </ul>
              </div>
            </div>
          </template>
          <div v-else class="text-gray-400 text-xs">
            Kein Status vorhanden.
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.slide-panel-enter-from,
.slide-panel-leave-to {
  opacity: 0;
  transform: translateX(2rem);
}

.slide-panel-enter-to,
.slide-panel-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.slide-panel-enter-active,
.slide-panel-leave-active {
  transition:
    opacity 0.3s cubic-bezier(0.55, 0, 0.1, 1),
    transform 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}
</style>
