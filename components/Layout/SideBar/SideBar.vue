<script lang="ts" setup>
// Sidebar expand/collapse state
import SideBarItem from '@/components/Layout/SideBarItem/SideBarItem.vue'

const sidebarOpen = ref(false)
const hasHovered = ref(false)

const showIconSide = computed(() => {
  return hasHovered.value && !sidebarOpen.value
})

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

// change iconName from tabler:robot to tabler:sidebar
function handleHover() {
  if (sidebarOpen.value)
    hasHovered.value = false
  consola.debug('Sidebar hover')
  hasHovered.value = !hasHovered.value
}

watch(sidebarOpen, (open) => {
  if (open)
    hasHovered.value = false
}, { immediate: true })
</script>

<template>
  <div class="flex bg-gray-3 h-svh <md:hidden">
    <!-- Sidebar -->
    <aside
      :class="[
        sidebarOpen ? 'w-64 px-3' : 'w-16 px-1',
      ]"
      class="relative z-10 flex flex-col items-center border-r border-gray-6 border-solid py-4 transition-all duration-300 ease-in-out backdrop-blur-xl"
    >
      <!-- Logo + toggle -->
      <button
        class="group hover:bg-color-gray-12 mb-6 mt-2 h-12 w-12 flex items-center justify-center border border-gray-12 rounded-full border-solid bg-sky-1 transition transition-colors duration-300 ease-out dark:border-none hover:bg-sky-6"
        title="Toggle sidebar"
        @click="toggleSidebar"
        @mouseenter="handleHover"
        @mouseleave="handleHover"
      >
        <Icon
          v-if="showIconSide"
          class="size-6 color-sky-12 transition-colors duration-300 ease-out group-hover:color-gray-12"
          name="tabler:layout-sidebar-filled"
        />

        <Icon
          v-else
          class="size-8 color-sky-11 transition-colors duration-300 ease-out group-hover:color-gray-12"
          name="mdi:robot"
        />
      </button>

      <!-- Navigation items (collapse: show only icons, expand: show labels) -->
      <nav class="w-full flex flex-col gap-1">
        <SideBarItem
          :open="sidebarOpen"
          icon="tabler:pencil" label="Neuer Chat"
        />
        <SideBarItem
          :open="sidebarOpen"
          icon="tabler:search" label="Chats suchen"
        />
        <SideBarItem
          :open="sidebarOpen"
          icon="tabler:books" label="Bibliothek"
        />
        <SideBarItem
          :open="sidebarOpen"
          icon="tabler:code" label="Codex"
        />
        <SideBarItem
          :open="sidebarOpen"
          icon="tabler:player-play" label="Sora"
        />
        <SideBarItem
          :open="sidebarOpen"
          icon="tabler:apps" label="GPTs"
        />
        <SideBarItem
          :open="sidebarOpen"
          icon="tabler:robot" label="Dobby"
        />
        <SideBarItem
          :open="sidebarOpen"
          icon="tabler:user" label="Ticky"
        />
        <SideBarItem
          :open="sidebarOpen"
          icon="tabler:book" label="Elly"
        />
      </nav>

      <!-- Divider -->
      <div class="my-4 w-full border-t border-gray-3" />

      <!-- Section: Projects -->
      <div v-if="sidebarOpen" class="w-full">
        <div class="px-3 pb-1 pt-2 text-xs color-gray-10 font-semibold tracking-wide">
          Projekte
        </div>
        <nav class="flex flex-col gap-1">
          <SideBarItem :open="sidebarOpen" icon="tabler:folder" label="Neues Projekt" />
          <SideBarItem :open="sidebarOpen" icon="tabler:brand-linkedin" label="LinkedIn" />
          <SideBarItem :open="sidebarOpen" icon="tabler:file" label="AI Formular" />
          <SideBarItem :open="sidebarOpen" icon="tabler:app-window" label="App" />
        </nav>
      </div>

      <!-- Stretch to bottom -->
      <div class="flex-1" />

      <!-- Settings or user at bottom -->
      <button
        class="mb-2 mt-6 h-10 w-10 flex items-center justify-center rounded-full transition hover:bg-gray-2"
        title="Einstellungen"
      >
        <Icon class="size-6 color-sky-11" name="tabler:settings" />
      </button>
    </aside>
  </div>
</template>
