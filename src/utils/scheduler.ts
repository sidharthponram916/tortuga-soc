// Shared helpers for the semester scheduler (manual builder + auto-generator).
// Course data comes from /api/scraper/get-course-info, so sections look like:
//   { id, instructors: string[], open, total, waitlist,
//     days_info: [{ days: "TuTh", start_time: "9:30am", end_time: "10:45am", ... }] }

export const DAYS = ["M", "Tu", "W", "Th", "F", "Sa", "Su"];
export const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export interface Meeting {
  day: number; // index into DAYS
  start: number; // minutes since midnight
  end: number;
  type: string;
  building: string;
  room: string;
}

export interface ParsedSection {
  courseId: string;
  id: string;
  instructors: string[];
  open: number;
  total: number;
  waitlist: number;
  meetings: Meeting[];
  // Online / TBA meetings that have no fixed slot on the calendar
  unscheduled: string[];
}

export interface Constraints {
  earliest: number; // minutes, no class may start before this
  latest: number; // minutes, no class may end after this
  daysOff: number[]; // day indices that must stay free
  openOnly: boolean;
  excluded: Record<string, string[]>; // courseId -> section ids never to use
  pinned: Record<string, string>; // courseId -> section id that must be used
  // Preference weights, 0 (don't care) .. 3 (very important)
  weights: {
    compact: number; // minimise dead time between classes
    fewerDays: number; // fewer days on campus
    lateStart: number; // avoid early mornings
    earlyEnd: number; // avoid late evenings
    professors: number; // higher PlanetTerp ratings
  };
}

export interface GeneratedSchedule {
  sections: ParsedSection[]; // one per course
  // Equivalent sections (same times + instructor) for each course, so the
  // user can see their backups when registering
  alternates: Record<string, string[]>;
  score: number;
  stats: {
    days: number;
    gapMinutes: number;
    earliest: number;
    latest: number;
    avgRating: number | null;
  };
}

export interface GenerateResult {
  schedules: GeneratedSchedule[];
  explored: number;
  truncated: boolean;
  // Courses with no section left after applying constraints
  blocked: string[];
}

export const parseTime = (t: string): number | null => {
  const m = /^(\d{1,2}):(\d{2})\s*(am|pm)$/i.exec((t || "").trim());
  if (!m) return null;
  let h = parseInt(m[1]) % 12;
  if (m[3].toLowerCase() === "pm") h += 12;
  return h * 60 + parseInt(m[2]);
};

export const formatTime = (mins: number): string => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m.toString().padStart(2, "0")}${suffix}`;
};

export const parseDays = (days: string): number[] =>
  (days.match(/Tu|Th|Sa|Su|M|W|F/g) || []).map((d) => DAYS.indexOf(d));

export const parseSection = (courseId: string, raw: any): ParsedSection => {
  const meetings: Meeting[] = [];
  const unscheduled: string[] = [];

  for (const info of raw.days_info || []) {
    const start = parseTime(info.start_time);
    const end = parseTime(info.end_time);
    const days = info.days && info.days !== "N/A" ? parseDays(info.days) : [];

    if (start === null || end === null || days.length === 0) {
      const label = [info.class_type, info.message]
        .filter((s) => s && s !== "N/A")
        .join(" - ");
      unscheduled.push(label || "TBA");
      continue;
    }

    for (const day of days) {
      meetings.push({
        day,
        start,
        end,
        type: info.class_type || "Lecture",
        building: info.building !== "N/A" ? info.building : "",
        room: info.room !== "N/A" ? info.room : "",
      });
    }
  }

  return {
    courseId,
    id: raw.id,
    instructors: (raw.instructors || []).map((i: any) =>
      typeof i === "string" ? i : i.name
    ),
    open: raw.open ?? 0,
    total: raw.total ?? 0,
    waitlist: raw.waitlist ?? 0,
    meetings,
    unscheduled,
  };
};

export const meetingsOverlap = (a: Meeting, b: Meeting) =>
  a.day === b.day && a.start < b.end && b.start < a.end;

export const sectionsConflict = (a: ParsedSection, b: ParsedSection) =>
  a.meetings.some((ma) => b.meetings.some((mb) => meetingsOverlap(ma, mb)));

const signature = (s: ParsedSection) =>
  s.meetings
    .map((m) => `${m.day}-${m.start}-${m.end}`)
    .sort()
    .join("|") +
  "#" +
  [...s.instructors].sort().join(",");

const avgRating = (
  s: ParsedSection,
  ratings: Record<string, number | null>
): number | null => {
  const known = s.instructors
    .map((i) => ratings[i])
    .filter((r): r is number => typeof r === "number");
  return known.length ? known.reduce((a, b) => a + b, 0) / known.length : null;
};

// Weekly statistics for a set of sections, used both for scoring generated
// schedules and for the summary in the manual builder.
export const scheduleStats = (
  sections: ParsedSection[],
  ratings: Record<string, number | null> = {}
) => {
  const byDay: Meeting[][] = DAYS.map(() => []);
  for (const s of sections) for (const m of s.meetings) byDay[m.day].push(m);

  let days = 0;
  let gapMinutes = 0;
  let earliest = Infinity;
  let latest = -Infinity;
  let earlyPenalty = 0;
  let latePenalty = 0;

  for (const meetings of byDay) {
    if (!meetings.length) continue;
    days++;
    meetings.sort((a, b) => a.start - b.start);
    earliest = Math.min(earliest, meetings[0].start);
    // Penalise each day by how far its first class is before 10am and its
    // last class runs past 5pm, so one 8am is better than three.
    earlyPenalty += Math.max(0, 600 - meetings[0].start);
    let dayEnd = meetings[0].end;
    for (let i = 1; i < meetings.length; i++) {
      // A 10-15 minute passing period is not dead time
      const gap = meetings[i].start - dayEnd;
      if (gap > 15) gapMinutes += gap;
      dayEnd = Math.max(dayEnd, meetings[i].end);
    }
    latest = Math.max(latest, dayEnd);
    latePenalty += Math.max(0, dayEnd - 17 * 60);
  }

  const ratingValues = sections
    .map((s) => avgRating(s, ratings))
    .filter((r): r is number => r !== null);

  return {
    days,
    gapMinutes,
    earliest: isFinite(earliest) ? earliest : 0,
    latest: isFinite(latest) ? latest : 0,
    earlyPenalty,
    latePenalty,
    avgRating: ratingValues.length
      ? ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length
      : null,
  };
};

const scoreSchedule = (
  sections: ParsedSection[],
  constraints: Constraints,
  ratings: Record<string, number | null>
) => {
  const stats = scheduleStats(sections, ratings);
  const w = constraints.weights;

  // Lower is better. Each term is normalised to roughly "points per hour"
  // so the weights are comparable.
  let cost =
    w.compact * (stats.gapMinutes / 60) +
    w.fewerDays * stats.days * 3 +
    w.lateStart * (stats.earlyPenalty / 60) +
    w.earlyEnd * (stats.latePenalty / 60);

  if (w.professors) {
    for (const s of sections) {
      const r = avgRating(s, ratings);
      // Unrated professors are treated as average (3/5)
      cost += w.professors * 2 * (5 - (r ?? 3));
    }
  }

  // Small tie-breaker in favour of sections with open seats
  for (const s of sections) if (s.open <= 0) cost += 5;

  return { cost, stats };
};

/**
 * Generate conflict-free schedules picking exactly one section per course.
 *
 * Algorithm:
 *  1. Filter each course's sections by the hard constraints (time window,
 *     days off, open seats, exclusions, pins).
 *  2. Collapse sections with identical meeting times + instructor into a
 *     single candidate (their schedules are interchangeable), which shrinks
 *     the search space dramatically for large lecture courses.
 *  3. Depth-first backtracking, branching on the most constrained course
 *     first (fewest candidates), pruning as soon as a pick conflicts with
 *     what has already been placed.
 *  4. Score every complete schedule with the soft preferences and keep the
 *     best `limit` of them.
 */
export const generateSchedules = (
  courses: { id: string; sections: ParsedSection[] }[],
  constraints: Constraints,
  ratings: Record<string, number | null> = {},
  { limit = 100, maxExplored = 250000 } = {}
): GenerateResult => {
  const blocked: string[] = [];

  const candidates = courses.map((course) => {
    const pinned = constraints.pinned[course.id];
    const excluded = new Set(constraints.excluded[course.id] || []);

    const viable = course.sections.filter((s) => {
      if (pinned) return s.id === pinned;
      if (excluded.has(s.id)) return false;
      if (constraints.openOnly && s.open <= 0) return false;
      return s.meetings.every(
        (m) =>
          m.start >= constraints.earliest &&
          m.end <= constraints.latest &&
          !constraints.daysOff.includes(m.day)
      );
    });

    const groups = new Map<string, ParsedSection[]>();
    for (const s of viable) {
      const key = signature(s);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(s);
    }

    // Prefer the section with the most open seats as the representative
    const reps = [...groups.values()].map((group) => {
      const sorted = [...group].sort((a, b) => b.open - a.open);
      return { rep: sorted[0], alternates: sorted.slice(1).map((s) => s.id) };
    });

    if (!reps.length) blocked.push(course.id);
    return { id: course.id, reps };
  });

  if (blocked.length || !courses.length) {
    return { schedules: [], explored: 0, truncated: false, blocked };
  }

  candidates.sort((a, b) => a.reps.length - b.reps.length);

  const results: GeneratedSchedule[] = [];
  let worstKept = Infinity;
  let explored = 0;
  let truncated = false;

  const chosen: { rep: ParsedSection; alternates: string[] }[] = [];

  const keep = () => {
    const sections = chosen.map((c) => c.rep);
    const { cost, stats } = scoreSchedule(sections, constraints, ratings);
    if (results.length >= limit && cost >= worstKept) return;

    const alternates: Record<string, string[]> = {};
    for (const c of chosen) alternates[c.rep.courseId] = c.alternates;

    results.push({
      sections: [...sections],
      alternates,
      score: cost,
      stats: {
        days: stats.days,
        gapMinutes: stats.gapMinutes,
        earliest: stats.earliest,
        latest: stats.latest,
        avgRating: stats.avgRating,
      },
    });

    if (results.length > limit * 2) {
      results.sort((a, b) => a.score - b.score);
      results.length = limit;
      worstKept = results[limit - 1].score;
    }
  };

  const search = (depth: number) => {
    if (truncated) return;
    if (depth === candidates.length) {
      explored++;
      if (explored >= maxExplored) truncated = true;
      keep();
      return;
    }
    for (const option of candidates[depth].reps) {
      if (chosen.some((c) => sectionsConflict(c.rep, option.rep))) continue;
      chosen.push(option);
      search(depth + 1);
      chosen.pop();
      if (truncated) return;
    }
  };

  search(0);

  results.sort((a, b) => a.score - b.score);
  if (results.length > limit) results.length = limit;

  // Present sections in the order the user added the courses
  const order = courses.map((c) => c.id);
  for (const r of results) {
    r.sections.sort(
      (a, b) => order.indexOf(a.courseId) - order.indexOf(b.courseId)
    );
  }

  return { schedules: results, explored, truncated, blocked };
};
