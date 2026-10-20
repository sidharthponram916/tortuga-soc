<template>
  <div class="p-4 sm:p-10">
    <div class="mb-6 text-center sm:text-left">
      <div class="text-3xl font-bold">Fall 2026 Scheduler</div>
      <div class="text-sm sm:text-xs mt-1 sm:w-5/6">
        Add the courses you're planning to take, then either pick sections by
        hand or let Tortuga generate every conflict-free schedule and rank them
        by your preferences. Your plan is saved in this browser. When you're
        ready, copy your sections and register on Testudo.
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Left panel -->
      <div class="lg:w-[420px] lg:shrink-0">
        <div class="flex border-2 border-slate-200 mb-4">
          <button
            class="w-1/2 p-2 text-sm font-bold cursor-pointer"
            :class="
              mode == 'build'
                ? 'bg-slate-950 text-slate-100'
                : 'bg-slate-50 text-slate-600'
            "
            @click="mode = 'build'"
          >
            <font-awesome-icon :icon="['fas', 'hand-pointer']" /> Build
            Manually
          </button>
          <button
            class="w-1/2 p-2 text-sm font-bold cursor-pointer"
            :class="
              mode == 'generate'
                ? 'bg-slate-950 text-slate-100'
                : 'bg-slate-50 text-slate-600'
            "
            @click="mode = 'generate'"
          >
            <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" />
            Auto-Generate
          </button>
        </div>

        <!-- Add course -->
        <div class="flex items-center gap-2 mb-2">
          <span
            class="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center shrink-0"
            >1</span
          >
          <span class="font-bold text-lg">Add your courses</span>
        </div>
        <form
          class="flex p-2 border-2 bg-white text-sm"
          :class="
            courses.length ? 'border-slate-200' : 'border-red-600 shadow-md'
          "
          @submit.prevent="addCourse()"
        >
          <font-awesome-icon
            :icon="['fas', 'magnifying-glass']"
            class="text-slate-500 my-auto"
          />
          <input
            ref="courseInput"
            v-model="newCourse"
            type="text"
            class="ml-2 outline-none w-full uppercase"
            placeholder="Type a course code, e.g. CMSC216"
          />
          <button
            type="submit"
            class="ml-2 px-3 py-1 bg-red-600 text-white font-bold rounded cursor-pointer"
          >
            <font-awesome-icon :icon="['fas', 'plus']" /> Add
          </button>
        </form>
        <div v-if="addError" class="text-xs text-red-600 mt-1">
          {{ addError }}
        </div>

        <div
          v-if="!courses.length"
          class="mt-3 p-4 border-2 border-dashed border-slate-300 bg-slate-50 text-center text-sm text-slate-600"
        >
          <div class="font-bold text-slate-700">No courses yet</div>
          <div class="text-xs mt-1">
            Add every course you want to take this semester. Press Enter or
            <b>Add</b> after each one.
          </div>
          <div class="flex flex-wrap justify-center gap-1 mt-3">
            <button
              v-for="example in ['CMSC131', 'MATH140', 'ENGL101']"
              :key="example"
              class="px-2 py-1 text-xs font-bold bg-white border-2 border-slate-200 hover:border-red-600 cursor-pointer"
              @click="addCourse(example)"
            >
              <font-awesome-icon :icon="['fas', 'plus']" /> {{ example }}
            </button>
          </div>
        </div>

        <div v-else class="flex text-xs text-slate-500 mt-3 mb-2">
          <span>
            <b class="text-slate-700">{{ courses.length }}</b> courses,
            <b class="text-slate-700">{{ plannedCredits }}</b> credits
          </span>
          <button
            v-if="courses.length"
            class="ml-auto hover:text-red-600 cursor-pointer"
            @click="clearAll"
          >
            Clear all
          </button>
        </div>

        <!-- Course list -->
        <div
          v-for="course in courses"
          :key="course.id"
          class="border-2 border-slate-200 mb-2 bg-slate-50"
        >
          <div
            class="flex items-center p-2 cursor-pointer"
            @click="toggleExpanded(course.id)"
          >
            <span
              class="w-3 h-3 rounded-full mr-2 shrink-0"
              :style="{ background: colorFor(course.id).border }"
            ></span>
            <div class="flex flex-col min-w-0">
              <div class="font-bold text-sm">
                {{ course.id }}
                <span
                  v-if="mode == 'build' && selected[course.id]"
                  class="text-slate-400 font-medium"
                >
                  &middot; {{ selected[course.id] }}
                </span>
              </div>
              <div class="text-xs text-slate-500 truncate">
                <span v-if="course.loading">Loading sections...</span>
                <span v-else-if="course.error" class="text-red-600">
                  {{ course.error }}
                </span>
                <span v-else
                  >{{ course.title }} &middot; {{ course.credits }} cr &middot;
                  {{ course.sections.length }} sections</span
                >
              </div>
            </div>
            <font-awesome-icon
              class="ml-auto text-slate-400 text-xs"
              :icon="[
                'fas',
                expanded[course.id] ? 'chevron-up' : 'chevron-down',
              ]"
            />
            <button
              class="ml-3 text-slate-400 hover:text-red-600 cursor-pointer"
              title="Remove course"
              @click.stop="removeCourse(course.id)"
            >
              <font-awesome-icon :icon="['fas', 'xmark']" />
            </button>
          </div>

          <div
            v-if="expanded[course.id] && !course.loading && !course.error"
            class="border-t-2 border-slate-200 bg-white max-h-80 overflow-y-auto"
          >
            <div class="text-[11px] text-slate-500 px-2 pt-2">
              <span v-if="mode == 'build'"
                >Click a section to add it. Hover to preview.</span
              >
              <span v-else
                ><font-awesome-icon :icon="['fas', 'ban']" /> excludes a
                section from generated schedules.</span
              >
            </div>
            <div
              v-for="section in course.sections"
              :key="section.id"
              class="flex items-start p-2 text-xs border-b border-slate-100"
              :class="[
                mode == 'build' ? 'cursor-pointer hover:bg-slate-50' : '',
                selected[course.id] == section.id && mode == 'build'
                  ? 'bg-yellow-50'
                  : '',
                isExcluded(course.id, section.id) ? 'opacity-40' : '',
              ]"
              @click="mode == 'build' && selectSection(course.id, section.id)"
              @mouseenter="hovered = mode == 'build' ? section : null"
              @mouseleave="hovered = null"
            >
              <div class="flex flex-col w-full">
                <div class="flex items-center gap-2">
                  <b class="text-slate-700">{{ section.id }}</b>
                  <span class="text-slate-700 truncate">{{
                    section.instructors.join(", ") || "Instructor TBA"
                  }}</span>
                  <span
                    v-if="typeof ratings[section.instructors[0]] == 'number'"
                    class="px-1 rounded font-bold"
                    :class="ratingColor(ratings[section.instructors[0]])"
                  >
                    <font-awesome-icon :icon="['fas', 'star']" />
                    {{ ratings[section.instructors[0]].toFixed(2) }}
                  </span>
                  <span
                    class="ml-auto shrink-0"
                    :class="
                      section.open > 0 ? 'text-green-700' : 'text-red-600'
                    "
                  >
                    {{ section.open }}/{{ section.total }} open
                    <span v-if="section.waitlist"
                      >&middot; WL {{ section.waitlist }}</span
                    >
                  </span>
                </div>
                <div class="text-slate-500 mt-1">
                  {{ describeSection(section) }}
                </div>
              </div>
              <button
                v-if="mode == 'generate'"
                class="ml-2 cursor-pointer"
                :class="
                  isExcluded(course.id, section.id)
                    ? 'text-red-600'
                    : 'text-slate-300 hover:text-red-600'
                "
                title="Exclude from generated schedules"
                @click.stop="toggleExcluded(course.id, section.id)"
              >
                <font-awesome-icon :icon="['fas', 'ban']" />
              </button>
            </div>
          </div>
        </div>

        <!-- Generator options -->
        <div
          v-if="mode == 'generate'"
          class="border-2 border-slate-200 bg-slate-50 p-4 mt-4 text-sm"
        >
          <div class="flex items-center gap-2 mb-2">
            <span
              class="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center shrink-0"
              >2</span
            >
            <span class="font-bold text-lg">Set your constraints</span>
          </div>
          <div class="flex gap-2">
            <label class="w-1/2">
              <div class="text-xs font-bold text-slate-500">
                No classes before
              </div>
              <select
                v-model.number="constraints.earliest"
                class="p-1 border-2 border-slate-200 bg-white w-full mt-1"
              >
                <option v-for="t in timeOptions" :key="t" :value="t">
                  {{ formatTime(t) }}
                </option>
              </select>
            </label>
            <label class="w-1/2">
              <div class="text-xs font-bold text-slate-500">
                No classes after
              </div>
              <select
                v-model.number="constraints.latest"
                class="p-1 border-2 border-slate-200 bg-white w-full mt-1"
              >
                <option v-for="t in timeOptions" :key="t" :value="t">
                  {{ formatTime(t) }}
                </option>
              </select>
            </label>
          </div>

          <div class="text-xs font-bold text-slate-500 mt-3">Days off</div>
          <div class="flex gap-1 mt-1">
            <button
              v-for="(day, i) in weekdays"
              :key="day"
              class="flex-1 p-1 text-xs font-bold border-2 cursor-pointer"
              :class="
                constraints.daysOff.includes(i)
                  ? 'bg-red-600 border-red-600 text-white'
                  : 'bg-white border-slate-200 text-slate-600'
              "
              @click="toggleDayOff(i)"
            >
              {{ day }}
            </button>
          </div>

          <label class="flex items-center gap-2 mt-3 text-xs">
            <input v-model="constraints.openOnly" type="checkbox" />
            Only sections with open seats
          </label>
          <label class="flex items-center gap-2 mt-1 text-xs">
            <input v-model="lockPicked" type="checkbox" />
            Keep the sections I picked in the builder
          </label>

          <div class="text-xs font-bold text-slate-500 mt-4 mb-1">
            Preferences (used to rank results)
          </div>
          <div
            v-for="pref in preferenceOptions"
            :key="pref.key"
            class="flex items-center mt-1 text-xs"
          >
            <span class="w-1/2">{{ pref.label }}</span>
            <div class="flex w-1/2 gap-1">
              <button
                v-for="(label, level) in ['Off', 'Low', 'Med', 'High']"
                :key="label"
                class="flex-1 p-1 border-2 font-bold cursor-pointer"
                :class="
                  constraints.weights[pref.key] == level
                    ? 'bg-slate-950 border-slate-950 text-white'
                    : 'bg-white border-slate-200 text-slate-500'
                "
                @click="constraints.weights[pref.key] = level"
              >
                {{ label }}
              </button>
            </div>
          </div>

          <div class="flex items-center gap-2 mb-2 mt-5">
            <span
              class="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center shrink-0"
              >3</span
            >
            <span class="font-bold text-lg">Generate</span>
          </div>
          <button
            v-if="!readyCourses.length && !anyLoading"
            class="w-full p-2 bg-white border-2 border-dashed border-red-600 text-red-600 font-bold cursor-pointer"
            @click="focusCourseInput"
          >
            <font-awesome-icon :icon="['fas', 'arrow-up']" />
            Add at least one course in step 1 first
          </button>
          <div
            v-if="failedCourses.length"
            class="text-xs text-red-600 mb-2"
          >
            <font-awesome-icon :icon="['fas', 'triangle-exclamation']" />
            <b>{{ failedCourses.map((c) => c.id).join(", ") }}</b>
            couldn't be loaded and will be left out. Remove
            {{ failedCourses.length == 1 ? "it" : "them" }} or re-add to retry.
          </div>
          <button
            v-if="readyCourses.length || anyLoading"
            class="w-full p-2 bg-red-600 text-white font-bold cursor-pointer disabled:bg-slate-400"
            :disabled="anyLoading || generating"
            @click="generate"
          >
            <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" />
            {{
              anyLoading
                ? "Loading sections..."
                : generating
                ? "Loading professor ratings..."
                : `Generate Schedules for ${readyCourses.length} course${
                    readyCourses.length == 1 ? "" : "s"
                  }`
            }}
          </button>
          <div
            v-if="generationStale"
            class="text-xs mt-2 p-2 bg-yellow-50 border-2 border-yellow-400 text-yellow-800"
          >
            Your courses or settings changed since these schedules were
            generated. Hit <b>Generate</b> again to update them.
          </div>
          <div v-if="generation" class="text-xs mt-2 text-slate-600">
            <div v-if="generation.blocked.length" class="text-red-600">
              No section of
              <b>{{ generation.blocked.join(", ") }}</b> fits your constraints.
              Try loosening them.
            </div>
            <div v-else-if="!generation.schedules.length" class="text-red-600">
              These courses can't be scheduled together without a time
              conflict under your constraints.
            </div>
            <div v-else>
              Found
              <b>{{ generation.explored.toLocaleString() }}</b>
              valid schedule{{ generation.explored == 1 ? "" : "s" }}<span
                v-if="generation.truncated"
                >+ (search capped)</span
              >, showing the best
              <b>{{ generation.schedules.length }}</b
              >.
            </div>
          </div>
        </div>
      </div>

      <!-- Right panel: calendar -->
      <div class="flex-1 min-w-0">
        <!-- Generated schedule navigator -->
        <div
          v-if="mode == 'generate' && currentGenerated"
          class="flex flex-wrap items-center gap-3 mb-3 p-3 border-2 border-slate-200 bg-slate-50"
        >
          <button
            class="px-3 py-1 bg-slate-200 font-bold cursor-pointer disabled:opacity-40"
            :disabled="generatedIndex == 0"
            @click="generatedIndex--"
          >
            <font-awesome-icon :icon="['fas', 'chevron-left']" />
          </button>
          <div class="font-bold">
            Schedule {{ generatedIndex + 1 }}
            <span class="text-slate-500 font-medium"
              >of {{ generation.schedules.length }}</span
            >
          </div>
          <button
            class="px-3 py-1 bg-slate-200 font-bold cursor-pointer disabled:opacity-40"
            :disabled="generatedIndex >= generation.schedules.length - 1"
            @click="generatedIndex++"
          >
            <font-awesome-icon :icon="['fas', 'chevron-right']" />
          </button>
          <button
            class="ml-auto px-3 py-1 bg-red-600 text-white font-bold text-sm cursor-pointer disabled:bg-slate-400"
            :disabled="generationStale"
            :title="generationStale ? 'Regenerate first: these results are out of date' : ''"
            @click="applyGenerated"
          >
            Use this schedule
          </button>
        </div>

        <!-- Summary -->
        <div class="flex flex-wrap gap-2 mb-3 text-xs">
          <span class="px-2 py-1 bg-slate-200 rounded font-bold">
            {{ displayCredits }} credits
          </span>
          <span class="px-2 py-1 bg-slate-200 rounded font-bold">
            {{ displayStats.days }} day{{ displayStats.days == 1 ? "" : "s" }}
            on campus
          </span>
          <span
            v-if="displayStats.days"
            class="px-2 py-1 bg-slate-200 rounded font-bold"
          >
            {{ formatTime(displayStats.earliest) }} &ndash;
            {{ formatTime(displayStats.latest) }}
          </span>
          <span class="px-2 py-1 bg-slate-200 rounded font-bold">
            {{ (displayStats.gapMinutes / 60).toFixed(1) }} hrs between
            classes/week
          </span>
          <span
            v-if="displayStats.avgRating"
            class="px-2 py-1 rounded font-bold"
            :class="ratingColor(displayStats.avgRating)"
          >
            <font-awesome-icon :icon="['fas', 'star']" />
            {{ displayStats.avgRating.toFixed(2) }} avg professor
          </span>
          <span
            v-if="mode == 'build' && conflicts.size"
            class="px-2 py-1 bg-red-600 text-white rounded font-bold"
          >
            <font-awesome-icon :icon="['fas', 'triangle-exclamation']" />
            Time conflict
          </span>
          <button
            v-if="displaySections.length"
            class="ml-auto px-2 py-1 bg-slate-950 text-slate-100 rounded font-bold cursor-pointer"
            @click="copySections"
          >
            <font-awesome-icon :icon="['fas', copied ? 'check' : 'copy']" />
            {{ copied ? "Copied!" : "Copy sections" }}
          </button>
        </div>

        <!-- Weekly calendar -->
        <div class="overflow-x-auto border-2 border-slate-200">
          <div class="flex min-w-[640px]">
            <div class="w-14 shrink-0 bg-slate-50 border-r border-slate-200">
              <div class="h-8 border-b border-slate-200"></div>
              <div class="relative" :style="{ height: calendarHeight + 'px' }">
                <div
                  v-for="hour in hours"
                  :key="hour"
                  class="absolute right-1 text-[10px] text-slate-400 -translate-y-1/2"
                  :style="{ top: (hour * 60 - calStart) * pxPerMin + 'px' }"
                >
                  {{ formatHour(hour) }}
                </div>
              </div>
            </div>

            <div
              v-for="day in calendarDays"
              :key="day"
              class="flex-1 border-r border-slate-200 last:border-r-0"
            >
              <div
                class="h-8 flex items-center justify-center text-sm font-bold border-b border-slate-200 bg-slate-50"
              >
                {{ dayNames[day].slice(0, 3) }}
              </div>
              <div
                class="relative"
                :style="{ height: calendarHeight + 'px' }"
                :class="
                  mode == 'generate' && constraints.daysOff.includes(day)
                    ? 'bg-slate-100'
                    : ''
                "
              >
                <div
                  v-for="hour in hours"
                  :key="hour"
                  class="absolute left-0 right-0 border-t border-slate-100"
                  :style="{ top: (hour * 60 - calStart) * pxPerMin + 'px' }"
                ></div>

                <div
                  v-for="block in blocksByDay[day]"
                  :key="block.key"
                  class="absolute rounded px-1 py-0.5 overflow-hidden text-[11px] leading-tight border-l-4"
                  :class="[
                    block.preview ? 'opacity-60 border-dashed' : '',
                    block.conflict ? 'ring-2 ring-red-600' : '',
                  ]"
                  :style="{
                    top: (block.start - calStart) * pxPerMin + 'px',
                    height: (block.end - block.start) * pxPerMin + 'px',
                    left: (block.col / block.cols) * 100 + '%',
                    width: 100 / block.cols + '%',
                    background: colorFor(block.courseId).bg,
                    borderColor: colorFor(block.courseId).border,
                    color: colorFor(block.courseId).text,
                  }"
                  :title="`${block.courseId} ${block.sectionId} ${block.type}\n${formatTime(block.start)}-${formatTime(block.end)} ${block.location}`"
                >
                  <div class="font-bold">
                    {{ block.courseId }}
                    <span class="font-medium">{{ block.sectionId }}</span>
                  </div>
                  <div>
                    {{ formatTime(block.start) }}-{{ formatTime(block.end) }}
                  </div>
                  <div class="opacity-80">
                    {{ block.type }} {{ block.location }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="!displaySections.length"
          class="text-center text-sm text-slate-500 mt-4"
        >
          <span v-if="mode == 'build'"
            >Add a course, then click a section to place it on your
            calendar.</span
          >
          <span v-else
            ><a
              class="font-bold text-red-600 cursor-pointer underline"
              @click="focusCourseInput"
              >Add your courses</a
            >
            on the left, then hit <b>Generate Schedules</b> to see the best
            combinations.</span
          >
        </div>

        <!-- Selected sections list -->
        <div v-if="displaySections.length" class="mt-4">
          <div class="font-bold mb-2">Sections</div>
          <div
            v-for="section in displaySections"
            :key="section.courseId + section.id"
            class="flex items-start text-sm p-2 mb-1 border-l-4 bg-slate-50"
            :style="{ borderColor: colorFor(section.courseId).border }"
          >
            <div class="flex flex-col">
              <div>
                <b>{{ section.courseId }} {{ section.id }}</b>
                <span class="text-slate-500">
                  &middot;
                  {{ section.instructors.join(", ") || "Instructor TBA" }}</span
                >
              </div>
              <div class="text-xs text-slate-500">
                {{ describeSection(section) }}
              </div>
              <div
                v-if="
                  mode == 'generate' &&
                  currentGenerated &&
                  currentGenerated.alternates[section.courseId]?.length
                "
                class="text-xs text-slate-500"
              >
                Same time &amp; professor:
                {{ currentGenerated.alternates[section.courseId].join(", ") }}
              </div>
            </div>
            <span
              class="ml-auto text-xs shrink-0"
              :class="section.open > 0 ? 'text-green-700' : 'text-red-600'"
            >
              {{ section.open }}/{{ section.total }} open
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {
  DAY_NAMES,
  formatTime,
  generateSchedules,
  parseSection,
  scheduleStats,
  sectionsConflict,
} from "~/utils/scheduler";

const STORAGE_KEY = "tortuga-scheduler-202608";

const PALETTE = [
  { bg: "#dbeafe", border: "#2563eb", text: "#1e3a8a" },
  { bg: "#fee2e2", border: "#dc2626", text: "#7f1d1d" },
  { bg: "#dcfce7", border: "#16a34a", text: "#14532d" },
  { bg: "#fef9c3", border: "#ca8a04", text: "#713f12" },
  { bg: "#f3e8ff", border: "#9333ea", text: "#581c87" },
  { bg: "#ccfbf1", border: "#0d9488", text: "#134e4a" },
  { bg: "#ffedd5", border: "#ea580c", text: "#7c2d12" },
  { bg: "#fce7f3", border: "#db2777", text: "#831843" },
  { bg: "#e0e7ff", border: "#4f46e5", text: "#312e81" },
  { bg: "#ecfccb", border: "#65a30d", text: "#365314" },
];

const defaultConstraints = () => ({
  earliest: 8 * 60,
  latest: 22 * 60,
  daysOff: [],
  openOnly: true,
  excluded: {},
  pinned: {},
  weights: {
    compact: 2,
    fewerDays: 1,
    lateStart: 1,
    earlyEnd: 0,
    professors: 1,
  },
});

export default {
  data() {
    return {
      mode: "build",
      newCourse: "",
      addError: "",
      courses: [],
      selected: {},
      expanded: {},
      hovered: null,
      ratings: {},
      constraints: defaultConstraints(),
      lockPicked: false,
      generation: null,
      generatedIndex: 0,
      generating: false,
      ratingRequests: [],
      copied: false,
      pxPerMin: 0.9,
      weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      dayNames: DAY_NAMES,
      preferenceOptions: [
        { key: "compact", label: "Fewer gaps between classes" },
        { key: "fewerDays", label: "Fewer days on campus" },
        { key: "lateStart", label: "Avoid early mornings" },
        { key: "earlyEnd", label: "Avoid evening classes" },
        { key: "professors", label: "Better-rated professors" },
      ],
    };
  },
  computed: {
    timeOptions() {
      const times = [];
      for (let t = 7 * 60; t <= 22 * 60; t += 30) times.push(t);
      return times;
    },
    readyCourses() {
      return this.courses.filter((c) => !c.loading && !c.error);
    },
    anyLoading() {
      return this.courses.some((c) => c.loading);
    },
    failedCourses() {
      return this.courses.filter((c) => !c.loading && c.error);
    },
    // Everything the generator's output depends on, so results can be
    // flagged as out of date when any of it changes
    generationKey() {
      return JSON.stringify({
        courses: this.readyCourses.map((c) => c.id),
        constraints: this.constraints,
        pinned: this.lockPicked ? this.selected : {},
      });
    },
    generationStale() {
      return !!this.generation && this.generation.key != this.generationKey;
    },
    plannedCredits() {
      return this.readyCourses.reduce(
        (sum, c) => sum + (parseInt(c.credits) || 0),
        0
      );
    },
    manualSections() {
      return this.readyCourses
        .map((c) => c.sections.find((s) => s.id == this.selected[c.id]))
        .filter(Boolean);
    },
    currentGenerated() {
      return this.generation?.schedules[this.generatedIndex] || null;
    },
    displaySections() {
      if (this.mode == "generate") return this.currentGenerated?.sections || [];
      return this.manualSections;
    },
    displayCredits() {
      return this.displaySections.reduce((sum, s) => {
        const course = this.courses.find((c) => c.id == s.courseId);
        return sum + (parseInt(course?.credits) || 0);
      }, 0);
    },
    displayStats() {
      return scheduleStats(this.displaySections, this.ratings);
    },
    // Keys "COURSE SECTION" of manually picked sections that overlap another
    conflicts() {
      const set = new Set();
      const list = this.manualSections;
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          if (sectionsConflict(list[i], list[j])) {
            set.add(list[i].courseId + list[i].id);
            set.add(list[j].courseId + list[j].id);
          }
        }
      }
      return set;
    },
    calendarSections() {
      const sections = this.displaySections.map((s) => ({
        section: s,
        preview: false,
      }));
      if (
        this.mode == "build" &&
        this.hovered &&
        this.selected[this.hovered.courseId] != this.hovered.id
      ) {
        sections.push({ section: this.hovered, preview: true });
      }
      return sections;
    },
    calendarDays() {
      const days = [0, 1, 2, 3, 4];
      for (const weekend of [5, 6]) {
        if (
          this.calendarSections.some(({ section }) =>
            section.meetings.some((m) => m.day == weekend)
          )
        )
          days.push(weekend);
      }
      return days;
    },
    calStart() {
      let start = 8 * 60;
      for (const { section } of this.calendarSections)
        for (const m of section.meetings) start = Math.min(start, m.start);
      return Math.floor(start / 60) * 60;
    },
    calEnd() {
      let end = 18 * 60;
      for (const { section } of this.calendarSections)
        for (const m of section.meetings) end = Math.max(end, m.end);
      return Math.ceil(end / 60) * 60;
    },
    calendarHeight() {
      return (this.calEnd - this.calStart) * this.pxPerMin;
    },
    hours() {
      const hours = [];
      for (let h = this.calStart / 60; h < this.calEnd / 60; h++)
        hours.push(h);
      return hours;
    },
    // Calendar blocks per day, with overlapping blocks laid out side by side
    blocksByDay() {
      const byDay = {};
      for (const day of this.calendarDays) byDay[day] = [];

      for (const { section, preview } of this.calendarSections) {
        section.meetings.forEach((m, i) => {
          if (!byDay[m.day]) return;
          byDay[m.day].push({
            key: `${section.courseId}-${section.id}-${i}-${preview}`,
            courseId: section.courseId,
            sectionId: section.id,
            start: m.start,
            end: m.end,
            type: m.type,
            location: [m.building, m.room].filter(Boolean).join(" "),
            preview,
            conflict:
              !preview &&
              this.mode == "build" &&
              this.conflicts.has(section.courseId + section.id),
          });
        });
      }

      for (const day in byDay) {
        const blocks = byDay[day].sort((a, b) => a.start - b.start);
        // Group transitively-overlapping blocks into clusters, then give each
        // block the first free column within its cluster
        let cluster = [];
        let clusterEnd = -1;
        const flush = () => {
          const colEnds = [];
          for (const b of cluster) {
            let col = colEnds.findIndex((end) => end <= b.start);
            if (col == -1) col = colEnds.length;
            colEnds[col] = b.end;
            b.col = col;
          }
          for (const b of cluster) b.cols = colEnds.length;
        };
        for (const b of blocks) {
          if (b.start >= clusterEnd && cluster.length) {
            flush();
            cluster = [];
          }
          cluster.push(b);
          clusterEnd = Math.max(clusterEnd, b.end);
        }
        if (cluster.length) flush();
      }
      return byDay;
    },
  },
  watch: {
    selected: { deep: true, handler: "save" },
    constraints: { deep: true, handler: "save" },
    lockPicked: "save",
  },
  mounted() {
    document.title = "Tortuga - Scheduler";
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved) {
        this.selected = saved.selected || {};
        this.constraints = { ...defaultConstraints(), ...saved.constraints };
        this.lockPicked = !!saved.lockPicked;
        for (const id of saved.courses || []) this.addCourse(id);
      }
    } catch (e) {
      console.log(e.message);
    }
  },
  methods: {
    formatTime,
    formatHour(hour) {
      const h12 = hour % 12 == 0 ? 12 : hour % 12;
      return `${h12}${hour >= 12 ? "pm" : "am"}`;
    },
    save() {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            courses: this.courses.map((c) => c.id),
            selected: this.selected,
            constraints: this.constraints,
            lockPicked: this.lockPicked,
          })
        );
      } catch (e) {
        console.log(e.message);
      }
    },
    colorFor(courseId) {
      const index = this.courses.findIndex((c) => c.id == courseId);
      return PALETTE[(index < 0 ? 0 : index) % PALETTE.length];
    },
    ratingColor(value) {
      if (value >= 4.5) return "bg-green-600 text-white";
      if (value >= 4) return "bg-green-500 text-white";
      if (value >= 3.5) return "bg-yellow-500 text-white";
      if (value >= 3) return "bg-orange-400 text-white";
      if (value >= 2.5) return "bg-orange-500 text-white";
      return "bg-red-600 text-white";
    },
    describeSection(section) {
      const groups = {};
      for (const m of section.meetings) {
        const key = `${m.type}|${m.start}|${m.end}|${m.building} ${m.room}`;
        if (!groups[key]) groups[key] = { ...m, days: [] };
        groups[key].days.push(["M", "Tu", "W", "Th", "F", "Sa", "Su"][m.day]);
      }
      const parts = Object.values(groups).map(
        (g) =>
          `${g.type}: ${g.days.join("")} ${formatTime(g.start)}-${formatTime(
            g.end
          )}${g.building ? " " + g.building + " " + g.room : ""}`
      );
      return [...parts, ...section.unscheduled].join(" · ") || "Time TBA";
    },
    async addCourse(id) {
      const courseId = (id || this.newCourse).replace(/\s+/g, "").toUpperCase();
      this.addError = "";
      if (!/^[A-Z]{4}\d{3}[A-Z]?$/.test(courseId)) {
        this.addError = "Enter a course code like CMSC216.";
        return;
      }
      if (this.courses.some((c) => c.id == courseId)) {
        this.addError = `${courseId} is already in your plan.`;
        return;
      }
      this.newCourse = "";

      this.courses.push({
        id: courseId,
        title: "",
        credits: "0",
        sections: [],
        loading: true,
        error: "",
      });
      this.save();
      const course = this.courses[this.courses.length - 1];

      try {
        const { data } = await axios.get(
          `/api/scraper/get-course-info?course=${courseId}`
        );
        const match = Array.isArray(data)
          ? data.find((c) => c.id == courseId)
          : null;
        if (!match || !match.sections.length) {
          course.error = "Not offered this semester";
          return;
        }
        course.title = match.title;
        course.credits = match.credits;
        course.sections = match.sections.map((s) =>
          parseSection(courseId, s)
        );
        // Drop a saved pick if the section no longer exists
        if (
          this.selected[courseId] &&
          !course.sections.some((s) => s.id == this.selected[courseId])
        ) {
          delete this.selected[courseId];
        }
        this.fetchRatings(course.sections);
      } catch (e) {
        course.error = "Could not load sections";
      } finally {
        course.loading = false;
      }
    },
    fetchRatings(sections) {
      const request = this.loadRatings(sections);
      this.ratingRequests.push(request);
      return request;
    },
    async loadRatings(sections) {
      const names = new Set();
      for (const s of sections)
        for (const name of s.instructors)
          if (name && name != "Instructor: TBA" && !(name in this.ratings))
            names.add(name);

      await Promise.all(
        [...names].map(async (name) => {
          this.ratings[name] = null;
          try {
            const { data } = await axios.get(
              `https://planetterp.com/api/v1/professor?name=${encodeURIComponent(
                name
              )}`
            );
            if (data && data.average_rating)
              this.ratings[name] = data.average_rating;
          } catch (e) {
            // Professor not on PlanetTerp
          }
        })
      );
    },
    removeCourse(id) {
      this.courses = this.courses.filter((c) => c.id != id);
      delete this.selected[id];
      delete this.expanded[id];
      delete this.constraints.excluded[id];
      this.generation = null;
      this.save();
    },
    clearAll() {
      this.courses = [];
      this.selected = {};
      this.expanded = {};
      this.generation = null;
      this.constraints = defaultConstraints();
      this.lockPicked = false;
      this.save();
    },
    focusCourseInput() {
      const input = this.$refs.courseInput;
      input.scrollIntoView({ behavior: "smooth", block: "center" });
      input.focus();
    },
    toggleExpanded(id) {
      this.expanded[id] = !this.expanded[id];
    },
    selectSection(courseId, sectionId) {
      if (this.selected[courseId] == sectionId) delete this.selected[courseId];
      else this.selected[courseId] = sectionId;
      this.hovered = null;
    },
    isExcluded(courseId, sectionId) {
      return (this.constraints.excluded[courseId] || []).includes(sectionId);
    },
    toggleExcluded(courseId, sectionId) {
      const list = this.constraints.excluded[courseId] || [];
      this.constraints.excluded[courseId] = list.includes(sectionId)
        ? list.filter((s) => s != sectionId)
        : [...list, sectionId];
    },
    toggleDayOff(day) {
      const days = this.constraints.daysOff;
      this.constraints.daysOff = days.includes(day)
        ? days.filter((d) => d != day)
        : [...days, day];
    },
    async generate() {
      if (this.constraints.weights.professors) {
        this.generating = true;
        try {
          await Promise.all(this.ratingRequests);
        } finally {
          this.generating = false;
        }
      }
      const key = this.generationKey;
      const constraints = {
        ...this.constraints,
        pinned: this.lockPicked ? { ...this.selected } : {},
      };
      // Plain copies so the generator doesn't walk Vue proxies
      const courses = JSON.parse(
        JSON.stringify(
          this.readyCourses.map((c) => ({ id: c.id, sections: c.sections }))
        )
      );
      this.generation = generateSchedules(
        courses,
        JSON.parse(JSON.stringify(constraints)),
        { ...this.ratings }
      );
      this.generation.key = key;
      this.generatedIndex = 0;
    },
    applyGenerated() {
      if (this.generationStale) return;
      const selected = { ...this.selected };
      for (const s of this.currentGenerated.sections)
        selected[s.courseId] = s.id;
      this.selected = selected;
      this.mode = "build";
    },
    async copySections() {
      const text = this.displaySections
        .map((s) => `${s.courseId} ${s.id}`)
        .join("\n");
      try {
        await navigator.clipboard.writeText(text);
        this.copied = true;
        setTimeout(() => (this.copied = false), 1500);
      } catch (e) {
        console.log(e.message);
      }
    },
  },
};
</script>
