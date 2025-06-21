<script lang="ts" setup>
import ColorMode from '@/components/Buttons/ColorMode/ColorMode.vue'

const { data } = await useFetch('/api/chat')

consola.debug('Data fetched from API:', data.value)
</script>

<template>
  <div class="px-4 py-4">
    <div class="flex justify-center md:justify-start">
      <h2 class="font-studio-feixen-serif-mono text-4xl font-medium tracking-tight antialiased">
        Welcome to AI Form Assistant
      </h2>
    </div>
    <div>
      {{ data }}
    </div>
    <ColorMode />
  </div>
</template>
