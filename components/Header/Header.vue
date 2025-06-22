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

const menuEntries = ref([
  { label: 'Home', href: '#' },
  { label: 'Docs', href: '#' },
  { label: 'Resources', href: '#' },
  { label: 'Concept', href: '#' },
])
</script>

<template>
  <header
    :class="useClsx(
      'group backdrop-blur-sm',
      'fixed left-1/2 top-6',
      'z-50 max-w-2xl min-w-[340px] md:min-w-[420px] w-[30vw]',
      'flex items-center justify-around overflow-hidden',
      'border rounded-full',
      'border-[rgba(0,0,0,0.06)] bg-[rgba(255,255,255,0.7)]',
      'dark:border-[rgba(255,255,255,0.22)] dark:bg-[rgba(245,245,255,0.22)]',
      'p-2 pl-6 pr-4 shadow-xl outline-none transition-all duration-500',
      '-translate-x-1/2 hover:shadow-2xl',
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
    <!--    <div
          class="group flex select-none items-center gap-2 color-sky-11"
        >
          <Icon
            class="size-8 color-sky-11 transition-colors duration-300 ease-out group-hover:color-pureBlack dark:group-hover:color-pureWhite"
            name="tabler:robot"
          />
          <span
            aria-label="LiquidGlass UI"
            class="geist-regular text-sm color-sky-11 font-bold tracking-tight transition-colors duration-300 ease-out md:text-xl group-hover:color-pureBlack dark:group-hover:color-pureWhite"
          >
            AI Form Assistant
          </span>
        </div> -->
    <!-- Navigation (a11y: nav, keyboard nav, visible focus, sufficient contrast) -->
    <nav aria-label="Main" class="font-manrope flex items-center gap-3 color-pureBlack md:gap-6 dark:color-pureWhite">
      <a
        v-for="(item, i) in menuEntries"
        :key="item.label"
        :ref="() => navLinks[i]"
        :class="useClsx(
          'font-medium tracking-normal transition-colors duration-300',
          'hover:color-sky-8 focus-visible:color-sky-8',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          'focus-visible:ring-offset-2 text-sm md:text-base',
        )"
        :href="item.href"
        :tabindex="0"
        @keydown="onKeydown"
      >
        {{ item.label }}
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
