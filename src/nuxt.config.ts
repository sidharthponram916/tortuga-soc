// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  app: {
    head: {
      meta: [
        { name: "google-site-verification", content: "Avs-LJTludUHd3T0xtnwvS7LGliGie7zan7vIJkluhc" },
      ],
    },
  },
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
    key: process.env.JWT_KEY,
    frontendURL: process.env.FRONTEND_URL,
  },
  vite: {
    plugins: [tailwindcss()],
  },

  modules: ["nuxt-gtag", "@pinia/nuxt"],
});
