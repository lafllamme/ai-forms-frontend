<script lang="ts" setup>
defineProps<{ open: boolean }>()
defineEmits(['click'])
</script>

<template>
  <button
    aria-label="Toggle chat summary"
    class="absolute z-30 h-14 w-7 flex items-center justify-center border border-r-0 border-gray-2 rounded-l-xl bg-gray-6 transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-sky-5"
    @click="$emit('click')"
  >
    <Icon
      :class="open ? '' : '-rotate-180'"
      class="size-6 color-gray-12 transition-transform duration-300"
      name="tabler-chevron-right"
    />
  </button>
</template>
