// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: [
    "~/assets/css/main.css",
    "@fortawesome/fontawesome-svg-core/styles.css",
  ],
  nitro: {
    plugins: ["~/server/index.ts"],
  },
  gtag: {
    id: "G-2SNMH20JBD",
  },
  runtimeConfig: {
    dbURI: process.env.DB_URI,
    salt: process.env.SALT, 
    key: process.env.JWT_KEY
  },
  vite: {
    plugins: [tailwindcss()],
  },

  modules: ["nuxt-gtag"],
});
