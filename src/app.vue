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
    {
      hid: "description", // `hid` helps prevent duplicate meta tags
      name: "description",
      content:
        "Find and plan your UMD courses easily with Tortuga, a fast and user-friendly alternative to UMD Schedule of Classes.",
    },
  ],
});

export default {
  components: {
    Navbar,
    Footer,
  },
  async mounted() {
    document.title = "Tortuga - Schedule of Classes";

    console.log(useAuthStore().loggedIn);
  },
};
</script>
