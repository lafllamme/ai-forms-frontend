<script lang="ts" setup>
import FormChat from '@/components/Form/FormChat.vue'

const { data } = await useFetch('/api/chat')

consola.debug('Data fetched from API:', data.value)
</script>

<template>
  <div class="flex">
    <div class="w-3/4 flex justify-center">
      <FormChat />
    </div>
    <div class="w-1/4 flex justify-center b-l-1 border-sky-11 border-solid bg-gray-3 py-24 color-sky-11">
      <p class="font-manrope text-center font-medium tracking-tight antialiased">
        Summary of the form status
      </p>
    </div>
  </div>
</template>
