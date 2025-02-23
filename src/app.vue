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
import Footer from "@/components/Footer.vue"
export default {
  components: {
    Navbar,
    Footer
  },
  mounted() { 
    document.title = "Tortuga - Schedule of Classes"
  }
};
</script>
