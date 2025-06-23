// https://nuxt.com/docs/api/configuration/nuxt-config
import * as process from 'node:process'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  // Auto-imports
  imports: {
    presets: [
      {
        from: 'consola',
        imports: ['consola'],
      },
    ],
  },

  runtimeConfig: {
    // Private config (server-only, not exposed to browser)
    // mySecret: process.env.MY_SECRET,  // Example only

    public: {
      FORM_CHAT_API_URL: process.env.PUBLIC_FORM_CHAT_API_URL,
    },
  },

  // Color mode configuration
  colorMode: {
    preference: 'system',
    fallback: 'dark',
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storage: 'cookie',
    storageKey: 'color-mode',
  },

  // Global CSS
  css: [
    '@/assets/reset/main.ts',
  ],

  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxtjs/color-mode',
    '@unocss/nuxt',
    '@pinia/nuxt',
  ],
})
