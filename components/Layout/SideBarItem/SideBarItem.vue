<script lang="ts" setup>
const props = defineProps<{
  open: boolean
  icon: string
  label: string
}>()
</script>

<template>
  <a
    :class="open ? 'justify-start' : 'justify-center'"
    class="group flex items-center gap-3 rounded-lg px-2 py-2 text-gray-12 transition hover:bg-sky-2/40"
    href="#"
  >
    <Icon :name="icon" class="size-6" />
    <span v-if="open" class="font-manrope ml-1 truncate text-base">{{ label }}</span>
  </a>
</template>
