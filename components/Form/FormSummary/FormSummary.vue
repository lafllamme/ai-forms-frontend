<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import ToggleButton from '@/components/Buttons/ToggleButton/ToggleButton.vue'
import { useStatus } from '@/composables/useStatus'
import { useChatStore } from '@/stores/chat'
import CheatHeader from '~/components/Chat/ChatHeader/CheatHeader.vue'
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
const lastPercent = ref(0)
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

  // Clamp percent (never allow downwards jump)
  const incomingPercent = newData?.progress?.percentage_complete ?? 0
  if (incomingPercent >= lastPercent.value) {
    lastPercent.value = incomingPercent
    if (!statusData.value.progress)
      statusData.value.progress = {}
    statusData.value.progress.percentage_complete = incomingPercent
  }
  else {
    if (!statusData.value.progress)
      statusData.value.progress = {}
    statusData.value.progress.percentage_complete = lastPercent.value
  }
}

function fetchStatus() {
  isLoading.value = true
  getStatus(sessionId.value)
    .then((res) => {
      patchStatusWithProgressClamp(res)
      hasLoadedOnce = true
      errorMsg.value = null
      isLoading.value = false
      setTimeout(fetchStatus, 15000)
    })
    .catch(() => {
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
      width: summaryOpen ? '22rem' : '1.75rem',
      minWidth: summaryOpen ? '22rem' : '1.75rem',
      background: summaryOpen ? 'var(--un-bg-gray-1, #fff)' : 'transparent',
    }"
    class="fixed right-0 top-0 z-50 h-full flex items-start border-l border-gray-2 transition-all duration-300"
  >
    <ToggleButton
      :class="useClsx('absolute top-12 z-20', summaryOpen ? '-left-7' : 'left-0')"
      :open="summaryOpen"
      @click="toggleSummary"
    />
    <Transition mode="out-in" name="slide-panel">
      <div
        v-if="summaryOpen" key="open"
        class="relative h-full w-full flex flex-col border-gray-2 bg-gray-7 px-0 pt-0 dark:bg-gray-1"
        style="transition: background 0.3s;"
      >
        <!-- Smart Assistant Card -->
        <div
          class="border-b border-gray-2 bg-gray-7 px-7 pb-2 pt-6 dark:bg-gray-1"
        >
          <div>
            <CheatHeader />
          </div>
          <div class="pb-2">
            <ProgressBar
              :percent="statusData?.progress?.percentage_complete ?? 0"
              class="mb-1"
              show-percent
            />
            <div class="font-geist mt-2 flex items-center text-xs color-gray-11">
              <div class="flex justify-start gap-1">
                <p>Phase</p>
                <p class="color-pureBlack uppercase dark:color-pureWhite">
                  {{ statusData?.phase }}
                </p>
              </div>
              <div class="px-3">
                •
              </div>
              <div v-if="statusData?.progress">
                <p>
                  Schritt
                  <span>
                    {{ statusData.progress.current_step }}
                  </span>/<span>
                    {{ statusData.progress.total_steps }}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto">
          <!-- Aktuell -->
          <div v-if="statusData?.progress?.current_field" class="mb-4 bg-indigo-12">
            <div
              class="font-geist mb-2 flex items-center justify-start gap-2 px-5 pb-1 pt-5 text-base color-sky-1 font-bold leading-none tracking-tight uppercase"
            >
              <Icon class="size-5 color-indigo-9" name="tabler:target" />
              <h4 class="mb-px color-sky-2 leading-none">
                Aktuelles Feld
              </h4>
            </div>
            <div class="p-5 pt-0">
              <div class="flex flex-col gap-1 border border-blue-2 rounded-xl bg-blue-1 px-5 py-4">
                <div class="font-geist text-lg color-pureBlack font-bold dark:color-pureWhite">
                  <div class="flex items-center justify-start gap-2">
                    <p>{{ statusData.progress.current_field.label }}</p>
                    <div
                      v-if="statusData.progress.current_field.required"
                    >
                      *
                    </div>
                    <div class="font-geist ml-1 flex justify-end text-xs color-gray-11 font-light capitalize">
                      <p>
                        ({{
                          statusData.progress.current_field.type
                        }})
                      </p>
                    </div>
                  </div>
                </div>
                <span class="text-sm color-sky-11 font-medium">In Bearbeitung</span>
              </div>
            </div>
          </div>
          <!-- Ausstehend -->
          <div v-if="statusData?.progress?.missing_fields?.length" class="mb-4 px-6">
            <div
              class="font-geist mb-2 flex items-center gap-2 text-base color-gray-12 font-bold font-bold tracking-wide uppercase uppercase"
            >
              Ausstehende Felder
              <div
                class="aspect-square flex items-center justify-center rounded-full bg-sky-6 px-2 py-0.5 text-xs color-sky-11 font-bold"
              >
                {{
                  statusData.progress.missing_fields.length
                }}
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <div
                v-for="field in statusData.progress.missing_fields" :key="field"
                class="flex items-center rounded-md bg-gray-1 px-3 py-2 text-base color-gray-12 font-medium font-mono dark:bg-gray-7"
              >
                <span class="mr-2 inline-block h-2 w-2 rounded-full bg-sky-4" />
                {{ field }}
              </div>
            </div>
          </div>
          <!-- Stats Row -->
          <div class="mb-4 mt-6 flex items-center justify-between gap-2">
            <div class="flex flex-1 flex-col items-center">
              <span class="font-geist text-xl color-gray-12 font-bold">{{
                statusData?.progress?.answered_fields ?? 0
              }}</span>
              <span class="mt-0.5 text-xs color-gray-11">Felder</span>
            </div>
            <div class="flex flex-1 flex-col items-center">
              <span class="font-geist text-xl color-gray-12 font-bold">{{
                statusData?.analytics?.form_complexity ?? 0
              }}</span>
              <span class="mt-0.5 text-xs color-gray-11">Komplex</span>
            </div>
            <div class="flex flex-1 flex-col items-center">
              <span class="font-geist text-xl color-gray-12 font-bold">{{
                statusData?.analytics?.llm_calls_count ?? 0
              }}</span>
              <span class="mt-0.5 text-xs color-gray-11">Requests</span>
            </div>
          </div>
          <hr class="my-3 border-gray-3">
          <!-- Formular Meta -->
          <div>
            <div class="font-geist mb-1 text-xs color-gray-11">
              Formular
            </div>
            <div class="font-geist text-lg color-gray-12 font-bold">
              {{ statusData?.receiver }}
            </div>
            <div class="font-geist mb-2 text-sm color-gray-8">
              {{ statusData?.form_id }}
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
