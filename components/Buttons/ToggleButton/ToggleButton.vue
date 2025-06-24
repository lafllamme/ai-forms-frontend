<script lang="ts" setup>
defineProps<{ open: boolean }>()
defineEmits(['click'])
</script>

<template>
  <button
    :class="useClsx(
      'hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-5',
      'absolute z-30 h-14 w-7 flex items-center justify-center',
      'rounded-l-xl',
      'bg-gray-6 transition-all duration-200',
    )"
    aria-label="Toggle chat summary"
    @click="$emit('click')"
  >
    <Icon
      :class="open ? '' : '-rotate-180'"
      class="size-6 color-gray-12 transition-transform duration-300"
      name="iconoir:nav-arrow-left"
    />
  </button>
</template>
