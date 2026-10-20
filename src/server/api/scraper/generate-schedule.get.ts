import { getCourseInfo } from "~/server/config/functions/getCourse";
import {
  generateSchedules,
  parseSection,
  parseTime,
  DAYS,
} from "~/utils/scheduler";

// GET /api/scraper/generate-schedule?courses=CMSC250,MATH240,CMSC216
//   optional: earliest=9:00am  latest=5:00pm  daysOff=F,M  openOnly=false
//             limit=10
// Returns conflict-free schedules (one section per course), best first.

// Each course is a separate Testudo request, so keep this bounded
const MAX_COURSES = 10;

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const ids = String(query.courses || "")
      .split(",")
      .map((c) => c.trim().toUpperCase())
      .filter(Boolean);

    if (!ids.length) {
      return { message: "Provide courses, e.g. ?courses=CMSC216,MATH240" };
    }
    if (ids.length > MAX_COURSES) {
      return { message: `Provide at most ${MAX_COURSES} courses.` };
    }
    if (ids.some((id) => !/^[A-Z]{4}\d{3}[A-Z]?$/.test(id))) {
      return { message: "Course codes look like CMSC216." };
    }

    const courses = await Promise.all(
      ids.map(async (id) => {
        const data = await getCourseInfo(id);
        const match = Array.isArray(data)
          ? data.find((c: any) => c.id === id)
          : null;
        return {
          id,
          sections: match
            ? match.sections.map((s: any) => parseSection(id, s))
            : [],
        };
      })
    );

    const result = generateSchedules(
      courses,
      {
        earliest: parseTime(String(query.earliest || "")) ?? 0,
        latest: parseTime(String(query.latest || "")) ?? 24 * 60,
        daysOff: String(query.daysOff || "")
          .split(",")
          .map((d) => DAYS.indexOf(d.trim()))
          .filter((d) => d >= 0),
        openOnly: query.openOnly !== "false",
        excluded: {},
        pinned: {},
        weights: {
          compact: 2,
          fewerDays: 1,
          lateStart: 1,
          earlyEnd: 0,
          professors: 0,
        },
      },
      {},
      { limit: Math.min(parseInt(String(query.limit)) || 10, 100) }
    );

    return result;
  } catch (e) {
    return { message: "Failed to generate schedules." };
  }
});
