<script lang="ts" setup>
import ToggleButton from '@/components/Buttons/ToggleButton/ToggleButton.vue'
import CheatHeader from '@/components/Chat/ChatHeader/CheatHeader.vue'
import ProgressBar from '@/components/Form/ProgressBar/ProgressBar.vue'
import HyperText from '@/components/Text/HyperText/HyperText.vue'
import NumberTicker from '@/components/Text/NumberTicker/NumberTicker.vue'
import { useStatus } from '@/composables/useStatus'
import { useChatStore } from '@/stores/chat'

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

  for (const key of Object.keys(statusData.value)) {
    if (!(key in newData))
      delete statusData.value[key]
  }
  for (const key of Object.keys(newData)) {
    statusData.value[key] = newData[key]
  }

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

function getRandomTimeout() {
  return Math.floor(Math.random() * (12000 - 8000 + 1)) + 8000
}

function fetchStatus() {
  isLoading.value = true
  const timeout = getRandomTimeout()
  consola.debug?.('[FormSummary] Fetching status with timeout:', timeout)

  getStatus(sessionId.value)
    .then((res) => {
      patchStatusWithProgressClamp(res)
      chatStore.setStatus(res)
      hasLoadedOnce = true
      errorMsg.value = null
      isLoading.value = false
      setTimeout(fetchStatus, timeout)
    })
    .catch(() => {
      errorMsg.value = 'Fehler beim Laden des Status'
      isLoading.value = false
      setTimeout(fetchStatus, timeout)
    })
}

// -- Computed: progress percentage and phase
const percentComplete = computed(() => statusData.value?.progress?.percentage_complete ?? 0)
const phase = computed(() => statusData.value?.phase ?? '')

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
        class="relative h-full w-full flex flex-col border-gray-2 bg-sand-8 px-0 pt-0 dark:bg-gray-1"
        style="transition: background 0.3s;"
      >
        <!-- Header -->
        <Transition appear name="section-fade-slide">
          <div
            key="header"
            class="border-b border-gray-2 bg-sand-8 px-7 pt-4 dark:bg-gray-1"
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
              <div class="font-geist mt-2 flex flex items-center justify-between text-xs color-gray-11">
                <div class="flex items-center justify-start gap-1">
                  <p>Phase</p>
                  <HyperText
                    :animate-on-load="true"
                    :duration="800"
                    :text="statusData?.phase || ''"
                    class="color-pureBlack uppercase dark:color-pureWhite"
                  />
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
        </Transition>

        <Transition appear name="section-fade-slide">
          <hr key="divider" class="mx-6 my-2 border-gray-9">
        </Transition>

        <!-- Stats Row -->
        <Transition appear name="section-fade-slide">
          <div key="stats" class="my-2 flex items-center justify-between gap-2">
            <div class="flex flex-1 flex-col items-center">
              <NumberTicker
                :value="statusData?.analytics?.llm_calls_count ?? 0"
                class="jetbrains-mono-regular text-xl color-gray-12 font-bold"
              />
              <span class="font-dm-mono mt-0.5 text-xs color-gray-11">Requests</span>
            </div>
            <div class="flex flex-1 flex-col items-center">
              <div class="jetbrains-mono-regular text-xl color-gray-12 font-bold">
                <NumberTicker
                  :value="statusData?.analytics?.form_complexity ?? 0 "
                />
              </div>
              <span
                class="font-dm-mono mt-0.5 text-xs color-gray-11 capitalize"
              >{{ statusData?.analytics?.form_difficulty ?? 'Easy' }}</span>
            </div>
            <div class="flex flex-1 flex-col items-center">
              <span class="jetbrains-mono-regular text-xl color-gray-12 font-bold">{{
                statusData?.progress?.answered_fields ?? 0
              }}</span>
              <span class="font-dm-mono mt-0.5 text-xs color-gray-11">
                {{ statusData?.progress?.answered_fields > 1 ? 'Felder' : 'Feld' }}
              </span>
            </div>
          </div>
        </Transition>

        <Transition appear name="section-fade-slide">
          <hr key="divider" class="mx-6 my-2 border-gray-9">
        </Transition>

        <!-- Formular Meta (now above "Aktuelles Feld") -->
        <Transition appear name="section-fade-slide">
          <div key="meta" class="px-6 py-4">
            <div
              v-if="statusData?.receiver"
              class="font-geist mb-2 flex items-center justify-between b-1 text-xs color-gray-11 font-light font-medium tracking-tight"
            >
              <p class="uppercase">
                Ausgewähltes Formular
              </p>
              <div class="font-dm-mono rounded-full bg-indigo-12 px-1 text-sm color-sky-6">
                {{ statusData?.form_id }}
              </div>
            </div>
            <div class="text-lg color-gray-12 font-semibold tracking-wide">
              <HyperText
                :animate-on-load="true"
                :duration="800"
                :text="statusData?.receiver || ''"
                class="font-manrope"
              />
            </div>
          </div>
        </Transition>

        <!-- Zusammenfassung: Animated, Staggered Chips -->
        <Transition appear name="section-fade-slide">
          <div
            v-if="statusData?.phase === 'done' && statusData?.answers && Object.keys(statusData.answers).length"
            class="mt-4 px-4 pb-6"
          >
            <div class="geist-regular mb-2 flex items-center gap-2 text-sm color-gray-12 font-light">
              <Icon class="size-5 color-indigo-10" name="iconoir:attachment" />
              <p>Deine bisherigen Eingaben</p>
            </div>
            <TransitionGroup v-if="true" class="flex flex-col gap-2" name="chip-fade-stagger" tag="div">
              <div
                v-for="(val, key, idx) in statusData.answers"
                :key="key"
              >
                <div
                  v-if="idx !== 0"
                  :style="`transition-delay: ${idx * 90}ms`"
                  class="flex items-center gap-2 rounded-md bg-indigo-1 px-4 py-2 transition-all dark:bg-gray-7 hover:bg-indigo-4 dark:hover:bg-gray-5"
                >
                  <p class="font-dm-mono text-xs color-indigo-11 font-thin leading-none tracking-wider uppercase">
                    {{ key }}
                  </p>
                  <p class="geist-regular mb-1 text-base color-gray-12 font-medium leading-none">
                    {{ val }}
                  </p>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </Transition>

        <!-- Aktuelles Feld with swish/slide animation -->
        <div
          v-if="statusData?.progress?.current_field"
          :key="statusData.progress.current_field.label"
          class="mb-4 bg-indigo-12"
          style="min-height: 130px;"
        >
          <div
            class="font-geist mb-2 flex items-center justify-start gap-2 px-6 pb-1 pt-5 text-base color-sky-1 font-bold leading-none tracking-tight uppercase"
          >
            <Icon class="size-5 color-indigo-9" name="tabler:target" />
            <h4 class="mb-px color-sky-2 leading-none">
              Aktuelles Feld
            </h4>
          </div>
          <div class="px-6 py-5 pt-0">
            <Transition
              appear
              mode="out-in"
              name="swish-field"
            >
              <div
                class="flex flex-col gap-1 rounded-xl bg-gray-7 px-5 py-4 dark:bg-gray-1"
              >
                <div class="text-lg color-pureBlack font-bold dark:color-pureWhite">
                  <div class="geist-regular flex items-center justify-start gap-2 font-bold tracking-wide">
                    <p>{{ statusData.progress.current_field.label }}</p>
                    <div
                      v-if="statusData.progress.current_field.required"
                    >
                      *
                    </div>
                    <div
                      class="jetbrains-mono-regular ml-1 flex justify-end text-xs color-gray-11 font-light capitalize"
                    >
                      <p>
                        ({{ statusData.progress.current_field.type }})
                      </p>
                    </div>
                  </div>
                </div>
                <span class="font-manrope text-sm color-sky-11 font-medium">In Bearbeitung</span>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Ausstehend: staggered, smooth, animated chips -->
        <Transition appear name="section-fade-slide">
          <div v-if="statusData?.progress?.missing_fields?.length" key="missing-fields" class="mb-4 px-6">
            <div
              class="font-geist mb-2 flex items-center justify-between gap-2 text-base color-gray-12 font-bold tracking-wide uppercase"
            >
              Ausstehende Felder
              <div
                class="aspect-square flex items-center rounded-full bg-indigo-7 px-2 py-0.5 text-xs color-pureBlack font-bold dark:color-pureWhite"
              >
                <NumberTicker :value="statusData.progress.missing_fields.length" />
              </div>
            </div>
            <TransitionGroup name="list-fade-stagger" tag="div">
              <div class="grid grid-cols-2 gap-2">
                <div
                  v-for="(field, idx) in statusData.progress.missing_fields"
                  :key="field"
                  :style="`transition-delay: ${idx * 60}ms`"
                  class="font-dm-mono flex items-center justify-start rounded-md bg-gray-1 px-3 py-2 text-sm color-gray-12 font-medium dark:bg-gray-7"
                >
                  {{ field }}
                </div>
              </div>
            </TransitionGroup>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Sticky bottom progress message (outside Transition above, still inside .fixed sidebar div) -->
    <div class="pointer-events-none fixed bottom-6 right-[calc(22rem+1.5rem)] z-[100] w-[calc(22rem-2.5rem)]">
      <transition name="fade">
        <div
          v-if="percentComplete === 100 && phase !== 'done'"
          class="pointer-events-auto border border-yellow-7 rounded-xl bg-yellow-1/90 px-4 py-2 text-center text-sm text-yellow-10 font-semibold shadow-lg"
        >
          Bitte bestätigen Sie die Übersicht
        </div>
        <div
          v-else-if="percentComplete === 100 && phase === 'done'"
          class="pointer-events-auto border border-green-8 rounded-xl bg-green-1/90 px-4 py-2 text-center text-sm text-green-10 font-semibold shadow-lg"
        >
          Vielen Dank für Ihre Eingabe!
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Section fade/slide/blur/scale */
.section-fade-slide-enter-active,
.section-fade-slide-leave-active {
  transition:
    opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.9s cubic-bezier(0.4, 0, 0.2, 1),
    filter 0.9s cubic-bezier(0.4, 0, 0.2, 1);
}

.section-fade-slide-enter-from,
.section-fade-slide-leave-to {
  opacity: 0;
  transform: translateY(18px) scale(0.98);
  filter: blur(2px);
}

.section-fade-slide-enter-to,
.section-fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
}

/* Swish/slide: right to center on enter, center to left on leave for current field */
.swish-field-enter-active,
.swish-field-leave-active {
  transition:
    opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1),
    transform 1.2s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, opacity;
  position: relative;
  z-index: 0;
}

.swish-field-enter-from {
  opacity: 0;
  transform: translateX(90px) scale(0.98);
}

.swish-field-enter-to {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.swish-field-leave-from {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.swish-field-leave-to {
  opacity: 0;
  transform: translateX(-90px) scale(0.98);
}

/* Staggered list for missing fields */
.list-fade-stagger-enter-active {
  transition:
    opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-fade-stagger-leave-active {
  transition:
    opacity 0.28s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-fade-stagger-enter-from,
.list-fade-stagger-leave-to {
  opacity: 0;
  transform: translateY(26px) scale(0.95);
}

.list-fade-stagger-enter-to,
.list-fade-stagger-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Keep your existing slide-panel styles for side opening */
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

/* Staggered chip animation for Zusammenfassung */
.chip-fade-stagger-enter-active {
  transition:
    opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.chip-fade-stagger-leave-active {
  transition:
    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.chip-fade-stagger-enter-from,
.chip-fade-stagger-leave-to {
  opacity: 0;
  transform: translateY(22px) scale(0.97);
}

.chip-fade-stagger-enter-to,
.chip-fade-stagger-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>
