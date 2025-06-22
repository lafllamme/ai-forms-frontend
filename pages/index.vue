<script lang="ts" setup>
import FormChat from '@/components/Form/FormChat.vue'
import SideBar from '@/components/Layout/SideBar/SideBar.vue'
import CheatHeader from '~/components/Chat/ChatHeader/CheatHeader.vue'

const { data } = await useFetch('/api/chat')

consola.debug('Data fetched from API:', data.value)
</script>

<template>
  <div class="flex h-svh">
    <SideBar />
    <!-- Chat Form Section -->
    <div class="w-full flex justify-center md:w-3/4">
      <FormChat />
    </div>
    <!-- Summary Section -->
    <div
      class="w-1/4 flex flex-col justify-start bg-gray-6 p-2 py-24 color-sky-11 <lg:hidden"
    >
      <CheatHeader />
      <div>
        <p class="font-manrope text-center font-medium tracking-tight antialiased">
          Summary of the form status
        </p>
      </div>
    </div>
  </div>
</template>
