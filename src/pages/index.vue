<template>
  <div class="h-screen bg-yellow-500">
    <div class="text-center pt-16 text-slate-900 font-bold">
      <img src="../assets/images/turtle-shell.svg" class="mb-10 mt-10 w-32 h-32 m-auto" />
      <div class="text-4xl mt-4">
        {{ displayedText }}
        <span class="ml-2 text-white">
          <font-awesome-icon :icon="['fas', 'ellipsis-vertical']" />
        </span>
      </div>
      <div class="flex flex-wrap justify-center items-center mt-10 md:gap-5">
        <div v-for="flag in flags" :key="flag" class="flex">
          <nuxt-link :to="'/general-education/classes/' + flag">
            <div
              class="p-2 bg-slate-200 hover:bg-slate-700 text-sm font-bold text-black hover:text-white rounded inline-block w-fit"
            >
              {{ flag }}
            </div>
          </nuxt-link>
        </div>
      </div>
      <input
        type="text"
        @keyup.enter="redirect"
        v-model="terms"
        class="w-2/3 p-2 m-2 bg-slate-100 rounded mt-6 text-slate-800 outline-none"
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
