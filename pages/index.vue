<script lang="ts" setup>
const { data } = await useFetch('/api/chat')

consola.debug('Data fetched from API:', data.value)
</script>

<template>
  <div class="px-4 py-4">
    <div class="flex justify-center md:justify-start">
      <h2 class="font-prata text-4xl color-sky-12 font-medium tracking-tight antialiased">
        Welcome to AI Form Assistant
      </h2>
    </div>
    <div class="font-studio-feixen-edgy h-[300vh] text-xl color-gray-11 tracking-tight">
      {{ data }}
    </div>
  </div>
</template>
