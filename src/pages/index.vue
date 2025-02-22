<template>
  <div class="h-screen bg-yellow-500">
    <div class="text-center pt-48 text-slate-900 font-bold">
      <div class="text-5xl mt-4">
        {{ displayedText }}
        <span class="ml-2 text-white">
          <font-awesome-icon :icon="['fas', 'ellipsis-vertical']" />
        </span>
      </div>
      <div class="flex flex-wrap justify-center items-center mt-16 md:gap-5">
        <div v-for="flag in flags" :key="flag" class="flex">
          <a :href="'/general-education/classes/' + flag">
            <div
              class="p-2 bg-slate-200 hover:bg-slate-700 text-sm font-bold text-black hover:text-white rounded inline-block w-fit"
            >
              {{ flag }}
            </div>
          </a>
        </div>
      </div>
      <input
        type="text"
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
      text: "Streamlining the Schedule of Classes at UMD. ",
      displayedText: "",
      index: 0,
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
  },
};
</script>
