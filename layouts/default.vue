<script setup>
</script>

<template>
  <div
    :class="useClsx(
      'transition-colors duration-600 ease-[cubic-bezier(0.33,1,0.68,1)]',
      'dark:bg-pureBlack bg-pureWhite',
    )"
  >
    <Header />
    <!-- Main Content -->
    <div
      :class="useClsx(
      )"
    >
      <main class="pt-[calc(4rem+1rem)]">
        <slot name="default" />
      </main>
      <!-- <Footer /> -->
      <!-- <ScrollTopButton /> -->
    </div>
  </div>
</template>
