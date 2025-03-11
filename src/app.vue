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
