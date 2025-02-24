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
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";

useHead({
  title: "Tortuga SOC",
  meta: [
    { property: "og:title", content: "Tortuga" },
    { proprty: "og:description", content: "Make the most out of the Schedule of Classes."},
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
