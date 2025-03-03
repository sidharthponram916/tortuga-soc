<template>
  <div>
    <div
      class="fixed right-0 left-0 top-20 p-1 text-center font-bold text-slate-100 bg-yellow-500"
      v-if = "courses.length > 0"
    >
      {{ courses.length }} {{ useRoute().params.id }} Electives
    </div>
    <div class="p-10 m-4 mt-10 rounded" v-if="courses.length > 0">
      <div
        v-for="course in courses"
        :key="course.id"
        class="mb-16 border-b-2 border-slate-300"
      >
        <h1 class="text-5xl font-bold">
          {{ course.id }}
        </h1>
        <h1 class="text-lg mx-1 font-bold text-slate-700">
          {{ course.title }},
          <span class="font-medium"> {{ course.credits }} credits</span>
        </h1>
        <div class="flex" v-if="course.flags.length > 0">
          <span
            v-for="flag in course.flags"
            :key="flag"
            class="p-1 mx-1 mt-1 bg-blue-700 text-sm text-white font-semibold rounded"
            >{{ flag }}
          </span>
        </div>
        <div v-else=""></div>
        <p v-for="info in course.information" :key="info" class="px-1 mt-5">
          {{ info }}
        </p>

        <nuxt-link :to="'/classes/' + course.id">
          <button
            class="p-2 mx-1 mt-5 cursor-pointer bg-slate-800 rounded text-white font-bold mb-5"
          >
            Show Sections
          </button>
        </nuxt-link>
      </div>
    </div>
    <div
      v-if="loading"
      class="p-56 m-auto flex flex-col justify-center items-center h-full"
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
</template>

<script>
import axios from "axios";
import { useRoute } from "vue-router";

definePageMeta({
  middleware: ["auth"],
});

export default {
  data() {
    return {
      courses: [],
      loading: true,
    };
  },
  async mounted() {
    try {
      let { data } = await axios.get(
        `https://schedule-of-classes-api.vercel.app/api/get-gen-ed-courses?name=${
          useRoute().params.id
        }`
      );

      this.loading = false;
      this.courses = data;
    } catch (e) {
      console.log(e.message);
    }
  },
};
</script>
