<script lang="ts" setup>
const hasHovered = ref(false)

function handleHover() {
  hasHovered.value = !hasHovered.value
  consola.debug('CheatHeader hover')
}
</script>

<template>
  <div
    class="flex items-center justify-center gap-2 pb-4 md:justify-start"
    @mouseenter="handleHover"
    @mouseleave="handleHover"
  >
    <div class="group size-12 flex items-center justify-center rounded-full bg-indigo-5 hover:bg-sky-3">
      <Icon v-if="hasHovered" class="size-8 color-sky-12" name="mdi:robot-excited" />
      <Icon v-else class="size-8 color-sky-12" name="mdi:robot-happy" />
    </div>

    <div>
      <h2 class="font-prata text-xl color-sky-12 font-medium tracking-tight antialiased">
        Smart Form Assistant
      </h2>
      <p class="text-xs color-gray-12 font-thin">
        Intelligente Formular-Begleitung
      </p>
    </div>
  </div>
</template>
