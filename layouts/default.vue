<script setup>
</script>

<template>
  <div
    :class="useClsx(
      'relative transition-colors duration-600 ease-[cubic-bezier(0.33,1,0.68,1)]',
      'dark:bg-pureBlack bg-pureWhite',
    )"
  >
    <div class="absolute right-5 top-5 flex items-center rounded-full bg-sky-12A p-2 py-px color-sky-5">
      <span class="figtree-regular text-sm font-light">Beta</span>
    </div>
    <Header />
    <!-- Main Content -->
    <div
      :class="useClsx(
      )"
    >
      <main>
        <slot name="default" />
      </main>
      <!-- <Footer /> -->
      <!-- <ScrollTopButton /> -->
    </div>
  </div>
</template>
