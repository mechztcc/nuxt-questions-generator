// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],
  css: ['./main.css'],
  app: {
    head: {
      bodyAttrs: {
        class: "bg-zinc-100",
      },
    },
  },
  
})