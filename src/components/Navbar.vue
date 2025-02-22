<template>
    <div
      class="items-center flex fixed left-0 right-0 p-4 bg-slate-950 items-center text-slate-200"
    >
      <a href="/">
        <span class="flex items-center space-x-3">
          <img src="../assets/images/logos-formal-seal.webp" class="w-10 bg-white rounded-full" />
          <div class="flex flex-col">
            <div class="text-xl font-bold text-slate-100">Tortuga</div>
            <div class="text-sm text-slate-100">
              <font-awesome-icon :icon="['fas', 'location-dot']" /> University of
              Maryland - College Park
            </div>
          </div>
        </span>
      </a>
      <input
        class="bg-white ml-auto p-2 rounded font-bold text-slate-800 outline-none"
        placeholder="Search..."
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