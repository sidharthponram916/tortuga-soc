<template>
  <div
    class="relative bg-white p-2 text-slate-800 outline-none font-semibold rounded mb-1 border-2 border-slate-200"
  >
    <div class="flex gap-2 justify-center items-center">
      <font-awesome-icon
        :icon="['fas', 'magnifying-glass']"
        class="text-slate-500"
      />
      <input
        type="text"
        @keyup.enter="redirect"
        @input="filterSearch"
        class="outline-none"
        v-model="terms"
        placeholder="Search..."
      />
      <div
        class="absolute top-11 w-full bg-slate-50 overflow-y-auto max-h-72"
        v-if="filteredResults.length > 0"
      >
        <div
          v-for="course in filteredResults.slice(0, 10)"
          :key="course.course_id"
          class="border-b-2 border-slate-300 p-2 font-bold"
        >
          <a :href="'/classes/' + course.course_id">
            <div class="text-slate-500 text-xs font-bold">
              {{ course.course_id }}
            </div>
            <div class="text-slate-500 text-xs font-medium">
              {{ course.name }}
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      courses: [],
      terms: "",
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
  },
  methods: {
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
