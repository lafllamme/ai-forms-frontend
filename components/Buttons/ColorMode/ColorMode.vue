<script setup>
const colorMode = useColorMode()

consola.debug(colorMode.preference)

function handleColorModeChange() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  consola.debug(`Color mode changed to: ${colorMode.preference}`)
}

const isDark = computed(() => {
  if (import.meta.server)
    return 'dark'
  return colorMode.value === 'dark'
})
</script>

<template>
  <button
    :class="useClsx(
      'flex items-center justify-center gap-2',
      'rounded-full color-sky-12 px-2 py-1.5',
      'text-sm text-gray-12 font-medium',
      'transition-colors duration-300 ease-in-out',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-6A',
    )"
    aria-label="Toggle color mode"
    @click="handleColorModeChange"
  >
    <Icon
      v-show="isDark"
      :class="useClsx(
        'size-6 transition-all duration-300 ease-out',
        'group-hover:color-sky-11',
      )"
      name="tabler:moon"
    />
    <Icon
      v-show="!isDark"
      :class="useClsx(
        'size-6 transition-all duration-300 ease-out',
        'group-hover:color-sky-11',
      )"
      name="tabler:sun"
    />
  </button>
</template>
