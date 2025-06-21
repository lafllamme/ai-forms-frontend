<script setup></script>

<template>
  <div class="relative">
    <!-- Main Content -->
    <div
        :class="useClsx(
        'transition-colors duration-600 ease-[cubic-bezier(0.33,1,0.68,1)]',
        'bg-pureBlack dark:bg-pureWhite',
      )"
    >
      <!-- <Header/>  -->
      <main>
        <slot name="default"/>
      </main>
      <!-- <Footer /> -->
      <!-- <ScrollTopButton /> -->
    </div>
  </div>
</template>
