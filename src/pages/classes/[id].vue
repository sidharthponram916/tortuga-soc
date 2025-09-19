<template>
  <div>
    <transition name="fade">
      <div class="m-2 overflow-y-hidden">
        <div v-if="error">
          <div class="p-56 text-center m-2 text-3xl font-bold">
            <div class="text-8xl text-slate-500">404</div>
            That entry cannot be found.
            <h1 class="text-xl font-medium mb-5">
              Try searching for something else.
            </h1>
          </div>
        </div>
        <div class="rounded">
          <div class="flex overflow-hidden">
            <div
              class="hidden sm:block ml-auto w-1/4 bg-slate-50 p-10 border-b-2 border-slate-200"
            >
              <div class="mb-5 text-2xl font-bold">Filters</div>
              <div
                class="p-2 border-2 border-slate-200 bg-white w-full outline-none text-sm mt-2"
              >
                <font-awesome-icon
                  :icon="['fas', 'magnifying-glass']"
                  class="text-slate-500"
                />
                <input
                  type="text"
                  v-model="terms"
                  class="ml-2 outline-none"
                  @input="filterSearch"
                  placeholder="Search a course..."
                />
              </div>
              <div class="text-xs mt-5">
                The filters below are currently under development but are here
                for you as an idea of what it would look like on the site.
              </div>
              <div class="font-bold text-slate-500 mt-5 text-sm">
                General Education
              </div>
              <select
                class="p-2 border-2 border-slate-200 bg-white w-full outline-none text-sm mt-2 disabled:bg-gray-100"
                disabled
              >
                <option>Academic Writing (FSAW)</option>
                <option>Analytical Reasoning (FSAR)</option>
                <option>Mathematics (FSMA)</option>
                <option>Oral Communication (FSOC)</option>
                <option>Professional Writing (FSPW)</option>
                <option>History & Social Sciences (DSHS)</option>
                <option>Natural Sciences (DSNS)</option>
                <option>Natural Sciences + Lab (DSNL)</option>
                <option>Scholarship in Practice (DSSP)</option>
                <option>Cultural Competance (DVCC)</option>
                <option>Understanding Plural Societies (DVUP)</option>
                <option>Big Question (SCIS)</option>
                <option>Humanities (DSHU)</option>
              </select>
              <div class="font-bold text-slate-500 mt-5 text-sm">
                Department
              </div>
              <select
                class="p-2 border-2 border-slate-200 bg-white w-full outline-none text-sm mt-2 disabled:bg-gray-100"
                disabled
              >
                <option>All Courses</option>
                <option value="ANSC">Animal Science (ANSC)</option>

                <option value="AAAS">
                  African American and Africana Studies (AAAS)
                </option>
                <option value="AAPS">
                  Academic Achievement Programs (AAPS)
                </option>
                <option value="AAST">Asian American Studies (AAST)</option>
                <option value="ABRM">Anti-Black Racism (ABRM)</option>
                <option value="AGNR">
                  Agriculture and Natural Resources (AGNR)
                </option>
                <option value="AGST">
                  Agricultural Science and Technology (AGST)
                </option>
                <option value="AMSC">
                  Applied Mathematics & Scientific Computation (AMSC)
                </option>
                <option value="AMST">American Studies (AMST)</option>
                <option value="ANTH">Anthropology (ANTH)</option>
                <option value="AOSC">
                  Atmospheric and Oceanic Science (AOSC)
                </option>
                <option value="ARAB">Arabic (ARAB)</option>
                <option value="ARCH">Architecture (ARCH)</option>
                <option value="AREC">
                  Agricultural and Resource Economics (AREC)
                </option>
                <option value="ARHU">Arts and Humanities (ARHU)</option>
                <option value="ARMY">Army (ARMY)</option>
                <option value="ARSC">Air Science (ARSC)</option>
                <option value="ARTH">Art History & Archaeology (ARTH)</option>
                <option value="ARTT">Art Studio (ARTT)</option>
                <option value="ASTR">Astronomy (ASTR)</option>
                <option value="BCHM">Biochemistry (BCHM)</option>
                <option value="BDBA">
                  Doctor of Business Administration (BDBA)
                </option>
                <option value="BIOE">Bioengineering (BIOE)</option>
                <option value="BIOI">
                  Bioinformatics and Computational Biology (BIOI)
                </option>
                <option value="BIOL">Biology (BIOL)</option>
                <option value="BIOM">Biometrics (BIOM)</option>
                <option value="BIPH">Biophysics (BIPH)</option>
                <option value="BISI">Biological Sciences (BISI)</option>
                <option value="BMGT">Business and Management (BMGT)</option>
                <option value="BMIN">General Business Minor (BMIN)</option>
                <option value="BMSO">Online Business MS Programs (BMSO)</option>
                <option value="BSCI">Biological Sciences Program (BSCI)</option>
                <option value="BSOS">
                  Behavioral and Social Sciences (BSOS)
                </option>
                <option value="BSST">Terrorism Studies (BSST)</option>
                <option value="BUAC">
                  Accounting and Information Assurance (BUAC)
                </option>
                <option value="BUDT">
                  Decision and Information Technologies (BUDT)
                </option>
                <option value="BUFN">Finance (BUFN)</option>
                <option value="BULM">
                  Logistics, Business, and Public Policy (BULM)
                </option>
                <option value="BUMK">Marketing (BUMK)</option>
                <option value="BUSI">Part-Time MBA Program (BUSI)</option>
                <option value="BUSM">Full-Time MBA Program (BUSM)</option>
                <option value="BUSO">Online MBA Program (BUSO)</option>
                <option value="CBMG">
                  Cell Biology & Molecular Genetics (CBMG)
                </option>
                <option value="CCJS">
                  Criminology and Criminal Justice (CCJS)
                </option>
                <option value="CHBE">
                  Chemical and Biomolecular Engineering (CHBE)
                </option>
                <option value="CHEM">Chemistry (CHEM)</option>
                <option value="CHIN">Chinese (CHIN)</option>
                <option value="CHPH">Chemical Physics (CHPH)</option>
                <option value="CHSE">
                  Counseling, Higher Education, and Special Education (CHSE)
                </option>
                <option value="CINE">Cinema and Media Studies (CINE)</option>
                <option value="CLAS">Classics (CLAS)</option>
                <option value="CLFS">Chemical and Life Sciences (CLFS)</option>
                <option value="CMLT">Comparative Literature (CMLT)</option>
                <option value="CMNS">
                  Computer, Math, and Natural Sciences (CMNS)
                </option>
                <option value="CMSC">Computer Science (CMSC)</option>
                <option value="COMM">Communication (COMM)</option>
                <option value="CPBE">
                  College Park Scholars-Business, Society, Entreprenrshp (CPBE)
                </option>
                <option value="CPCV">
                  College Park Scholars-Civic Engagement for Social Good (CPCV)
                </option>
                <option value="CPDJ">
                  College Park Scholars-Data Justice (CPDJ)
                </option>
                <option value="CPET">
                  College Park Scholars-Environment, Technology & Economy (CPET)
                </option>
                <option value="CPGH">
                  College Park Scholars-Global Public Health (CPGH)
                </option>
                <option value="CPJT">
                  College Park Scholars-Justice and Legal Thought (CPJT)
                </option>
                <option value="CPMS">
                  College Park Scholars-Media, Self and Society (CPMS)
                </option>
                <option value="CPPL">
                  College Park Scholars-Public Leadership (CPPL)
                </option>
                <option value="CPSA">College Park Scholars-Arts (CPSA)</option>
                <option value="CPSF">
                  College Park Scholars-Life Sciences (CPSF)
                </option>
                <option value="CPSG">
                  College Park Scholars-Science and Global Change (CPSG)
                </option>
                <option value="CPSN">
                  College Park Scholars-International Studies (CPSN)
                </option>
                <option value="CPSP">
                  College Park Scholars Program (CPSP)
                </option>
                <option value="CPSS">
                  College Park Scholars-Science, Technology and Society (CPSS)
                </option>
                <option value="CRLN">Carillon Communities (CRLN)</option>
                <option value="DANC">Dance (DANC)</option>
                <option value="DATA">Data Science and Analytics (DATA)</option>
                <option value="ECON">Economics (ECON)</option>
                <option value="EDCP">
                  Education Counseling and Personnel Services (EDCP)
                </option>
                <option value="EDHD">
                  Education, Human Development (EDHD)
                </option>
                <option value="EDHI">
                  Education Leadership, Higher Ed and International Ed (EDHI)
                </option>
                <option value="EDMS">
                  Measurement, Statistics, and Evaluation (EDMS)
                </option>
                <option value="EDSP">Education, Special (EDSP)</option>
                <option value="EDUC">Education (EDUC)</option>
                <option value="EMBA">Executive MBA Program (EMBA)</option>
                <option value="ENAE">Engineering, Aerospace (ENAE)</option>
                <option value="ENAI">
                  Engineering Artificial Intelligence,Professional Masters
                  (ENAI)
                </option>
                <option value="ENBC">
                  Biocomputational Engineering (ENBC)
                </option>
                <option value="ENCE">Engineering, Civil (ENCE)</option>
                <option value="ENCO">
                  Engineering, Cooperative Education (ENCO)
                </option>
                <option value="ENEB">
                  Cyber-Physical Systems Engineering (ENEB)
                </option>
                <option value="ENED">Engineering Education (ENED)</option>
                <option value="ENEE">
                  Electrical & Computer Engineering (ENEE)
                </option>
                <option value="ENSE">Systems Engineering (ENSE)</option>
                <option value="ENFP">
                  Engineering, Fire Protection (ENFP)
                </option>
                <option value="ENGL">English (ENGL)</option>
                <option value="ENMA">Engineering, Materials (ENMA)</option>
                <option value="ENME">Engineering, Mechanical (ENME)</option>
                <option value="ENMT">Mechatronics Engineering (ENMT)</option>
                <option value="ENPM">
                  Engineering, Professional Masters (ENPM)
                </option>
                <option value="ENRE">Reliability Engineering (ENRE)</option>
                <option value="ENSP">
                  Environmental Science and Policy (ENSP)
                </option>
                <option value="ENST">
                  Environmental Science and Technology (ENST)
                </option>
                <option value="ENTM">Entomology (ENTM)</option>
                <option value="ENTS">Telecommunications (ENTS)</option>
                <option value="ENVH">
                  Environmental and Occupational Health (ENVH)
                </option>
                <option value="EPIB">
                  Epidemiology and Biostatistics (EPIB)
                </option>
                <option value="FGSM">Federal and Global Fellows (FGSM)</option>
                <option value="FIRE">
                  First-Year Innovation & Research Experience (FIRE)
                </option>
                <option value="FMSC">Family Science (FMSC)</option>
                <option value="FREN">French (FREN)</option>
                <option value="GBHL">Global Health (GBHL)</option>
                <option value="GEMS">Gemstone (GEMS)</option>
                <option value="GEOG">Geographical Sciences (GEOG)</option>
                <option value="GEOL">Geology (GEOL)</option>
                <option value="GERS">German Studies (GERS)</option>
                <option value="GREK">Greek (GREK)</option>
                <option value="GVPT">Government and Politics (GVPT)</option>
                <option value="HACS">ACES-Cybersecurity (HACS)</option>
                <option value="HBUS">
                  Interdisciplinary Business Honors (HBUS)
                </option>
                <option value="HDCC">
                  Design Cultures and Creativity (HDCC)
                </option>
                <option value="HEBR">Hebrew (HEBR)</option>
                <option value="HESI">
                  Higher Ed, Student Affairs, and International Ed Policy (HESI)
                </option>
                <option value="HESP">Hearing and Speech Sciences (HESP)</option>
                <option value="HGLO">Honors Global Communities (HGLO)</option>
                <option value="HHUM">Honors Humanities (HHUM)</option>
                <option value="HISP">Historic Preservation (HISP)</option>
                <option value="HIST">History (HIST)</option>
                <option value="HLSA">
                  Health Services Administration (HLSA)
                </option>
                <option value="HLSC">Integrated Life Sciences (HLSC)</option>
                <option value="HLTH">Health (HLTH)</option>
                <option value="HNUH">University Honors (HNUH)</option>
                <option value="HONR">Honors (HONR)</option>
                <option value="IDEA">
                  Academy for Innovation & Entrepreneurship (IDEA)
                </option>
                <option value="IMDM">Immersive Media Design (IMDM)</option>
                <option value="IMMR">Immigration Studies (IMMR)</option>
                <option value="INAG">
                  Institute of Applied Agriculture (INAG)
                </option>
                <option value="INFM">Information Management (INFM)</option>
                <option value="INST">Information Studies (INST)</option>
                <option value="ISRL">Israel Studies (ISRL)</option>
                <option value="ITAL">Italian (ITAL)</option>
                <option value="JAPN">Japanese (JAPN)</option>
                <option value="JOUR">Journalism (JOUR)</option>
                <option value="JWST">Jewish Studies (JWST)</option>
                <option value="KNES">Kinesiology (KNES)</option>
                <option value="KORA">Korean (KORA)</option>
                <option value="LACS">
                  Latin American and Caribbean Studies (LACS)
                </option>
                <option value="LARC">Landscape Architecture (LARC)</option>
                <option value="LATN">Latin (LATN)</option>
                <option value="LBSC">Library Science (LBSC)</option>
                <option value="LEAD">
                  Leadership Education and Development (LEAD)
                </option>
                <option value="LGBT">
                  Lesbian Gay Bisexual Transgender Studies (LGBT)
                </option>
                <option value="LING">Linguistics (LING)</option>
                <option value="MATH">Mathematics (MATH)</option>
                <option value="MEES">
                  Marine-Estuarine-Environmental Sciences (MEES)
                </option>
                <option value="MIEH">
                  Maryland Institute for Applied Environmental Health (MIEH)
                </option>
                <option value="MITH">
                  Maryland Institute for Technology in the Humanities (MITH)
                </option>
                <option value="MLAW">
                  MPower Undergraduate Law Programs (MLAW)
                </option>
                <option value="MLSC">MD Language Science Ctr (MLSC)</option>
                <option value="MOCB">Molecular and Cell Biology (MOCB)</option>
                <option value="MSML">Machine Learning (MSML)</option>
                <option value="MSQC">Quantum Computing (MSQC)</option>
                <option value="MUED">Music Education (MUED)</option>
                <option value="MUSC">School of Music (MUSC)</option>
                <option value="NACS">
                  Neuroscience & Cognitive Science (NACS)
                </option>
                <option value="NAVY">Navy (NAVY)</option>
                <option value="NEUR">Neuroscience (NEUR)</option>
                <option value="NFSC">Nutrition and Food Science (NFSC)</option>
                <option value="NIAS">
                  National Institute of Aeronautics (NIAS)
                </option>
                <option value="OURS">
                  Office of Undergraduate Research (OURS)
                </option>
                <option value="PEER">Health Center (PEER)</option>
                <option value="PERS">Persian (PERS)</option>
                <option value="PHIL">Philosophy (PHIL)</option>
                <option value="PHPE">
                  Philosophy, Politics, and Economics (PHPE)
                </option>
                <option value="PHSC">Public Health Science (PHSC)</option>
                <option value="PHYS">Physics (PHYS)</option>
                <option value="PLCY">Public Policy (PLCY)</option>
                <option value="PLSC">Plant Sciences (PLSC)</option>
                <option value="PORT">Portuguese (PORT)</option>
                <option value="PSYC">Psychology (PSYC)</option>
                <option value="RDEV">Real Estate Development (RDEV)</option>
                <option value="RELS">Religious Studies (RELS)</option>
                <option value="RUSS">Russian (RUSS)</option>
                <option value="SLAA">
                  Second Language Acquisition and Application (SLAA)
                </option>
                <option value="SLLC">
                  School of Languages, Literatures and Cultures (SLLC)
                </option>
                <option value="SMLP">
                  Southern Management Leadership Program (SMLP)
                </option>
                <option value="SOCY">Sociology (SOCY)</option>
                <option value="SPAN">Spanish (SPAN)</option>
                <option value="SPHL">Public Health (SPHL)</option>
                <option value="STAT">Statistics and Probability (STAT)</option>
                <option value="SURV">Survey and Data Science (SURV)</option>
                <option value="TDPS">
                  Theatre, Dance and Performance Studies (TDPS)
                </option>
                <option value="THET">Theatre (THET)</option>
                <option value="TLPL">
                  Teaching and Learning, Policy and Leadership (TLPL)
                </option>
                <option value="TLTC">
                  Teaching and Learning Transformation Center (TLTC)
                </option>
                <option value="UMEI">Maryland English Institute (UMEI)</option>
                <option value="UNIV">University Courses (UNIV)</option>
                <option value="URSP">Urban Studies and Planning (URSP)</option>
                <option value="USLT">Latina/o Studies (USLT)</option>
                <option value="VIPS">
                  Vertically Integrated Projects (VIPS)
                </option>
                <option value="VMSC">Veterinary Medical Sciences (VMSC)</option>
                <option value="WEID">
                  Words of Engagement Intergroup Dialogue Program (WEID)
                </option>
                <option value="WGSS">
                  Women, Gender, and Sexuality Studies (WGSS)
                </option>
                <option value="XPER">xFoundry (XPER)</option>
              </select>
              <div class="font-bold text-slate-500 mt-5 text-sm">Credits</div>
              <select
                class="p-2 border-2 border-slate-200 w-full bg-white outline-none text-sm mt-2 disabled:bg-gray-100"
                disabled
              >
                <option>All Credits</option>
                <option>1 Credits</option>
                <option>2 Credits</option>
                <option>3 Credits</option>
                <option>4 Credits</option>
              </select>
              <div class="font-bold text-slate-500 mt-5 text-sm">
                Semester Catalog
              </div>
              <select
                class="p-2 border-2 border-slate-200 w-full bg-white outline-none text-sm mt-2 disabled:bg-gray-100"
                disabled
              >
                <option>Spring 2026</option>
                <option>Fall 2025</option>
                <option>Summer 2025</option>
                <option>Spring 2025</option>
                <option>Fall 2024</option>
              </select>
            </div>
            <div
              class="hidden sm:block w-full sm:w-1/4 bg-white border-b-2 border-r-2 border-slate-200"
            >
              <div
                class="text-center mt-3 border-slate-200 text-slate-600 pb-2 font-medium"
              >
                <span>{{ filteredResults.length }}</span>
                Results
              </div>
              <div class="h-[72vh] overflow-y-auto">
                <div
                  @click="changeCourses(course)"
                  v-for="course in filteredResults"
                  :key="course.course_id"
                >
                  <div
                    class="p-2 border-b-2 border-slate-200 bg-white cursor-pointer hover:bg-slate-50"
                  >
                    <div class="font-bold text-xs">
                      {{ course.course_id }}
                    </div>
                    <div class="text-xs">{{ course.name }}</div>
                  </div>
                </div>
              </div>
            </div>
            <CourseCard :courseName="current_course" :key="courseKey" />
          </div>
          <!-- <img
            src="@/assets/images/logos-formal-seal.webp"
            class="w-10 m-auto mb-2 mt-5"
          />
          <div class="text-xs text-center">
            search powered by
            <nuxt-link to="https://app.testudo.umd.edu/soc/">
              https://app.testudo.umd.edu/soc
            </nuxt-link>
          </div> -->
        </div>
        <div
          v-if="loading"
          class="py-10 md:p-64 m-auto flex flex-col justify-center items-center h-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100"
            height="100"
            viewBox="0 0 50 50"
          >
            <!-- path code credited by https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d -->
            <path
              fill="#2d40cf"
              d="M25,5A20.14,20.14,0,0,1,45,22.88a2.51,2.51,0,0,0,2.49,2.26h0A2.52,2.52,0,0,0,50,22.33a25.14,25.14,0,0,0-50,0,2.52,2.52,0,0,0,2.5,2.81h0A2.51,2.51,0,0,0,5,22.88,20.14,20.14,0,0,1,25,5Z"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 25 25"
                to="360 25 25"
                dur="0.5s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
          <div class="mt-10 text-sm font-bold">
            This may take a bit depending on your search query.
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from "axios";
import Searchbar from "@/components/Searchbar.vue";
import CourseCard from "@/components/CourseCard.vue";

import { useRoute } from "vue-router";

definePageMeta({
  middleware: ["auth"],
});

export default defineComponent({
  data() {
    return {
      courses: [],
      all_courses: [],
      backup: [],
      start_time: "08:00",
      end_time: "16:00",
      error: false,
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
      loading: true,
      current_course: "",
      courseKey: 0,
    };
  },
  async mounted() {
    try {
      this.current_course = this.$route.params.id;
      this.courseKey++;

      let courses = JSON.parse(localStorage.getItem("courses"));
      this.all_courses = courses.data;

      const gen_eds = [
        { course_id: "FSAW", name: "Fundamental Studies in Academic Writing" },
        {
          course_id: "FSAR",
          name: "Fundamental Studies in Analytic Reasoning",
        },
        { course_id: "FSMA", name: "Fundamental Studies in Mathematics" },
        {
          course_id: "FSOC",
          name: "Fundamental Studies in Oral Communication",
        },
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

      this.all_courses = this.all_courses.concat(gen_eds);

      if (this.$route.query.terms) {
        this.terms = this.$route.query.terms;
        this.filterSearch();
      }
    } catch (e) {
      this.error = true;
      console.log("Error: " + e.message);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    changeCourses(course) {
      this.current_course = course.course_id;
      this.courseKey++;
      document.title = `${course.course_id} - ${course.name} Overview - Tortuga SOC`;
    },
    filterSearch() {
      console.log(this.terms);

      if (!this.terms.trim()) {
        this.filteredResults = [];
        return;
      }

      this.filteredResults = this.all_courses.filter((course) => {
        return (
          course.course_id
            .toLowerCase()
            .includes(this.terms.toLowerCase().trim()) ||
          course.name.toLowerCase().includes(this.terms.toLowerCase().trim())
        );
      });
    },
    redirect() {
      const regex = /^[a-zA-Z]{4}[0-9][0-9]?$/;

      console.log(regex.test(this.terms));
      if (this.flags.includes(this.terms.toUpperCase())) {
        location.replace(
          `  /general-education/classes/${this.terms.toUpperCase()}`
        );
      } else if (regex.test(this.terms)) {
        location.replace(
          `/classes/${this.terms.toUpperCase()}?terms=${this.terms}`
        );
      } else if (this.courseCodes.includes(this.terms.toUpperCase().trim(""))) {
        location.replace(`/classes/${this.terms.toUpperCase()}`);
      } else {
        location.replace(`/classes/${this.filteredResults[0].course_id}`);
      }
    },
    editCourseFilters() {},
    async getInstructorRatings() {
      let instructors = new Set();

      this.courses.forEach((course) => {
        course.sections.forEach((section) => {
          if (section.instructors.length > 0) {
            instructors.add(section.instructors[0]);
          }
        });
      });

      let instructorRatings = {};

      console.log("Trying to find!");

      await Promise.all(
        [...instructors].map(async (instructor) => {
          try {
            let { data } = await axios.get(
              `https://planetterp.com/api/v1/professor?name=${instructor}`
            );

            if (data && data.average_rating) {
              instructorRatings[instructor] = {
                rating: data.average_rating,
                slug: data.slug,
              };
            } else {
              instructorRatings[instructor] = {
                rating: "N/A",
                slug: "N/A",
              };
            }
          } catch (e) {
            console.log(e);
            instructorRatings[instructor] = "N/A";
          }
        })
      );

      this.courses.forEach((course) => {
        course.sections.forEach((section) => {
          if (section.instructors.length > 0) {
            section.instructors[0] = {
              name: section.instructors[0],
              rating: instructorRatings[section.instructors[0]].rating,
              slug: instructorRatings[section.instructors[0]].slug,
            };
          }
        });
      });
    },
  },
});
</script>
