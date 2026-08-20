<template>
  <div class="h-[calc(100vh-11rem)] flex flex-col px-6 sm:px-10 pt-8">
    <!-- Header -->
    <div class="mb-3 flex flex-col sm:flex-row sm:items-end gap-2 shrink-0">
      <div>
        <div class="text-3xl font-bold">Schedule Builder</div>
        <div class="text-sm text-slate-600 mt-1">
          Search a course, expand it to see its sections, and build your Fall
          2026 week. Time conflicts are flagged automatically.
        </div>
      </div>
      <div class="sm:ml-auto text-sm">
        <nuxt-link to="/my-tools/dashboard" class="text-blue-600 font-semibold"
          >&larr; Back to dashboard</nuxt-link
        >
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
      <!-- LEFT: search + course accordion + added list -->
      <div class="lg:w-1/3 w-full flex flex-col min-h-0">
        <!-- Search (fixed at top of the column) -->
        <div
          class="bg-white p-2 rounded border-2 border-slate-200 flex items-center gap-2 shrink-0"
        >
          <font-awesome-icon
            :icon="['fas', 'magnifying-glass']"
            class="text-slate-500"
          />
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search a course (e.g. CMSC250)"
            class="outline-none w-full font-semibold"
          />
        </div>

        <!-- Scrollable results + schedule list -->
        <div class="flex-1 overflow-y-auto min-h-0 mt-2 pr-1">
          <!-- Course accordion (empty search => nothing shown) -->
          <div
            v-for="course in filteredCourses"
            :key="course.course_id"
            class="border border-slate-200 rounded mb-2 overflow-hidden"
          >
            <button
              @click="toggleCourse(course)"
              class="w-full flex items-center justify-between p-2 text-left hover:bg-slate-50 cursor-pointer"
            >
              <div>
                <div class="font-bold text-slate-800 text-sm">
                  {{ course.course_id }}
                </div>
                <div class="text-xs text-slate-500">{{ course.name }}</div>
              </div>
              <font-awesome-icon
                :icon="[
                  'fas',
                  expanded[course.course_id] ? 'chevron-up' : 'chevron-down',
                ]"
                class="text-slate-400 ml-2"
              />
            </button>

            <!-- Expanded sections -->
            <div
              v-if="expanded[course.course_id]"
              class="border-t border-slate-100 p-2"
            >
              <div
                v-if="loadingCourse[course.course_id]"
                class="text-xs text-slate-500"
              >
                Loading sections…
              </div>
              <div
                v-else-if="errorCourse[course.course_id]"
                class="text-xs text-red-600"
              >
                {{ errorCourse[course.course_id] }}
              </div>

              <div
                v-for="section in sortedSections(sectionsCache[course.course_id])"
                :key="section.id"
                class="border border-slate-200 rounded p-2 mb-2 text-sm"
              >
                <div class="flex items-start justify-between gap-2">
                  <div class="font-semibold">
                    Section {{ section.id }}
                    <span
                      :class="section.open > 0 ? 'text-green-600' : 'text-red-600'"
                      class="text-xs font-bold ml-1"
                    >
                      {{ section.open > 0 ? section.open + " open" : "Closed" }}
                    </span>
                  </div>
                  <div class="flex items-center gap-1 shrink-0">
                    <!-- Add to schedule grid -->
                    <button
                      @click="addSection(course.course_id, section)"
                      :disabled="isAdded(course.course_id, section.id)"
                      class="text-xs font-semibold px-2 py-1 rounded cursor-pointer"
                      :class="
                        isAdded(course.course_id, section.id)
                          ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                          : 'bg-red-700 text-white'
                      "
                    >
                      {{ isAdded(course.course_id, section.id) ? "Added" : "Add" }}
                    </button>

                    <!-- Open => Course Watcher (eye) -->
                    <button
                      v-if="section.open > 0"
                      @click="toggleWatcher(course, section)"
                      title="Add to Course Watcher"
                      class="text-xs font-semibold px-2 py-1 rounded cursor-pointer flex items-center gap-1"
                      :class="
                        isWatching(course.course_id, section.id)
                          ? 'bg-yellow-500 text-white'
                          : 'bg-slate-200 text-slate-700'
                      "
                    >
                      <font-awesome-icon :icon="['fas', 'eye']" />
                      {{
                        isWatching(course.course_id, section.id)
                          ? "Watching"
                          : "Watch"
                      }}
                    </button>

                    <!-- Closed => Section Slingshot (crosshairs) -->
                    <button
                      v-else
                      @click="toggleSlingshot(course, section)"
                      title="Add to Section Slingshot"
                      class="text-xs font-semibold px-2 py-1 rounded cursor-pointer flex items-center gap-1"
                      :class="
                        isSlingshotting(course.course_id, section.id)
                          ? 'bg-green-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      "
                    >
                      <font-awesome-icon :icon="['fas', 'crosshairs']" />
                      {{
                        isSlingshotting(course.course_id, section.id)
                          ? "Slinging"
                          : "Slingshot"
                      }}
                    </button>
                  </div>
                </div>

                <!-- Instructors + PlanetTerp ratings -->
                <div
                  class="text-xs text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-1 mt-0.5"
                >
                  <template
                    v-for="(name, idx) in section.instructors"
                    :key="idx"
                  >
                    <span class="flex items-center gap-1">
                      <a
                        v-if="ratingSlug(name)"
                        :href="'https://planetterp.com/professor/' + ratingSlug(name)"
                        target="_blank"
                        class="font-semibold text-slate-700 hover:underline"
                        >{{ name }}</a
                      >
                      <span v-else class="text-slate-700">{{ name }}</span>
                      <a
                        v-if="ratingValue(name) != null"
                        :href="'https://planetterp.com/professor/' + ratingSlug(name)"
                        target="_blank"
                      >
                        <span
                          :class="defineRatingColor(ratingValue(name))"
                          class="px-1 py-0.5 flex items-center gap-1 text-[10px] font-bold rounded inline-flex"
                        >
                          <font-awesome-icon :icon="['fas', 'star']" />
                          {{ ratingValue(name).toFixed(2) }}
                        </span>
                      </a>
                    </span>
                  </template>
                  <span
                    v-if="!section.instructors || !section.instructors.length"
                    class="text-slate-400"
                    >TBA</span
                  >
                </div>

                <!-- Meetings -->
                <div
                  v-for="(d, i) in section.days_info"
                  :key="i"
                  class="text-xs text-slate-600"
                >
                  <span v-if="d.days && d.days !== 'N/A'">
                    {{ d.days }} {{ d.start_time }}–{{ d.end_time }}
                    <span class="text-slate-400"
                      >({{ d.building }} {{ d.room }})</span
                    >
                  </span>
                  <span v-else class="text-slate-400">Online / async</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Added sections list -->
          <div class="mt-4 border-t border-slate-200 pt-3">
            <div class="flex items-center justify-between">
              <div class="font-bold text-slate-800">
                My Schedule ({{ totalCredits }} cr)
              </div>
              <button
                v-if="schedule.length"
                @click="clearSchedule"
                class="text-xs text-red-600 font-semibold cursor-pointer"
              >
                Clear all
              </button>
            </div>
            <div
              v-if="hasConflict"
              class="text-xs text-red-600 font-semibold mt-1"
            >
              ⚠ You have overlapping sections (shown in red).
            </div>
            <div v-if="!schedule.length" class="text-sm text-slate-400 mt-2">
              No sections added yet.
            </div>
            <div
              v-for="item in schedule"
              :key="item.course_id + item.section_id"
              class="border border-slate-200 border-l-4 rounded p-2 mb-2 text-sm"
              :style="{ borderLeftColor: item.color }"
            >
              <div class="flex items-center justify-between">
                <div class="font-semibold">
                  {{ item.course_id }}
                  <span class="text-slate-500 text-xs">{{
                    item.section_id
                  }}</span>
                </div>
                <button
                  @click="removeSection(item)"
                  class="text-xs text-red-600 font-semibold cursor-pointer"
                >
                  Remove
                </button>
              </div>
              <div class="text-xs text-slate-500">
                {{ item.title }} · {{ item.credits }} cr
              </div>
              <div
                class="text-xs text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-1 mt-0.5"
              >
                <template v-for="(name, idx) in item.instructors" :key="idx">
                  <span class="flex items-center gap-1">
                    <a
                      v-if="ratingSlug(name)"
                      :href="'https://planetterp.com/professor/' + ratingSlug(name)"
                      target="_blank"
                      class="font-semibold text-slate-700 hover:underline"
                      >{{ name }}</a
                    >
                    <span v-else class="text-slate-700">{{ name }}</span>
                    <a
                      v-if="ratingValue(name) != null"
                      :href="'https://planetterp.com/professor/' + ratingSlug(name)"
                      target="_blank"
                    >
                      <span
                        :class="defineRatingColor(ratingValue(name))"
                        class="px-1 py-0.5 flex items-center gap-1 text-[10px] font-bold rounded inline-flex"
                      >
                        <font-awesome-icon :icon="['fas', 'star']" />
                        {{ ratingValue(name).toFixed(2) }}
                      </span>
                    </a>
                  </span>
                </template>
                <span
                  v-if="!item.instructors || !item.instructors.length"
                  class="text-slate-400"
                  >TBA</span
                >
              </div>
              <div
                v-for="(d, i) in item.days_info"
                :key="i"
                class="text-xs text-slate-600"
              >
                <span v-if="d.days && d.days !== 'N/A'">
                  {{ d.days }} {{ d.start_time }}–{{ d.end_time }}
                  <span class="text-slate-400"
                    >({{ d.building }} {{ d.room }})</span
                  >
                </span>
                <span v-else class="text-slate-400">Online / async</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT: weekly grid (scrolls internally if tall) -->
      <div class="lg:w-2/3 w-full overflow-auto min-h-0">
        <div class="min-w-[560px]">
          <!-- Day headers -->
          <div class="flex sticky top-0 bg-white z-10">
            <div class="w-14 shrink-0"></div>
            <div
              v-for="day in days"
              :key="day.code"
              class="flex-1 text-center font-semibold text-slate-700 pb-1"
            >
              {{ day.label }}
            </div>
          </div>

          <!-- Grid body -->
          <div class="flex" :style="{ height: gridHeight + 'px' }">
            <!-- Time axis -->
            <div class="w-14 shrink-0 relative">
              <div
                v-for="h in hours"
                :key="h"
                class="absolute right-1 text-[10px] text-slate-400"
                :style="{ top: hourTop(h) + 'px' }"
              >
                {{ formatHour(h) }}
              </div>
            </div>

            <!-- Day columns -->
            <div
              v-for="day in days"
              :key="day.code"
              class="flex-1 relative border-l border-slate-100"
            >
              <div
                v-for="h in hours"
                :key="h"
                class="absolute w-full border-t border-slate-100"
                :style="{ top: hourTop(h) + 'px' }"
              ></div>

              <div
                v-for="block in blocksByDay[day.code]"
                :key="block.key"
                class="absolute left-0.5 right-0.5 rounded px-1 py-0.5 text-white text-[10px] overflow-hidden"
                :style="{
                  top: block.top + 'px',
                  height: block.height + 'px',
                  backgroundColor: block.conflict ? '#dc2626' : block.color,
                  border: block.conflict ? '2px solid #7f1d1d' : 'none',
                }"
              >
                <div class="font-bold leading-tight">
                  {{ block.course_id }}
                </div>
                <div class="leading-tight">{{ block.section_id }}</div>
                <div class="leading-tight opacity-90">{{ block.timeLabel }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useAuthStore } from "~/stores/store.js";

definePageMeta({
  middleware: ["auth"],
});

const DAY_START = 8 * 60;
const DAY_END = 22 * 60;
const HOUR_HEIGHT = 48;
const STORAGE_KEY = "tortuga_schedule";
const PALETTE = [
  "#b91c1c",
  "#c2410c",
  "#a16207",
  "#15803d",
  "#0f766e",
  "#1d4ed8",
  "#6d28d9",
  "#be185d",
  "#0369a1",
  "#4d7c0f",
];

export default {
  data() {
    return {
      searchTerm: "",
      allCourses: [], // full course list from umd.io (for live filter)
      expanded: {}, // course_id -> bool
      sectionsCache: {}, // course_id -> [sections]
      courseMeta: {}, // course_id -> { title, credits }
      loadingCourse: {}, // course_id -> bool
      errorCourse: {}, // course_id -> string
      schedule: [],
      instructorRatings: {}, // name -> { rating, slug }
      savedKeys: new Set(), // "courseId|sectionId" already in Course Watcher
      slingKeys: new Set(), // "courseId|sectionId" already in Section Slingshot
      days: [
        { code: "M", label: "Mon" },
        { code: "Tu", label: "Tue" },
        { code: "W", label: "Wed" },
        { code: "Th", label: "Thu" },
        { code: "F", label: "Fri" },
      ],
    };
  },
  computed: {
    // Live-filtered course list; empty query => nothing.
    filteredCourses() {
      const term = this.searchTerm.toLowerCase().trim();
      if (!term) return [];
      return this.allCourses
        .filter(
          (c) =>
            c.course_id.toLowerCase().includes(term) ||
            (c.name && c.name.toLowerCase().includes(term))
        )
        .slice(0, 40);
    },
    hours() {
      const out = [];
      for (let h = DAY_START / 60; h <= DAY_END / 60; h++) out.push(h);
      return out;
    },
    gridHeight() {
      return ((DAY_END - DAY_START) / 60) * HOUR_HEIGHT;
    },
    totalCredits() {
      return this.schedule.reduce((sum, i) => sum + (i.credits || 0), 0);
    },
    blocksByDay() {
      const byDay = { M: [], Tu: [], W: [], Th: [], F: [] };
      for (const item of this.schedule) {
        for (const d of item.days_info || []) {
          const start = this.parseTime(d.start_time);
          const end = this.parseTime(d.end_time);
          if (start == null || end == null) continue;
          for (const code of this.parseDays(d.days)) {
            if (!byDay[code]) continue;
            byDay[code].push({
              key: item.course_id + item.section_id + code + d.start_time,
              course_id: item.course_id,
              section_id: item.section_id,
              color: item.color,
              startMin: start,
              endMin: end,
              top: ((start - DAY_START) / 60) * HOUR_HEIGHT,
              height: Math.max(((end - start) / 60) * HOUR_HEIGHT, 16),
              timeLabel: `${d.start_time}-${d.end_time}`,
              conflict: false,
            });
          }
        }
      }
      for (const code of Object.keys(byDay)) {
        const list = byDay[code];
        for (let i = 0; i < list.length; i++) {
          for (let j = i + 1; j < list.length; j++) {
            if (
              list[i].startMin < list[j].endMin &&
              list[j].startMin < list[i].endMin
            ) {
              list[i].conflict = true;
              list[j].conflict = true;
            }
          }
        }
      }
      return byDay;
    },
    hasConflict() {
      return Object.values(this.blocksByDay).some((list) =>
        list.some((b) => b.conflict)
      );
    },
  },
  async mounted() {
    // Restore schedule from localStorage.
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        this.schedule = JSON.parse(saved);
      } catch (e) {
        this.schedule = [];
      }
    }
    // Seed watcher/slingshot membership from the logged-in user.
    const user = useAuthStore().user && useAuthStore().user.user;
    if (user) {
      this.savedKeys = new Set(
        (user.saved_courses || []).map((c) => c.course_id + "|" + c.section.id)
      );
      this.slingKeys = new Set(
        (user.slingshot_courses || []).map(
          (c) => c.course_id + "|" + c.section.id
        )
      );
    }
    // Ratings for restored schedule instructors.
    const savedNames = new Set();
    this.schedule.forEach((i) =>
      (i.instructors || []).forEach((n) => savedNames.add(n))
    );
    this.fetchRatings(savedNames);
    // Full course list for live filtering.
    try {
      const { data } = await axios.get("https://api.umd.io/v1/courses/list");
      if (Array.isArray(data)) this.allCourses = data;
    } catch (e) {
      this.allCourses = [];
    }
  },
  methods: {
    toggleCourse(course) {
      const id = course.course_id;
      const willExpand = !this.expanded[id];
      this.expanded = { ...this.expanded, [id]: willExpand };
      if (willExpand && !this.sectionsCache[id]) this.loadCourseSections(id);
    },
    async loadCourseSections(courseId) {
      this.loadingCourse = { ...this.loadingCourse, [courseId]: true };
      this.errorCourse = { ...this.errorCourse, [courseId]: "" };
      try {
        // openOnly=false so closed sections show too (for Slingshot).
        const { data } = await axios.get("/api/scraper/get-course-info", {
          params: { course: courseId, openOnly: "false" },
        });
        if (!Array.isArray(data) || data.length === 0) {
          this.errorCourse = {
            ...this.errorCourse,
            [courseId]: "No sections found for this course.",
          };
        } else {
          const course = data.find((c) => c.id === courseId) || data[0];
          this.sectionsCache = {
            ...this.sectionsCache,
            [courseId]: course.sections || [],
          };
          this.courseMeta = {
            ...this.courseMeta,
            [courseId]: { title: course.title, credits: course.credits },
          };
          const names = new Set();
          (course.sections || []).forEach((s) =>
            (s.instructors || []).forEach((n) => names.add(n))
          );
          this.fetchRatings(names);
        }
      } catch (e) {
        this.errorCourse = {
          ...this.errorCourse,
          [courseId]: "Something went wrong loading sections.",
        };
      } finally {
        this.loadingCourse = { ...this.loadingCourse, [courseId]: false };
      }
    },
    sortedSections(sections) {
      return [...(sections || [])].sort((a, b) => {
        const ao = a.open != null && a.open > 0 ? 1 : 0;
        const bo = b.open != null && b.open > 0 ? 1 : 0;
        if (ao !== bo) return bo - ao;
        return (b.open || 0) - (a.open || 0);
      });
    },
    // ---- schedule grid ----
    isAdded(courseId, sectionId) {
      return this.schedule.some(
        (i) => i.course_id === courseId && i.section_id === sectionId
      );
    },
    addSection(courseId, section) {
      if (this.isAdded(courseId, section.id)) return;
      const meta = this.courseMeta[courseId] || {};
      this.schedule.push({
        course_id: courseId,
        title: meta.title || "",
        credits: parseFloat(meta.credits) || 0,
        section_id: section.id,
        instructors: section.instructors || [],
        days_info: section.days_info || [],
        color: PALETTE[this.schedule.length % PALETTE.length],
      });
      this.save();
    },
    removeSection(item) {
      this.schedule = this.schedule.filter(
        (i) =>
          !(i.course_id === item.course_id && i.section_id === item.section_id)
      );
      this.schedule.forEach(
        (i, idx) => (i.color = PALETTE[idx % PALETTE.length])
      );
      this.save();
    },
    clearSchedule() {
      this.schedule = [];
      this.save();
    },
    save() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.schedule));
    },
    // ---- Course Watcher / Section Slingshot ----
    buildSectionObject(section) {
      return {
        id: section.id,
        open: section.open,
        total: section.total,
        instructors: (section.instructors || []).map((n) => {
          const r = this.instructorRatings[n] || {};
          return {
            name: n,
            rating: r.rating != null ? r.rating : "N/A",
            slug: r.slug != null ? r.slug : "N/A",
          };
        }),
        days_info: section.days_info || [],
      };
    },
    isWatching(courseId, sectionId) {
      return this.savedKeys.has(courseId + "|" + sectionId);
    },
    isSlingshotting(courseId, sectionId) {
      return this.slingKeys.has(courseId + "|" + sectionId);
    },
    async toggleWatcher(course, section) {
      const user = useAuthStore().user && useAuthStore().user.user;
      if (!user) return;
      if (!Array.isArray(user.saved_courses)) user.saved_courses = [];
      const entry = {
        course_id: course.course_id,
        course_name:
          (this.courseMeta[course.course_id] || {}).title || course.name,
        section: this.buildSectionObject(section),
      };
      const idx = user.saved_courses.findIndex(
        (c) =>
          c.course_id === entry.course_id && c.section.id === entry.section.id
      );
      if (idx === -1) user.saved_courses.push(entry);
      else user.saved_courses.splice(idx, 1);
      this.savedKeys = new Set(
        user.saved_courses.map((c) => c.course_id + "|" + c.section.id)
      );
      try {
        await axios.put("/api/auth/update", user, { withCredentials: true });
      } catch (e) {
        console.log(e.message);
      }
    },
    async toggleSlingshot(course, section) {
      const user = useAuthStore().user && useAuthStore().user.user;
      if (!user) return;
      if (!Array.isArray(user.slingshot_courses)) user.slingshot_courses = [];
      const entry = {
        course_id: course.course_id,
        course_name:
          (this.courseMeta[course.course_id] || {}).title || course.name,
        section: this.buildSectionObject(section),
        status: "Active",
      };
      const idx = user.slingshot_courses.findIndex(
        (c) =>
          c.course_id === entry.course_id && c.section.id === entry.section.id
      );
      if (idx === -1) user.slingshot_courses.push(entry);
      else user.slingshot_courses.splice(idx, 1);
      this.slingKeys = new Set(
        user.slingshot_courses.map((c) => c.course_id + "|" + c.section.id)
      );
      try {
        await axios.put("/api/auth/update", user, { withCredentials: true });
      } catch (e) {
        console.log(e.message);
      }
    },
    // ---- PlanetTerp ratings ----
    async fetchRatings(names) {
      const toFetch = [...names].filter(
        (n) => n && n !== "N/A" && n !== "TBA" && !(n in this.instructorRatings)
      );
      if (!toFetch.length) return;
      await Promise.all(
        toFetch.map(async (name) => {
          try {
            const { data } = await axios.get(
              `https://planetterp.com/api/v1/professor?name=${encodeURIComponent(
                name
              )}`
            );
            if (data && data.average_rating) {
              this.instructorRatings[name] = {
                rating: data.average_rating,
                slug: data.slug,
              };
            } else {
              this.instructorRatings[name] = { rating: "N/A", slug: "N/A" };
            }
          } catch (e) {
            this.instructorRatings[name] = { rating: "N/A", slug: "N/A" };
          }
        })
      );
      this.instructorRatings = { ...this.instructorRatings };
    },
    ratingValue(name) {
      const r = this.instructorRatings[name];
      return r && r.rating !== "N/A" ? r.rating : null;
    },
    ratingSlug(name) {
      const r = this.instructorRatings[name];
      return r && r.slug !== "N/A" ? r.slug : null;
    },
    defineRatingColor(value) {
      if (value >= 4.5) return "bg-green-600 text-white";
      if (value >= 4) return "bg-green-500 text-white";
      if (value >= 3.5) return "bg-yellow-500 text-white";
      if (value >= 3) return "bg-orange-400 text-white";
      if (value >= 2.5) return "bg-orange-500 text-white";
      return "bg-red-600 text-white";
    },
    // ---- time/day parsing ----
    parseTime(str) {
      if (!str || str === "N/A") return null;
      const m = str.trim().match(/(\d{1,2}):(\d{2})\s*(am|pm)/i);
      if (!m) return null;
      let h = parseInt(m[1], 10) % 12;
      const min = parseInt(m[2], 10);
      if (m[3].toLowerCase() === "pm") h += 12;
      return h * 60 + min;
    },
    parseDays(str) {
      if (!str || str === "N/A") return [];
      const out = [];
      let i = 0;
      while (i < str.length) {
        const two = str.substr(i, 2);
        if (["Tu", "Th", "Sa", "Su"].includes(two)) {
          out.push(two);
          i += 2;
        } else {
          out.push(str.substr(i, 1));
          i += 1;
        }
      }
      return out;
    },
    hourTop(h) {
      return ((h * 60 - DAY_START) / 60) * HOUR_HEIGHT;
    },
    formatHour(h) {
      const ampm = h >= 12 ? "pm" : "am";
      const hr = h % 12 === 0 ? 12 : h % 12;
      return `${hr}${ampm}`;
    },
  },
};
</script>
