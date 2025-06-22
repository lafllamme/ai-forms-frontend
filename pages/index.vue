<script lang="ts" setup>
import ToggleButton from '@/components/Buttons/ToggleButton/ToggleButton.vue'
import CheatHeader from '@/components/Chat/ChatHeader/CheatHeader.vue'
import FormChat from '@/components/Form/FormChat.vue'
import SideBar from '@/components/Layout/SideBar/SideBar.vue'

const { data } = await useFetch('/api/chat')

consola.debug('Chat data fetched:', data.value)

const summaryOpen = ref(true)

function toggleSummary() {
  summaryOpen.value = !summaryOpen.value
}
</script>

<template>
  <div class="relative flex bg-gray-3 h-svh">
    <SideBar />
    <div class="w-full flex justify-center md:w-3/4">
      <FormChat />
    </div>
    <!-- Collapsible summary panel WITH button inside -->
    <div
      :class="[
        summaryOpen ? 'w-80 min-w-[20rem]' : 'w-0 min-w-0',
      ]"
      class="relative h-full transition-all duration-300 ease-in-out"
      style="will-change: width;"
    >
      <!-- Button is on summary when open -->
      <template v-if="summaryOpen">
        <ToggleButton
          :open="summaryOpen" class="absolute top-12 -left-7"
          @click="toggleSummary"
        />
      </template>

      <Transition mode="out-in" name="slide-panel">
        <div
          v-show="summaryOpen"
          key="open"
          class="absolute inset-0 h-full w-80 flex flex-col justify-start border-l border-gray-2 rounded-r-2xl bg-gray-6 p-6 color-sky-11 shadow-lg transition-all duration-300"
        >
          <CheatHeader />
          <!-- More summary content -->
        </div>
      </Transition>
    </div>
    <!-- Button is on screen edge when closed -->
    <template v-if="!summaryOpen">
      <ToggleButton
        id="debug"
        :open="summaryOpen" class="fixed right-0 top-12 z-50"
        @click="toggleSummary"
      />
    </template>
  </div>
</template>

<style scoped>
.slide-panel-enter-from,
.slide-panel-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.slide-panel-enter-active,
.slide-panel-leave-active {
  transition:
    transform 0.3s cubic-bezier(0.55, 0, 0.1, 1),
    opacity 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}

.slide-panel-enter-to,
.slide-panel-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>
