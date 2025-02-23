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
    {
      property: "og:description",
      content: "Schedule of Classes, Redefined.",
    },
    { property: "og:url", content: "https://tortuga-soc.vercel.app" },
    { property: "og:image", content: "./assets/images/preview.png" },
    { name: "theme-color", content: "#FF0000" },
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
