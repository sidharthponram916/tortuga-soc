<template>
  <div>
    <div v-if="error">
      <div class="p-56 text-center m-2 text-3xl font-bold">
        <div class="text-8xl text-slate-500">404</div>
        That entry cannot be found.
        <h1 class="text-xl font-medium mb-5">
          Try searching for something else on the top-right.
        </h1>
      </div>
    </div>
    <div class="p-2 md:p-10 m-4 rounded" v-else-if="courses.length > 0">
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
        <div class="p-1 mt-5" v-if="course.notes != 'N/A'">
          <i>{{ course.notes }}</i>
        </div>

        <div
          @click="() => (course.show_section = true)"
          v-show="!course.show_section && courses.length >= 4"
          class="cursor-pointer border-b-2 border-slate-300"
        >
          <h1 class="mb-5 mt-5 text-sm">
            <font-awesome-icon :icon="['fas', 'caret-right']" /> Show Sections
          </h1>
        </div>
        <div
          @click="() => (course.show_section = false)"
          v-show="course.show_section && courses.length >= 4"
          class="cursor-pointer"
        >
          <h1 class="mt-5 text-sm">
            <font-awesome-icon :icon="['fas', 'caret-down']" /> Hide Sections
          </h1>
        </div>
        <div v-show="courses.length < 4">
          <div class="p-1 mt-5 text-xl font-bold text-slate-700">Sections</div>
          <div class="p-1 text-sm">
            Below is a list of course sections offered in <b>Fall 2025</b>. If
            an instructor has a rating, it will be displayed. Clicking on the
            rating will take you to the instructor's page on PlanetTerp for more
            details.
          </div>
        </div>
        <div v-show="course.show_section || courses.length < 4">
          <div class="flex flex-row">
            <div class="md:hidden text-xs">
              <div class="m-1 text-xs text-slate-700 font-medium">
                <b>{{ course.filtered_sections.length }}</b> lecture times
                (including online) shown from
              </div>
              <select
                class="outline-none text-slate-500 font-medium text-left"
                v-model="course.selected_start_time"
                @change="filterSections(course)"
              >
                <option value="8:00am">8:00am</option>
                <option value="9:00am">9:00am</option>
                <option value="10:00am">10:00am</option>
                <option value="11:00am">11:00am</option>
                <option value="12:00pm">12:00pm</option>
                <option value="1:00pm">1:00pm</option>
                <option value="2:00pm">2:00pm</option>
                <option value="3:00pm">3:00pm</option>
                <option value="4:00pm">4:00pm</option>
                <option value="5:00pm">5:00pm</option>
                <option value="6:00pm">6:00pm</option>
                <option value="7:00pm">7:00pm</option>
                <option value="8:00pm">8:00pm</option>
              </select>
              <span class="mx-2 text-slate-700 font-medium"> to </span>
              <select
                class="p-2 outline-none text-left font-medium text-slate-500"
                v-model="course.selected_end_time"
                @change="filterSections(course)"
              >
                <option value="8:00am">8:00am</option>
                <option value="9:00am">9:00am</option>
                <option value="10:00am">10:00am</option>
                <option value="11:00am">11:00am</option>
                <option value="12:00pm">12:00pm</option>
                <option value="1:00pm">1:00pm</option>
                <option value="2:00pm">2:00pm</option>
                <option value="3:00pm">3:00pm</option>
                <option value="4:00pm">4:00pm</option>
                <option value="5:00pm">5:00pm</option>
                <option value="6:00pm">6:00pm</option>
                <option value="7:00pm">7:00pm</option>
                <option value="8:00pm">8:00pm</option>
                <option value="9:00pm">9:00pm</option>
              </select>
            </div>
            <div class="hidden md:inline-flex items-center text-sm">
              <span class="m-1 text-slate-700 font-medium">
                <b>{{ course.filtered_sections.length }}</b> lecture times
                (including online) shown from
              </span>
              <select
                class="p-2 outline-none text-slate-500 font-medium text-left"
                v-model="course.selected_start_time"
                @change="filterSections(course)"
              >
                <option value="8:00am">8:00am</option>
                <option value="9:00am">9:00am</option>
                <option value="10:00am">10:00am</option>
                <option value="11:00am">11:00am</option>
                <option value="12:00pm">12:00pm</option>
                <option value="1:00pm">1:00pm</option>
                <option value="2:00pm">2:00pm</option>
                <option value="3:00pm">3:00pm</option>
                <option value="4:00pm">4:00pm</option>
                <option value="5:00pm">5:00pm</option>
                <option value="6:00pm">6:00pm</option>
                <option value="7:00pm">7:00pm</option>
                <option value="8:00pm">8:00pm</option>
              </select>
              <span class="mx-2 text-slate-700 font-medium"> to </span>
              <select
                class="p-2 outline-none text-left font-medium text-slate-500"
                v-model="course.selected_end_time"
                @change="filterSections(course)"
              >
                <option value="8:00am">8:00am</option>
                <option value="9:00am">9:00am</option>
                <option value="10:00am">10:00am</option>
                <option value="11:00am">11:00am</option>
                <option value="12:00pm">12:00pm</option>
                <option value="1:00pm">1:00pm</option>
                <option value="2:00pm">2:00pm</option>
                <option value="3:00pm">3:00pm</option>
                <option value="4:00pm">4:00pm</option>
                <option value="5:00pm">5:00pm</option>
                <option value="6:00pm">6:00pm</option>
                <option value="7:00pm">7:00pm</option>
                <option value="8:00pm">8:00pm</option>
                <option value="9:00pm">9:00pm</option>
              </select>
            </div>
          </div>
        </div>
        <div
          class="rounded p-1"
          v-show="course.show_section || courses.length < 4"
        >
          <div v-for="section in course.filtered_sections" :key="section.id">
            <div
              class="flex items-center pt-3 pb-4 border-b-2 border-slate-300"
            >
              <div class="flex flex-col">
                <div class="text-sm font-bold text-slate-400">
                  {{ section.id }}
                  <i
                    v-if="section.id.startsWith('FC')"
                    class="text-sm font-medium"
                    >Freshman Connection Only</i
                  >
                </div>
                <div class="text-sm text-slate-700 font-bold">
                  <a
                    v-if="
                      section.instructors[0].rating &&
                      section.instructors[0].rating != 'N/A'
                    "
                    :href="
                      'https://planetterp.com/professor/' +
                      section.instructors[0].slug
                    "
                    target="_blank"
                  >
                    {{ section.instructors[0].name }}
                  </a>
                  <span v-else> {{ section.instructors[0].name }}</span>
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
                        class="px-1 py-1 flex items-center gap-2 text-xs font-bold text-center rounded inline-flex mt-1 mb-1"
                      >
                        <font-awesome-icon :icon="['fas', 'star']" />
                        <span>{{
                          section.instructors[0].rating.toFixed(3)
                        }}</span>
                      </div>
                    </div>
                  </a>
                </div>
                <div class="flex flex-row gap-6 text-sm">
                  <div
                    class="font-medium mt-4 pl-2 border-l-6"
                    :class="defineAccentColor(meeting.class_type)"
                    v-for="meeting in section.days_info"
                    :key="meeting.days"
                  >
                    <div class="flex flex-col">
                      <div class="font-bold text-slate-700">
                        {{ meeting.class_type }}
                      </div>
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
                v-if="useAuthStore().user.user"
                class="flex flex-row ml-auto mb-auto bg-slate-500 w-1/5"
              >
                <div class="hidden md:flex m-auto w-full flex-grid grid-rows-2">
                  <div
                    :class="
                      defineColor(100 - 100 * (section.open / section.total))
                    "
                    class="text-center text-slate-800 p-2 text-base font-bold w-6/7"
                  >
                    <div>
                      {{
                        (100 * (section.open / section.total)).toFixed(1) == 0
                          ? "Closed"
                          : "Available"
                      }}
                    </div>
                    <div class="text-sm font-medium">
                      <b class="text-sm">{{ section.open }}</b> open,
                      <b class="text-sm">{{ section.total }}</b> seats
                    </div>
                  </div>
                  <div
                    :class="
                      defineBookmarkColor(course.id, course.title, section)
                    "
                    v-if="section.open > 0"
                    class="text-center p-2 text-lg cursor-pointer font-bold items-center justify-center w-1/7"
                    @click="saveCourse(course.id, course.title, section)"
                  >
                    <font-awesome-icon :icon="['fas', 'bookmark']" />
                  </div>
                  <div
                    :class="
                      defineSlingshotColor(course.id, course.title, section)
                    "
                    v-else
                    class="text-center p-2 text-lg cursor-pointer font-bold items-center justify-center w-1/7"
                    @click="addToSlingshot(course.id, course.title, section)"
                  >
                    <font-awesome-icon :icon="['fas', 'crosshairs']" />
                  </div>
                </div>
              </div>
              <div v-else class="flex flex-row ml-auto mb-auto w-1/7">
                <div
                  :class="
                    defineColor(100 - 100 * (section.open / section.total))
                  "
                  class="text-center w-full text-slate-800 p-2 text-base font-bold"
                >
                  <div>
                    {{
                      (100 * (section.open / section.total)).toFixed(1) == 0
                        ? "Closed"
                        : "Available"
                    }}
                  </div>
                  <div class="text-sm font-medium">
                    <b class="text-sm">{{ section.open }}</b> open,
                    <b class="text-sm">{{ section.total }}</b> seats
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="course.filtered_sections == 0"
            class="font-semibold text-slate-500 text-sm"
          >
            {{
              this.twelveTo24(course.selected_start_time) >=
              this.twelveTo24(course.selected_end_time)
                ? "Please select valid bounds for the time filters."
                : "Sections not found."
            }}
          </div>
        </div>
      </div>
      <img
        src="@/assets/images/logos-formal-seal.webp"
        class="w-10 m-auto mb-2 mt-5"
      />
      <div class="text-xs text-center">
        search powered by
        <nuxt-link to="https://app.testudo.umd.edu/soc/">
          https://app.testudo.umd.edu/soc
        </nuxt-link>
      </div>
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
</template>

<script>
import axios from "axios";
import { useRoute } from "vue-router";

definePageMeta({
  middleware: ["auth"],
});

export default defineComponent({
  data() {
    return {
      courses: [],
      backup: [],
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
        data = data.map((course) => ({
          ...course,
          selected_start_time: "8:00am",
          filtered_sections: course.sections,
          selected_end_time: "9:00pm",
        }));

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
        return "bg-slate-600 text-white";
      } else {
        return "bg-slate-200 text-slate-700";
      }
    },
    defineBookmarkColor(id, name, section) {
      let user = useAuthStore().user.user;

      let entry = {
        course_id: id,
        course_name: name,
        section: section,
      };

      let entryExists = user.saved_courses.find((course) => {
        return (
          course.section.id == entry.section.id &&
          course.course_id == entry.course_id
        );
      });

      if (!entryExists) {
        return "text-white bg-slate-300";
      } else {
        return "bg-red-700 text-yellow-500";
      }
    },
    defineSlingshotColor(id, name, section) {
      let user = useAuthStore().user.user;

      let entry = {
        course_id: id,
        course_name: name,
        section: section,
      };

      let entryExists = user.slingshot_courses.find((course) => {
        return (
          course.section.id == entry.section.id &&
          course.course_id == entry.course_id
        );
      });

      if (!entryExists) {
        return "text-slate-100 bg-slate-300";
      } else {
        return "bg-green-600 text-slate-100";
      }
    },
    async saveCourse(id, name, section) {
      try {
        let user = useAuthStore().user.user;

        let entry = {
          course_id: id,
          course_name: name,
          section: section,
        };

        let index = user.saved_courses.findIndex(
          (course) =>
            course.section.id === entry.section.id &&
            course.course_id === entry.course_id
        );

        console.log(index);

        if (index == -1) {
          user.saved_courses.unshift(entry);
        } else {
          user.saved_courses.splice(index, 1);
        }

        await axios.put("/api/auth/update", user, {
          withCredentials: true,
        });
      } catch (e) {
        console.log(e.message);
      }
    },
    async addToSlingshot(id, name, section) {
      try {
        let user = useAuthStore().user.user;

        let entry = {
          course_id: id,
          course_name: name,
          section: section,
          status: "Active",
        };

        let index = user.slingshot_courses.findIndex(
          (course) =>
            course.section.id === entry.section.id &&
            course.course_id === entry.course_id
        );

        console.log(index);

        if (index == -1) {
          user.slingshot_courses.unshift(entry);
        } else {
          user.slingshot_courses.splice(index, 1);
        }

        await axios.put("/api/auth/update", user, {
          withCredentials: true,
        });
      } catch (e) {
        console.log(e.message);
      }
    },
    defineAccentColor(value) {
      if (value == "Lecture") {
        return "border-blue-500";
      } else if (value == "Discussion") {
        return "border-teal-500";
      } else {
        return "border-green-500";
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
    filterSections(course) {
      console.log("changing");
      course.filtered_sections = course.sections.filter((section) => {
        return (
          section.days_info[0].room == "ONLINE" ||
          this.isWithinBounds(
            section.days_info[0].start_time,
            section.days_info[0].end_time,
            course.selected_start_time,
            course.selected_end_time
          )
        );
      });
    },
    isWithinBounds(lecture_start_time, lecture_end_time, min_time, max_time) {
      let ltsN = this.twelveTo24(lecture_start_time);
      let lteN = this.twelveTo24(lecture_end_time);
      let minN = this.twelveTo24(min_time);
      let maxN = this.twelveTo24(max_time);

      return ltsN >= minN && ltsN <= maxN && lteN >= minN && lteN <= maxN;
    },
    twelveTo24(time) {
      let t = parseFloat(time.split(":")[0]);
      if (
        time.split(":")[1].charAt(time.split(":")[1].length - 2) == "p" &&
        t != 12
      ) {
        t += 12;
      }

      if (time.split(":")[1].charAt(0) != "0") {
        t +=
          parseFloat(
            time.split(":")[1].charAt(0) + time.split(":")[1].charAt(1)
          ) / 100.0;
      }

      return t;
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
