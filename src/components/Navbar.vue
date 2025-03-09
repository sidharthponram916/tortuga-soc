<template>
  <div
    class="items-center flex fixed left-0 right-0 p-4 bg-slate-950 items-center text-slate-200 overflow-visible"
  >
    <nuxt-link to="/" class="cursor-pointer">
      <span class="flex items-center space-x-3">
        <img src="../assets/images/turtle.png" class="w-10 rounded-full" />
        <div class="hidden md:flex md:flex-col">
          <div class="text-xl font-bold text-slate-100">
            Tortuga <span class="text-sm text-red-400">v1.0</span>
          </div>
          <div class="text-sm text-slate-100">
            <font-awesome-icon :icon="['fas', 'location-dot']" /> University of
            Maryland
          </div>
        </div>
      </span>
    </nuxt-link>
    <nuxt-link class="hidden md:block ml-10" to="/my-tools/watchlist">
      <b>Course Watcher</b>
    </nuxt-link>
    <nuxt-link to="/my-tools/slingshot" class="hidden md:block ml-10 text-xs">
      <b class="text-base">Section Slingshot</b></nuxt-link
    >
    <div class = 'ml-auto relative'>
    <Searchbar />
    </div>
    <nuxt-link
      to="/auth/register"
      class="ml-6 font-bold hidden md:block"
      v-if="!useAuthStore().loggedIn"
    >
      Join Tortuga
    </nuxt-link>
    <nuxt-link
      to="/my-tools/dashboard"
      class="ml-6 hidden md:block font-bold"
      v-else
    >
      My Dashboard
    </nuxt-link>
    <nuxt-link
      to="/auth/register"
      class="ml-6 font-bold md:hidden"
      v-if="!useAuthStore().loggedIn"
    >
      <font-awesome-icon :icon="['fas', 'arrow-right-to-bracket']" />
    </nuxt-link>
  </div>
</template>

<script>
import { useAuthStore } from "~/stores/store.js";
import Searchbar from "./Searchbar.vue";
export default {
  components: {
    Searchbar,
  },
  data() {
    return {
      terms: "",
      flags: [
        "FSAW",
        "FSAR",
        "FSMA",
        "FSOC",
        "FSPW",
        "DSHS",
        "DSHU",
        "DSNS",
        "DSNL",
        "DSSP",
        "DVCC",
        "DVUP",
        "SCIS",
      ],
    };
  },
  mounted() {},
  methods: {
    redirect() {
      if (this.flags.includes(this.terms.toUpperCase())) {
        location.replace(
          `  /general-education/classes/${this.terms.toUpperCase()}`
        );
      } else {
        location.replace(`/classes/${this.terms}`);
      }
    },
  },
};
</script>
