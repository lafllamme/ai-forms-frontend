<script lang="ts" setup>
defineProps<{
  percent: number
  label?: string
  showPercent?: boolean
}>()
</script>

<template>
  <div class="mb-4 max-w-md w-full">
    <div class="mb-2 flex items-center justify-between">
      <span class="font-manrope text-sm text-gray-12 font-medium tracking-tight font-sans">
        {{ label || 'Completion Status' }}
      </span>
      <span
        v-if="showPercent !== false"
        class="font-manrope text-sm color-pureBlack font-bold tracking-tighter dark:color-pureWhite"
      >
        {{ Math.round(percent) }}%
      </span>
    </div>
    <div class="h-2 w-full flex items-center overflow-hidden rounded-full bg-gray-4">
      <div
        :style="{ width: `${Math.min(Math.max(percent, 0), 100)}%` }"
        class="progress-bar-shimmer relative h-3 rounded-full bg-sky-1"
      >
        <span
          class="shimmer-anim pointer-events-none absolute left-0 top-0 block h-full w-full"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.progress-bar-shimmer {
  position: relative;
  overflow: hidden;
  /* Custom cubic-bezier for smooth width transition */
  transition: width 1.9s cubic-bezier(0.33, 1, 0.68, 1);
}

.shimmer-anim {
  /* For light mode: a gentle dark shimmer */
  background: linear-gradient(100deg, transparent 60%, rgba(24, 24, 28, 0.18) 75%, transparent 90%);
  opacity: 0.5;
  animation: shimmer-glow 1.2s linear infinite;
}

.dark .shimmer-anim {
  background: linear-gradient(100deg, transparent 60%, rgba(255, 255, 255, 0.24) 75%, transparent 90%);
  opacity: 0.6;
}

@keyframes shimmer-glow {
  0% {
    transform: translateX(-70%);
  }
  100% {
    transform: translateX(130%);
  }
}
</style>
