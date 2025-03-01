<template>
  <div class="h-screen bg-yellow-500 flex flex-col items-center p-4">
    <div class="text-center pt-16 text-slate-900 font-bold">
      <img
        src="../assets/images/turtle-shell.svg"
        class="mb-6 mt-6 w-24 h-24 md:w-32 md:h-32 m-auto"
      />

      <!-- Make text visible on mobile -->
      <div class="text-2xl md:text-4xl mt-4">
        {{ displayedText }}
        <span class="ml-2 text-white">
          <font-awesome-icon :icon="['fas', 'ellipsis-vertical']" />
        </span>
      </div>

      <!-- Stack items on mobile, space them well -->
      <div
        class="flex flex-wrap justify-center items-center mt-10 gap-3"
      >
        <div v-for="flag in flags" :key="flag">
          <nuxt-link :to="'/general-education/classes/' + flag">
            <div
              class="px-4 py-2 bg-slate-200 hover:bg-slate-700 text-sm font-bold text-black hover:text-white rounded w-auto text-center"
            >
              {{ flag }}
            </div>
          </nuxt-link>
        </div>
      </div>

      <!-- Improve input field styling for mobile -->
      <input
        type="text"
        @keyup.enter="redirect"
        v-model="terms"
        class="w-full md:w-2/3 p-3 mt-6 bg-slate-100 rounded text-slate-800 outline-none shadow-md"
        placeholder="Enter a search term (eg. bmgt, cmsc320, fsoc)..."
      />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      text: "Streamlining the Schedule of Classes at UMD ",
      displayedText: "",
      index: 0,
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
  mounted() {
    this.startTypingEffect();
  },
  methods: {
    startTypingEffect() {
      this.displayedText = "";
      this.index = 0;

      const interval = setInterval(() => {
        if (this.index < this.text.length) {
          this.displayedText += this.text[this.index];
          this.index++;
        } else {
          clearInterval(interval);

          setTimeout(this.startTypingEffect, 5000);
        }
      }, 50); // Adjust typing speed here
    },
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
