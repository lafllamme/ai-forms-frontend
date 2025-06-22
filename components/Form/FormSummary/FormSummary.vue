<script lang="ts" setup>
import ToggleButton from '~/components/Buttons/ToggleButton/ToggleButton.vue'
import CheatHeader from '~/components/Chat/ChatHeader/CheatHeader.vue'

const summaryOpen = ref(true)

function toggleSummary() {
  summaryOpen.value = !summaryOpen.value
}
</script>

<template>
  <!-- Always keep the container fixed to the right edge -->
  <div
    :style="{
      width: summaryOpen ? '20rem' : '1.75rem', // 1.75rem == w-7 (button width)
      minWidth: summaryOpen ? '20rem' : '1.75rem',
      overflow: 'visible',
      boxShadow: summaryOpen ? '0 2px 24px 0 #0002' : '',
      background: summaryOpen ? 'var(--un-bg-gray-6, #333)' : 'transparent',
    }"
    class="fixed right-0 top-0 z-50 h-full flex items-start transition-all duration-300"
  >
    <!-- The button is always present, just shifts with the panel -->
    <ToggleButton
      :class="useClsx(
        'absolute top-12 z-20 z-50',
        summaryOpen ? '-left-7' : 'left-0',
      )"
      :open="summaryOpen"
      @click="toggleSummary"
    />
    <!-- Content only visible when open -->
    <Transition mode="out-in" name="slide-panel">
      <div
        v-if="summaryOpen"
        key="open"
        class="relative h-full w-full flex flex-col justify-start border-l border-gray-2 bg-gray-6 p-6 color-sky-11"
        style="transition: background 0.3s;"
      >
        <div class="mt-6 animate-fade-in">
          <CheatHeader />
        </div>
        <!-- More summary content -->
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
