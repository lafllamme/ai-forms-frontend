<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import ToggleButton from '@/components/Buttons/ToggleButton/ToggleButton.vue'
import CheatHeader from '@/components/Chat/ChatHeader/CheatHeader.vue'
import { useStatus } from '@/composables/useStatus'
import { useChatStore } from '@/stores/chat'
import ProgressBar from '~/components/Form/ProgressBar/ProgressBar.vue'
import NumberTicker from '~/components/Text/NumberTicker/NumberTicker.vue'

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
const lastRequestTime = ref<number | null>(null)
const lastPercent = ref(0)
const isSessionFinished = ref(false)
let hasLoadedOnce = false

function patchStatusWithProgressClamp(newData: any) {
  if (!statusData.value)
    statusData.value = {}

  // Always update all other fields
  for (const key of Object.keys(statusData.value)) {
    if (!(key in newData))
      delete statusData.value[key]
  }
  for (const key of Object.keys(newData)) {
    statusData.value[key] = newData[key]
  }

  // Clamp percent
  const incomingPercent = newData?.progress?.percentage_complete ?? 0

  // Check for session finished
  if (
  // If phase is submit, or any logic you want to treat as "finished"
    (newData.phase === 'submit' || incomingPercent >= 100)
    && !isSessionFinished.value
  ) {
    lastPercent.value = 100
    isSessionFinished.value = true
    // Optionally override percent in UI
    if (!statusData.value.progress)
      statusData.value.progress = {}
    statusData.value.progress.percentage_complete = 100
    return
  }

  // Only allow percent to increase, not decrease
  if (incomingPercent >= lastPercent.value) {
    lastPercent.value = incomingPercent
    if (!statusData.value.progress)
      statusData.value.progress = {}
    statusData.value.progress.percentage_complete = incomingPercent
  }
  else {
    // Keep showing the highest percent
    if (!statusData.value.progress)
      statusData.value.progress = {}
    statusData.value.progress.percentage_complete = lastPercent.value
  }
}

function fetchStatus() {
  isLoading.value = true
  const start = performance.now()
  getStatus(sessionId.value)
    .then((res) => {
      lastRequestTime.value = Math.round(performance.now() - start)
      patchStatusWithProgressClamp(res)
      hasLoadedOnce = true
      errorMsg.value = null
      isLoading.value = false
      setTimeout(fetchStatus, 15000)
    })
    .catch((error) => {
      lastRequestTime.value = Math.round(performance.now() - start)
      errorMsg.value = 'Fehler beim Laden des Status'
      isLoading.value = false
      setTimeout(fetchStatus, 15000)
    })
}

watch(sessionId, (id) => {
  if (id)
    fetchStatus()
}, { immediate: true })
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
          <div v-if="isLoading && !hasLoadedOnce" class="text-gray-400 text-xs">
            Lade Status…
          </div>
          <div v-else-if="errorMsg && !hasLoadedOnce" class="text-red-400 text-xs">
            {{ errorMsg }}
          </div>
          <div v-else>
            <div class="mb-4 flex items-center justify-start gap-2">
              <Icon class="size-5 color-sky-12" name="iconoir:attachment" />
              <h3 class="font-baskerville text-lg color-pureBlack font-bold leading-none tracking-tight dark:color-pureWhite">
                Zusammenfassung
              </h3>
            </div>
            <ProgressBar
              :percent="statusData?.progress?.percentage_complete ?? 0"
              show-percent
            />
            <template v-if="isSessionFinished">
              <div class="mt-8 text-center text-lg color-green-7 font-bold dark:color-green-4">
                ✅ Vielen Dank! Das Formular wurde erfolgreich abgeschlossen.
              </div>
            </template>
            <div v-else class="mt-2 text-xs leading-relaxed space-y-1">
              <div><b>Phase:</b> {{ statusData?.phase }}</div>
              <div><b>Formular-ID:</b> {{ statusData?.form_id }}</div>
              <div v-if="statusData?.receiver">
                <b>Empfänger:</b> {{ statusData.receiver }}
              </div>
              <div v-if="statusData?.answers && Object.keys(statusData.answers).length">
                <b>Answers:</b>
                <ul class="ml-2 list-disc">
                  <li v-for="(val, key) in statusData.answers" :key="key">
                    <b>{{ key }}:</b> {{ val }}
                  </li>
                </ul>
              </div>
              <div v-if="statusData?.progress">
                <div class="mt-2">
                  <b>Fortschritt:</b>
                  <div class="ml-2">
                    <div>
                      <b>Beantwortete Felder:</b> {{ statusData.progress.answered_fields }} /
                      {{ statusData.progress.total_fields }}
                    </div>
                    <div>
                      <b>Aktueller Schritt:</b> {{ statusData.progress.current_step }} /
                      {{ statusData.progress.total_steps }}
                    </div>
                    <div v-if="statusData.progress.current_field">
                      <b>Aktuelles Feld:</b>
                      <span>{{ statusData.progress.current_field.label }}</span>
                      <span v-if="statusData.progress.current_field.required" class="text-red-500 ml-1">*</span>
                      <span class="ml-1 text-gray-11">({{ statusData.progress.current_field.type }})</span>
                    </div>
                    <div v-if="statusData.progress.missing_fields && statusData.progress.missing_fields.length">
                      <b>Fehlende Felder:</b>
                      <span>{{ statusData.progress.missing_fields.join(', ') }}</span>
                    </div>
                    <div v-if="statusData.progress.phase_progress" class="mt-1">
                      <b>Phasen-Fortschritt:</b>
                      <ul class="ml-2 list-disc">
                        <li
                          v-for="(val, key) in statusData.progress.phase_progress"
                          :key="key"
                        >
                          {{ key }}: {{ val }}%
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="lastRequestTime !== null"
                class="font-geist flex justify-end gap-2 text-xs color-gray-11 font-light"
              >
                <div>
                  <NumberTicker
                    :value="lastRequestTime"
                  />
                  <span>ms</span>
                </div>
              </div>
            </div>
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
