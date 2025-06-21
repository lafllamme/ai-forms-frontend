<script lang="ts" setup>
import { ref } from 'vue'
import ColorMode from '~/components/Buttons/ColorMode/ColorMode.vue'

// Simple keyboard navigation demo (arrow keys for nav)
const navLinks = ref<HTMLAnchorElement[]>([])

function onKeydown(e: KeyboardEvent) {
  const i = navLinks.value.findIndex(el => el === document.activeElement)
  if (i !== -1) {
    if (e.key === 'ArrowRight') {
      navLinks.value[(i + 1) % navLinks.value.length]?.focus()
      e.preventDefault()
    }
    if (e.key === 'ArrowLeft') {
      navLinks.value[(i - 1 + navLinks.value.length) % navLinks.value.length]?.focus()
      e.preventDefault()
    }
  }
}
</script>

<template>
  <header
    :class="useClsx(
      'group backdrop-blur-sm',
      'fixed left-1/2 top-6',
      'z-50 max-w-2xl min-w-[340px] w-[90vw]',
      'flex items-center justify-between overflow-hidden',
      'border border-[rgba(255,255,255,0.22)] rounded-full bg-[rgba(245,245,255,0.22)]', 'p-2 pl-6 pr-4 shadow-xl outline-none transition-all duration-500',
      'md:w-[60vw] -translate-x-1/2 hover:shadow-2xl',
    )"
    aria-label="Main Header"
    role="banner"
    tabindex="-1"
  >
    <!-- Animated glass highlight layer -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 transition"
      style="background: radial-gradient(circle at 60% 40%, rgba(255,255,255,0.13) 0%, transparent 50%)"
    />
    <!-- Logo (use aria-label for screen readers) -->
    <div class="flex select-none items-center gap-2">
      <svg aria-hidden="true" fill="none" height="36" viewBox="0 0 36 36" width="36">
        <circle cx="18" cy="18" fill="url(#glass)" r="16" />
        <defs>
          <radialGradient id="glass" cx="50%" cy="50%" r="100%">
            <stop offset="0%" stop-color="#f0f3ff" />
            <stop offset="100%" stop-color="#c7d0e7" />
          </radialGradient>
        </defs>
      </svg>
      <span
        aria-label="LiquidGlass UI"
        class="geist-regular text-xl color-sky-11 font-bold tracking-tight"
      >
        AI Form Assistant
      </span>
    </div>
    <!-- Navigation (a11y: nav, keyboard nav, visible focus, sufficient contrast) -->
    <nav aria-label="Main" class="font-manrope flex items-center gap-3 color-gray-11 md:gap-6">
      <a
        v-for="(item, i) in ['Home', 'Features', 'About', 'Contact']"
        :key="item"
        :ref="el => navLinks[i]! = el"
        :class="useClsx(
          'text-slate-900 dark:text-slate-50 font-medium transition-colors duration-300',
          'hover:text-blue-600 focus-visible:text-blue-600',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          'focus-visible:ring-offset-2',
        )"
        :tabindex="0"
        href="#"
        @keydown="onKeydown"
      >
        {{ item }}
      </a>
    </nav>
    <!-- ColorMode  -->
    <ColorMode />
  </header>
</template>

<style scoped>
/* Stronger focus style for accessibility */
a:focus-visible,
button:focus-visible {
  outline: none !important;
  box-shadow: 0 0 0 3px #3b82f6aa !important;
}

header {
  background-clip: padding-box;
}

/* Fallback for reduced transparency preference */
@media (prefers-reduced-transparency: reduce) {
  header {
    background: #f8fafc !important;
    backdrop-filter: none !important;
  }
}
</style>
