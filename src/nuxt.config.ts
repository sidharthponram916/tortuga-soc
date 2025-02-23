// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: [
    "~/assets/css/main.css",
    "@fortawesome/fontawesome-svg-core/styles.css",
  ],
  gtag: {
    id: "G-2SNMH20JBD",
  },
  vite: {
    plugins: [tailwindcss()],
  },

  modules: ["nuxt-gtag"],
});
