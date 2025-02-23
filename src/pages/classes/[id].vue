<template>
  <div>
    <div v-if="error">
      <div class="p-56 text-center m-2 text-3xl font-bold">
        <div class="text-8xl text-slate-500">404</div>
        We are sorry, but that entry cannot be found.
        <h1 class="text-xl font-medium mb-5">
          Try searching for something else on the top-right.
        </h1>
      </div>
    </div>
    <div class="p-10 m-4 rounded" v-else-if="courses.length > 0">
      <div v-for="course in courses" :key="course.id" class="mb-16">
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
        <div class = 'p-1 mt-5' v-if = "course.notes != 'N/A'"><i>{{ course.notes }}</i></div>

        <div
          @click="() => (course.show_section = true)"
          v-show="!course.show_section && courses.length >= 4"
          class="cursor-pointer border-b-2 border-slate-300"
        >
          <h1 class="mb-5 mt-5">
            <font-awesome-icon :icon="['fas', 'caret-right']" /> Show Sections
          </h1>
        </div>
        <div
          @click="() => (course.show_section = false)"
          v-show="course.show_section && courses.length >= 4"
          class="cursor-pointer"
        >
          <h1 class="mt-5">
            <font-awesome-icon :icon="['fas', 'caret-down']" /> Hide Sections
          </h1>
        </div>
        <div v-show="courses.length < 4">
          <div class="p-1 mt-5 text-xl font-bold text-slate-700">Sections</div>
          <div class="p-1 text-sm">
            Below is a list of course sections offered this semester. If an
            instructor has a rating, it will be displayed. Clicking on the
            rating will take you to the instructor's page on PlanetTerp for more
            details.
          </div>
        </div>
        <div
          class="rounded p-1"
          v-show="course.show_section || courses.length < 4"
        >
          <div v-for="section in course.sections" :key="section.id">
            <div
              class="flex items-center py-4 border-b-2 border-slate-300 bg-white"
            >
              <div class="flex flex-col">
                <div>
                  {{ section.id }}
                  <i v-if="section.id.startsWith('FC')" class="text-sm"
                    >Freshman Connection Only</i
                  >
                </div>
                <div class="text-xl font-bold text-slate-600">
                  {{ section.instructors[0].name }}
                </div>
                <div class="w-full">
                  <a
                    target="_blank"
                    :href="
                      'https://planetterp.com/professor/' +
                      section.instructors[0].slug
                    "
                  >
                    <div
                      v-if="
                        section.instructors[0].rating &&
                        section.instructors[0].rating != 'N/A'
                      "
                    >
                      <div
                        :class="
                          defineRatingColor(section.instructors[0].rating)
                        "
                        class="p-1 flex items-center gap-2 text-sm font-bold text-center rounded inline-flex mb-1 mt-1"
                      >
                        <font-awesome-icon :icon="['fas', 'star']" />
                        <span>{{
                          section.instructors[0].rating.toFixed(3)
                        }}</span>
                      </div>
                    </div>
                  </a>
                </div>
                <div class = 'mt-2 flex flex-row gap-6'>
                  <div
                    class="font-medium mt-4 pl-2 border-l-6"
                    :class = "defineAccentColor(meeting.class_type)"
                    v-for="meeting in section.days_info"
                    :key="meeting.days"
                  >
                    <div class="flex flex-col">
                      <div class="font-bold text-slate-700">{{ meeting.class_type }}</div>
                      <div>
                        {{ meeting.days != "N/A" ? meeting.days : "" }}
                        {{
                          meeting.start_time != "N/A"
                            ? meeting.start_time + "-"
                            : ""
                        }}{{
                          meeting.end_time != "N/A"
                            ? meeting.end_time + ", "
                            : ""
                        }}
                        {{ meeting.building != "N/A" ? meeting.building : "" }}
                        {{ meeting.room != "N/A" ? meeting.room : "" }}
                        {{ meeting.message != "N/A" ? meeting.message : "" }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                :class="defineColor(100 - 100 * (section.open / section.total))"
                class="ml-auto text-center w-1/5 text-slate-800 p-4 text-2xl bg-slate-200 font-bold rounded"
              >
                <div>
                  {{
                    (100 * (section.open / section.total)).toFixed(1) == 0
                      ? "Closed"
                      : "Available"
                  }}
                </div>
                <div class="text-lg font-medium">
                  <b class="text-lg">{{ section.open }}</b> open,
                  <b class="text-lg">{{ section.total }}</b> seats
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="loading"
      class="p-64 m-auto flex flex-col justify-center items-center h-full"
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

export default defineComponent({
  data() {
    return {
      courses: [],
      start_time: "08:00",
      end_time: "16:00",
      error: false,
      terms: "",
      loading: true,
    };
  },
  async mounted() {
    try {
      let { data } = await axios.get(
        `https://schedule-of-classes-api.vercel.app/api/get-courses?name=${
          useRoute().params.id
        }`
      );

      if (data.length == 0) {
        this.error = true;
      } else {
        this.courses = data;
        this.getInstructorRatings();
      }
    } catch (e) {
      this.error = true;
      console.log(e.message);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    defineColor(value) {
      if (value == 100) {
        return "bg-slate-700 text-white";
      } else {
        return "bg-slate-200 text-slate-700";
      }
    },
    defineAccentColor(value) { 
        if (value == "Lecture") { 
            return "border-blue-500"
        }
        else if (value == "Discussion") { 
            return "border-teal-500"
        }
        else { 
            return "border-green-500"
        }
    },
    defineRatingColor(value) {
      if (value >= 4.5) {
        return "bg-green-600 text-white";
      } else if (value >= 4) {
        return "bg-green-500 text-white";
      } else if (value >= 3.5) {
        return "bg-yellow-500 text-white";
      } else if (value >= 3) {
        return "bg-orange-400 text-white";
      } else if (value >= 2.5) {
        return "bg-orange-500 text-white";
      } else {
        return "bg-red-600 text-white";
      }
    },
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
