<template>
  <div class="p-10">
    <div class="mb-5">
      <div class="w-3/4">
        <div class="text-3xl font-bold">My Fall 2025 Watchlist</div>
        <div class="text-sm mt-1">
          Keep an eye on your courses and alerts you via email if a course
          closes. It would then roll over to Section Slingshot and notify you if
          the course opens up again.
          <b> In some cases, Tortuga may send emails to your spam inbox. </b>
          Please check to make sure and add Tortuga as a trusted sender.
        </div>
      </div>
    </div>
    <div
      v-for="course in saved_courses"
      :key="course.course_id + course.section.id"
      class="odd:bg-yellow-50 even:bg-slate-50 px-2"
    >
      <div class="flex items-center pt-3 pb-4">
        <div class="flex flex-col">
          <div class="text-sm font-bold text-slate-400">
            <div class="text-sm font-bold text-slate-500">
              <span class="text-slate-400"> {{ course.section.id }} </span> -
              {{ course.course_id }} -
              {{ course.course_name }}
            </div>
            <i
              v-if="course.section.id.startsWith('FC')"
              class="text-sm font-medium"
              >Freshman Connection Only</i
            >
          </div>
          <div class="text-sm text-slate-700 font-bold">
            {{ course.section.instructors[0].name }}
          </div>
          <div class="w-full">
            <a
              target="_blank"
              :href="
                'https://planetterp.com/professor/' +
                course.section.instructors[0].slug
              "
            >
              <div
                v-if="
                  course.section.instructors[0].rating &&
                  course.section.instructors[0].rating != 'N/A'
                "
              >
                <div
                  :class="
                    defineRatingColor(course.section.instructors[0].rating)
                  "
                  class="px-1 py-1 flex items-center gap-2 text-xs font-bold text-center rounded inline-flex mt-1 mb-1"
                >
                  <font-awesome-icon :icon="['fas', 'star']" />
                  <span>{{
                    course.section.instructors[0].rating.toFixed(3)
                  }}</span>
                </div>
              </div>
            </a>
          </div>
          <div class="flex flex-row gap-6 text-sm">
            <div
              class="font-medium mt-4 pl-2 border-l-6"
              :class="defineAccentColor(meeting.class_type)"
              v-for="meeting in course.section.days_info"
              :key="meeting.days"
            >
              <div class="flex flex-col">
                <div class="font-bold text-slate-700">
                  {{ meeting.class_type }}
                </div>
                <div>
                  {{ meeting.days != "N/A" ? meeting.days : "" }}
                  {{
                    meeting.start_time != "N/A" ? meeting.start_time + "-" : ""
                  }}{{
                    meeting.end_time != "N/A" ? meeting.end_time + ", " : ""
                  }}
                  {{ meeting.building != "N/A" ? meeting.building : "" }}
                  {{ meeting.room != "N/A" ? meeting.room : "" }}
                  {{ meeting.message != "N/A" ? meeting.message : "" }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-row ml-auto mb-auto bg-slate-500 w-1/5">
          <div class="m-auto w-full flex flex-grid grid-rows-2">
            <div
              :class="
                defineColor(
                  100 - 100 * (course.section.open / course.section.total)
                )
              "
              class="text-center text-slate-800 p-2 text-base font-bold w-6/7"
            >
              <div>
                {{
                  (100 * (course.section.open / course.section.total)).toFixed(
                    1
                  ) == 0
                    ? "Closed"
                    : "Available"
                }}
              </div>
              <div class="text-sm font-medium">
                <b class="text-sm">{{ course.section.open }}</b> open,
                <b class="text-sm">{{ course.section.total }}</b> seats
              </div>
            </div>
            <div
              class="text-center p-2 text-lg text-white cursor-pointer font-bold items-center justify-center w-1/7"
              @click="
                saveCourse(course.course_id, course.course_name, course.section)
              "
            >
              <font-awesome-icon :icon="['fas', 'trash']" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="saved_courses.length == 0" class="text-slate-500 font-bold">
      No courses on the watchlist. Add them through browsing the course catalog.
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
      saved_courses: [],
    };
  },
  async mounted() {
    let user = useAuthStore().user.user;
    this.saved_courses = user.saved_courses;
  },
  methods: {
    defineAccentColor(value) {
      if (value == "Lecture") {
        return "border-blue-500";
      } else if (value == "Discussion") {
        return "border-teal-500";
      } else {
        return "border-green-500";
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
        return "text-yellow-600 bg-slate-200";
      } else {
        return "bg-yellow-500 text-slate-100";
      }
    },
    defineColor(value) {
      if (value == 100) {
        return "bg-slate-700 text-white";
      } else {
        return "bg-slate-200 text-slate-700";
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
          user.saved_courses.push(entry);
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
  },
};
</script>
