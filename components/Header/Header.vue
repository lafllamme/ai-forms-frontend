<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import ColorMode from '~/components/Buttons/ColorMode/ColorMode.vue'

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

// Glass effect mouse highlight
const headerRef = ref<HTMLElement | null>(null)
const glassSpot = ref<HTMLDivElement | null>(null)
let spotTimeout: number | null = null

function handleMouseMove(e: MouseEvent) {
  if (!headerRef.value || !glassSpot.value)
    return
  const rect = headerRef.value.getBoundingClientRect()
  const x = ((e.clientX - rect.left) / rect.width) * 100
  const y = ((e.clientY - rect.top) / rect.height) * 100
  glassSpot.value.style.transition = 'background 120ms cubic-bezier(0.5,0.2,0.1,1)'
  glassSpot.value.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.33) 0%, rgba(255,255,255,0.14) 36%, transparent 85%)`
  if (spotTimeout)
    window.clearTimeout(spotTimeout)
  spotTimeout = window.setTimeout(() => {
    if (glassSpot.value)
      glassSpot.value.style.transition = ''
  }, 150)
}

onMounted(() => {
  if (headerRef.value)
    headerRef.value.addEventListener('mousemove', handleMouseMove)
})
onBeforeUnmount(() => {
  if (headerRef.value)
    headerRef.value.removeEventListener('mousemove', handleMouseMove)
  if (spotTimeout)
    window.clearTimeout(spotTimeout)
})
</script>

<template>
  <!-- GLOBAL SVG FILTER for all glass! Only include ONCE per app, e.g. in app.vue or main layout -->
  <svg style="display:none">
    <filter id="glass-distortion" filterUnits="objectBoundingBox" height="100%" width="100%" x="0%" y="0%">
      <feTurbulence baseFrequency="0.007 0.02" numOctaves="1" result="turb" seed="17" type="fractalNoise" />
      <feGaussianBlur in="turb" result="blur" stdDeviation="2" />
      <feDisplacementMap in="SourceGraphic" in2="blur" scale="22" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </svg>

  <header
    ref="headerRef"
    :class="useClsx(
      'liquid-glass-header group',
      'fixed left-1/2 top-3 z-50 max-w-2xl min-w-[340px] md:min-w-[420px] w-[30vw]',
      'flex items-center justify-between overflow-hidden border rounded-full p-2 pl-6 pr-4 shadow-xl outline-none transition-all duration-500 -translate-x-1/2 hover:shadow-2xl',
      'backdrop-blur-[16px] bg-[rgba(255,255,255,0.25)] dark:bg-[rgba(32,34,50,0.14)]',
      'border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.13)]',
    )"
    aria-label="Main Header"
    role="banner"
    tabindex="-1"
  >
    <!-- Real liquid glass distortion layer (SVG filter) -->
    <div
      class="pointer-events-none absolute inset-0 z-0"
      style="filter: url(#glass-distortion);"
    />

    <!-- Interactive light spot -->
    <div
      ref="glassSpot"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 z-10 transition-all duration-300"
      style="background: radial-gradient(circle at 60% 40%, rgba(255,255,255,0.23) 0%, rgba(255,255,255,0.12) 36%, transparent 85%)"
    />

    <!-- Extra shine/highlight streaks -->
    <div class="pointer-events-none absolute inset-0 z-20 opacity-40">
      <svg height="100%" width="100%">
        <defs>
          <linearGradient id="streak" x1="0" x2="100%" y1="0" y2="100%">
            <stop offset="0%" stop-color="#fff" stop-opacity="0.17" />
            <stop offset="50%" stop-color="#fff" stop-opacity="0.05" />
            <stop offset="100%" stop-color="#fff" stop-opacity="0" />
          </linearGradient>
        </defs>
        <rect fill="url(#streak)" height="100%" width="100%" x="0" y="0" />
      </svg>
    </div>

    <!-- Navigation -->
    <nav
      aria-label="Main"
      class="font-manrope z-30 flex items-center gap-3 color-pureBlack md:gap-6 dark:color-pureWhite"
    >
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
.liquid-glass-header {
  /* Crisp blur & shine (Apple style) */
  -webkit-backdrop-filter: blur(16px) saturate(185%);
  backdrop-filter: blur(16px) saturate(185%);
  background-clip: padding-box;
  box-shadow:
    0 8px 32px 0 rgba(31, 38, 135, 0.16),
    0 1.5px 8px rgba(255, 255, 255, 0.13),
    inset 0 4px 18px rgba(255, 255, 255, 0.18);
}

.liquid-glass-header:hover {
  box-shadow:
    0 12px 48px 0 rgba(31, 38, 135, 0.24),
    0 1.5px 12px rgba(255, 255, 255, 0.18),
    inset 0 6px 36px rgba(255, 255, 255, 0.32);
}

a:focus-visible,
button:focus-visible {
  outline: none !important;
  box-shadow: 0 0 0 3px #3b82f6aa !important;
}

@media (prefers-reduced-transparency: reduce) {
  .liquid-glass-header {
    background: #f8fafc !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
  }
}
</style>
