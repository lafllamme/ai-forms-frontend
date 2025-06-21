<script setup>
const colorMode = useColorMode()

consola.debug(colorMode.preference)
</script>

<template>
  <div>
    <Icon
      class="h-4 w-4 transition-all duration-300 ease-out group-hover:translate-x-1.5 group-hover:color-mint-11"
      name="ri:arrow-right-line"
    />
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
