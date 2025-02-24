<template>
    <div
      class="items-center flex fixed left-0 right-0 p-4 bg-slate-950 items-center text-slate-200"
    >
      <nuxt-link to="/" class = "cursor-pointer">
        <span class="flex items-center space-x-3">
          <img src="../assets/images/turtle.png" class="w-10 rounded-full" />
          <div class="flex flex-col">
            <div class="text-xl font-bold text-slate-100">Tortuga <span class = 'text-sm text-red-400'>v0.0.1</span></div>
            <div class="text-sm text-slate-100">
              <font-awesome-icon :icon="['fas', 'location-dot']" /> University of
              Maryland - College Park
            </div>
          </div>
        </span>
      </nuxt-link>
      <input
        class="bg-white ml-auto p-2 rounded font-bold text-slate-800 outline-none"
        placeholder="Search...."
        v-model = "terms"
        @keyup.enter = "redirect"
        type="text"
      />
    </div>
  </template>
  
  <script>
  export default {
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