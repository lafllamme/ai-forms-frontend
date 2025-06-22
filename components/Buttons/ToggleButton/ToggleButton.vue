<script lang="ts" setup>
defineProps<{ open: boolean }>()
defineEmits(['click'])
</script>

<template>
  <button
    aria-label="Toggle chat summary"
    class="group fixed right-80 top-8 z-30 h-12 w-12 flex items-center justify-center rounded-full shadow-xl outline-none ring-2 ring-sky-5 transition-all duration-200 from-sky-7 to-sky-10 bg-gradient-to-br active:scale-95 hover:scale-105"
    @click="$emit('click')"
  >
    <span
      :class="open ? 'rotate-180' : ''"
      class="inline-block transition-transform duration-300"
    >
      <!-- You can use an icon font or SVG here. Example: -->
      <svg
        class="lucide lucide-chevron-right color-white" fill="none" height="28" stroke="currentColor" stroke-linecap="round"
        stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"
        width="28"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </span>
  </button>
</template>
