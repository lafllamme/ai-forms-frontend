<script setup>
// eslint-disable-next-line no-undef
const colorMode = useColorMode()

consola.debug(colorMode.preference)
</script>

<template>
  <div>
    <h1>Color mode: {{ colorMode }}</h1>
    <select v-model="colorMode.preference">
      <option value="system">
        System
      </option>
      <option value="light">
        Light
      </option>
      <option value="dark">
        Dark
      </option>
      <option value="sepia">
        Sepia
      </option>
    </select>
  </div>
</template>

