<script lang="ts" setup>
import FormChat from '@/components/Form/FormChat.vue'

const { data } = await useFetch('/api/chat')

consola.debug('Data fetched from API:', data.value)
</script>

<template>
  <div class="px-4 py-4">
    <div class="flex justify-center pb-4 md:justify-start">
      <h2 class="font-prata text-4xl color-sky-12 font-medium tracking-tight antialiased">
        Welcome to AI Form Assistant
      </h2>
    </div>
    <FormChat />
  </div>
</template>
