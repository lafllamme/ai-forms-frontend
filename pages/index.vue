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
    <!-- Collapsible summary panel -->
    <!-- toggle button, open  section -->
    <ToggleButton
      :open="summaryOpen" @click="toggleSummary"
    />

    <!-- Animated transition -->
    <Transition mode="out-in" name="slide-panel">
      <div
        v-show="summaryOpen"
        key="open"
        class="fixed right-0 top-0 z-20 h-full w-80 flex flex-col justify-start bg-gray-6 p-2 py-24 color-sky-11 shadow-lg transition-all duration-300 <lg:hidden"
      >
        <CheatHeader />
        <!-- More summary content -->
      </div>
    </Transition>
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
