<script lang="ts" setup>
import FormChat from '@/components/Form/FormChat.vue'
import SideBar from '@/components/Layout/SideBar/SideBar.vue'
import FormSummary from '~/components/Form/FormSummary/FormSummary.vue'

const { data } = await useFetch('/api/chat')

consola.debug('Chat data fetched:', data.value)
</script>

<template>
  <div class="relative flex bg-gray-3 h-svh">
    <SideBar />
    <div class="w-full flex justify-center">
      <div class="max-w-[45rem] w-full flex">
        <FormChat />
      </div>
    </div>
    <!-- Collapsible summary panel WITH button inside -->
    <FormSummary />
  </div>
</template>
