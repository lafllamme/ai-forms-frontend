<script lang="ts" setup>
import FormChat from '@/components/Form/FormChat.vue'
import SideBar from '@/components/Layout/SideBar/SideBar.vue'
import FormSummary from '~/components/Form/FormSummary/FormSummary.vue'

const { data } = await useFetch('/api/chat')
const chatStore = useChatStore()
const { isLoading } = storeToRefs(chatStore)

// Show after a minimum delay if loading
const showBg = ref(false)
let fadeTimeout: ReturnType<typeof setTimeout> | null = null

watch(isLoading, (val) => {
  if (val) {
    // Only fade in after at least 2.3s
    fadeTimeout && clearTimeout(fadeTimeout)
    fadeTimeout = setTimeout(() => {
      showBg.value = true
    }, 2300)
  }
  else {
    // Fade out quickly (200ms)
    fadeTimeout && clearTimeout(fadeTimeout)
    showBg.value = false
  }
})

consola.debug('Chat data fetched:', data.value)
</script>

<template>
  <div class="relative flex overflow-hidden bg-gray-3 h-svh">
    <SideBar />
    <Transition
      appear
      mode="out-in"
      name="ripple-fade"
    >
      <Ripple
        v-if="showBg"
        key="ripple"
        circle-class="border-sky-12 bg-gray-10 blobed"
        class="[mask-image:linear-gradient(to_bottom,#00000,transparent)] bg-indigo-1A dark:[mask-image:linear-gradient(to_bottom,#D6E1FF,transparent)]"
      />
    </Transition>
    <div class="w-full flex justify-center">
      <div class="max-w-[45rem] w-full flex 2xl:max-w-[60rem]">
        <FormChat />
      </div>
    </div>
    <!-- Collapsible summary panel WITH button inside -->
    <FormSummary />
  </div>
</template>

<style scoped>
:deep(.blobed) {
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
}

.ripple-fade-enter-active {
  transition: opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.ripple-fade-leave-active {
  transition: opacity 0.9s cubic-bezier(0.55, 0, 0.1, 1);
}
.ripple-fade-enter-from,
.ripple-fade-leave-to {
  opacity: 0;
}
.ripple-fade-enter-to,
.ripple-fade-leave-from {
  opacity: 1;
}
</style>
