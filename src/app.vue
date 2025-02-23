<template>
  <div>
    <Navbar />
    <br />
    <br />
    <br />
    <NuxtPage />
    <Footer></Footer>
  </div>
</template>

<script>
import { useHead } from "unhead";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";

useHead({
  title: "Tortuga SOC",
  meta: [
    { property: "og:title", content: "Tortuga" },
    { proprty: "og:description", content: "Make the most out of the Schedule of Classes."},
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://tortuga-soc.vercel.app/" },
    { property: "og:image", content: "https://tortuga-soc.vercel.app/assets/images/preview.png" },
    { property: "og:image:type", content: "image/png" },
    { property: "og:image:alt", content: "Tortuga" },
  ],
});
export default {
  components: {
    Navbar,
    Footer,
  },
  mounted() {
    document.title = "Tortuga - Schedule of Classes";
  },
};
</script>
