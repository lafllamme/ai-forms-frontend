<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  duration: {
    type: Number,
    default: 5,
  },
  radiantWidth: {
    type: Number,
    default: 90,
  },
  class: String,
})

const styleVar = computed(() => {
  return {
    '--radiant-anim-duration': `${props.duration}s`,
    '--radiant-width': `${props.radiantWidth}px`,
  }
})
</script>

<template>
  <p
    :class="
      useClsx(
        'color-gray-10A',
        // Radiant effect
        'radiant-animation bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--radiant-width)_100%] [transition:background-position_2s_cubic-bezier(.6,.6,0,1)_infinite]',
        // Radiant gradient
        'bg-gradient-to-r from-transparent via-indigo-11 via-50% to-transparent',
        $props.class,
      )
    "
    :style="styleVar"
  >
    <slot />
  </p>
</template>

<style scoped>
@keyframes radiant {
  0%,
  90%,
  100% {
    background-position: calc(-100% - var(--radiant-width)) 0;
  }
  30%,
  60% {
    background-position: calc(100% + var(--radiant-width)) 0;
  }
}

.radiant-animation {
  animation: radiant var(--radiant-anim-duration) infinite;
}
</style>
