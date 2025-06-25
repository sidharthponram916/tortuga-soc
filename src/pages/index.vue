<template>
  <div class="h-screen bg-yellow-500 flex flex-col items-center p-4">
    <div class="text-center pt-16 text-slate-900 font-bold">
      <img
        src="../assets/images/turtle-shell.svg"
        class="mb-6 mt-6 w-24 h-24 md:w-32 md:h-32 m-auto"
      />
      <div class="text-3xl md:hidden">Welcome to Tortuga!</div>
      <!-- Make text visible on mobile -->
      <div class="hidden md:block text-3xl md:text-4xl mt-4">
        {{ displayedText }}
        <span class="ml-2 text-white">
          <font-awesome-icon :icon="['fas', 'ellipsis-vertical']" />
        </span>
      </div>

      <!-- Stack items on mobile, space them well -->
      <div class="flex flex-wrap justify-center items-center mt-10 gap-3">
        <div v-for="flag in flags" :key="flag">
          <nuxt-link :to="'/general-education/classes/' + flag">
            <div
              class="px-4 py-2 bg-slate-200 hover:bg-slate-700 text-xs md:text-sm font-bold text-black hover:text-white rounded w-auto text-center"
            >
              {{ flag }}
            </div>
          </nuxt-link>
        </div>
      </div>
      <div class="m-auto w-full">
        <input
          type="text"
          @keyup.enter="redirect"
          @input="filterSearch"
          v-model="terms"
          class="w-full md:w-2/3 min-w-0 p-3 mt-6 bg-slate-100 text-slate-800 outline-none shadow-md"
          placeholder="Enter a search term (eg. bmgt, cmsc320, fsoc)..."
        />

        <div class="overflow-y-auto h-32 w-full md:w-2/3 m-auto text-left">
          <div
            class="p-2 text-left bg-slate-100 border-b-2 border-slate-200 text-sm break-words whitespace-normal"
            v-for="course in filteredResults.slice(0, 5)"
            :key="course.course_id"
          >
            <nuxt-link :to="'/classes/' + course.course_id">
              <div class="text-slate-500">{{ course.course_id }}</div>
              <div class="text-slate-700">{{ course.name }}</div>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";

definePageMeta({
  middleware: ["auth"],
});

export default {
  data() {
    return {
      text: "Streamlining the Schedule of Classes at UMD. ",
      displayedText: "",
      index: 0,
      courses: [],
      terms: "",
      results: [],
      filteredResults: [],
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
      courseCodes: [
        "AAAS",
        "AAST",
        "ABRM",
        "AGNR",
        "AGST",
        "AMSC",
        "AMST",
        "ANSC",
        "ANTH",
        "AOSC",
        "ARAB",
        "ARCH",
        "AREC",
        "ARHU",
        "ARMY",
        "ARSC",
        "ARTH",
        "ARTT",
        "ASTR",
        "BCHM",
        "BDBA",
        "BIOE",
        "BIOI",
        "BIOL",
        "BIOM",
        "BIPH",
        "BISI",
        "BMGT",
        "BMIN",
        "BMSO",
        "BSCI",
        "BSOS",
        "BSST",
        "BUAC",
        "BUDT",
        "BUFN",
        "BULM",
        "BUMK",
        "BUSI",
        "BUSM",
        "BUSO",
        "CBMG",
        "CCJS",
        "CHBE",
        "CHEM",
        "CHIN",
        "CHPH",
        "CHSE",
        "CINE",
        "CLAS",
        "CLFS",
        "CMLT",
        "CMNS",
        "CMSC",
        "COMM",
        "CPBE",
        "CPCV",
        "CPDJ",
        "CPET",
        "CPGH",
        "CPJT",
        "CPMS",
        "CPPL",
        "CPSA",
        "CPSF",
        "CPSG",
        "CPSN",
        "CPSP",
        "CPSS",
        "CRLN",
        "DANC",
        "DATA",
        "ECON",
        "EDCP",
        "EDHD",
        "EDHI",
        "EDMS",
        "EDSP",
        "EDUC",
        "EMBA",
        "ENAE",
        "ENBC",
        "ENCE",
        "ENCO",
        "ENEB",
        "ENED",
        "ENEE",
        "ENES",
        "ENFP",
        "ENGL",
        "ENMA",
        "ENME",
        "ENMT",
        "ENPM",
        "ENRE",
        "ENSE",
        "ENSP",
        "ENST",
        "ENTM",
        "ENTS",
        "EPIB",
        "FGSM",
        "FIRE",
        "FMSC",
        "FREN",
        "GBHL",
        "GEMS",
        "GEOG",
        "GEOL",
        "GERS",
        "GREK",
        "GVPT",
        "HACS",
        "HBUS",
        "HDCC",
        "HEBR",
        "HESI",
        "HESP",
        "HGLO",
        "HHUM",
        "HISP",
        "HIST",
        "HLSA",
        "HLSC",
        "HLTH",
        "HNUH",
        "HONR",
        "IDEA",
        "IMDM",
        "IMMR",
        "INAG",
        "INFM",
        "INST",
        "ISRL",
        "ITAL",
        "JAPN",
        "JOUR",
        "JWST",
        "KNES",
        "KORA",
        "LACS",
        "LARC",
        "LATN",
        "LBSC",
        "LEAD",
        "LGBT",
        "LING",
        "MATH",
        "MEES",
        "MIEH",
        "MITH",
        "MLAW",
        "MLSC",
        "MOCB",
        "MSML",
        "MSQC",
        "MUED",
        "MUSC",
        "NACS",
        "NAVY",
        "NEUR",
        "NFSC",
        "NIAS",
        "OURS",
        "PEER",
        "PERS",
        "PHIL",
        "PHPE",
        "PHSC",
        "PHYS",
        "PLCY",
        "PLSC",
        "PORT",
        "PSYC",
        "RDEV",
        "RELS",
        "RUSS",
        "SLAA",
        "SLLC",
        "SMLP",
        "SOCY",
        "SPAN",
        "SPHL",
        "STAT",
        "SURV",
        "TDPS",
        "THET",
        "TLPL",
        "TLTC",
        "UMEI",
        "UNIV",
        "URSP",
        "USLT",
        "VMSC",
        "WEID",
        "WGSS",
      ],
    };
  },
  async mounted() {
    let { data } = await axios.get("https://api.umd.io/v1/courses/list");
    this.courses = data;
    const gen_eds = [
      { course_id: "FSAW", name: "Fundamental Studies in Academic Writing" },
      { course_id: "FSAR", name: "Fundamental Studies in Analytic Reasoning" },
      { course_id: "FSMA", name: "Fundamental Studies in Mathematics" },
      { course_id: "FSOC", name: "Fundamental Studies in Oral Communication" },
      {
        course_id: "FSPW",
        name: "Fundamental Studies in Professional Writing",
      },
      {
        course_id: "DSHS",
        name: "Distributive Studies in History and Social Sciences",
      },
      { course_id: "DSHU", name: "Distributive Studies in Humanities" },
      { course_id: "DSNS", name: "Distributive Studies in Natural Sciences" },
      {
        course_id: "DSNL",
        name: "Distributive Studies in Natural Sciences with Lab",
      },
      {
        course_id: "DSSP",
        name: "Distributive Studies in Scholarship in Practice",
      },
      { course_id: "DVCC", name: "Diversity in Cultural Competence" },
      {
        course_id: "DVUP",
        name: "Diversity in Understanding Plural Societies",
      },
      { course_id: "SCIS", name: "Signature Courses in I-Series" },
    ];

    this.courses = this.courses.concat(gen_eds);

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
      }, 50);
    },
    filterSearch() {
      if (!this.terms.trim()) {
        this.filteredResults = [];
        return;
      }

      this.filteredResults = this.courses.filter((course) => {
        return (
          course.course_id
            .toLowerCase()
            .includes(this.terms.toLowerCase().trim()) ||
          course.name.toLowerCase().includes(this.terms.toLowerCase().trim())
        );
      });
    },
    redirect() {
      location.replace(
        `/classes/${
          this.filteredResults[0].course_id
        }?terms=${this.terms.toUpperCase()}`
      );
    },
  },
};
</script>
