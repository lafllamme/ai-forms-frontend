<script lang="ts" setup>
import FormChat from '@/components/Form/FormChat.vue'

const { data } = await useFetch('/api/chat')

consola.debug('Data fetched from API:', data.value)
</script>

<template>
  <div>
    <div class="w-3/4 flex justify-center">
      <FormChat />
    </div>
  </div>
</template>
