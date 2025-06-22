<script lang="ts" setup>
// If we are in development mode, we set consola log level to 5
if (import.meta.dev) {
  consola.level = 5
  consola.info('Development mode enabled')
}
else {
  consola.level = 0
  consola.info('Production mode enabled')
}
</script>

<template>
  <NuxtLayout>
    <NuxtLoadingIndicator
      :throttle="0"
    />
    <NuxtPage />
  </NuxtLayout>
</template>
