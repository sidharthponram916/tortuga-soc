// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  app: {
    head: {
      meta: [
        {
          name: "google-site-verification",
          content: "Avs-LJTludUHd3T0xtnwvS7LGliGie7zan7vIJkluhc",
        },
        { property: "og:title", content: "Tortuga SOC" },
        {
          property: "og:description",
          content:
            "Enhanced UMD Schedule of Classes, with an intuitive interface, course availability notifications, and more",
        },
        {
          property: "og:image",
          content: "https://tortugasoc.com/preview.png",
        },
        { property: "og:url", content: "https://tortugasoc.com/" },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "theme-color", content: "#E21833" },
        { name: "twitter:title", content: "Tortuga SOC" },
        {
          name: "twitter:description",
          content:
            "Enhanced course catalog at the University of Maryland, with an intuitive interface, course availability notifications, and more.",
        },
        {
          name: "twitter:image",
          content: "https://tortugasoc.com/preview.png",
        },
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
    eventbridgeURI: process.env.EVENTBRIDGE_SECRET,
    frontendURL: process.env.FRONTEND_URL,
  },
  vite: {
    plugins: [tailwindcss()],
  },

  modules: [
    "nuxt-gtag",
    "@pinia/nuxt",
    [
      "@nuxtjs/google-adsense",
      {
        id: "ca-pub-6101040520579866",
      },
    ],
  ],
});
