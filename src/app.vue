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
import axios from "axios";

useHead({
  title: "Tortuga SOC",
  meta: [
    { property: "og:title", content: "Tortuga" },
    {
      property: "og:description",
      content: "Make the most out of the Schedule of Classes.",
    },
    { name: "theme-color", content: "#a81b1b" },
  ],
});

export default {
  components: {
    Navbar,
    Footer,
  },
  async mounted() {
    const token = useCookie("auth_token");

    try {
      const data = await useFetch("/api/auth/verify", {
        credentials: "include",
      });

      console.log(data)
    } catch (e) {
      console.log(e.message);
    }

    document.title = "Tortuga - Schedule of Classes";
  },
};
</script>
