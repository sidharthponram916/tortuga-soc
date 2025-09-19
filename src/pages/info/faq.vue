<template>
  <div class="p-8 w-1/2 m-auto">
    <div class="overflow-y-auto">
      <div class="text-3xl font-bold text-slate-700 text-center">
        Frequently Asked Questions
      </div>
      <div class="text-center">Last Updated: 04.07.25</div>

      <div class="mt-2">
        <div v-for="set in faq" :key="set.question">
          <div class="border-b-2 border-slate-200 pt-5 pb-5">
            <div class="font-bold text-2xl text-slate-700 mb-1">
              {{ set.question }}
            </div>
            <div class="mt-3 font-medium text-slate-500">{{ set.answer }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      faq: [
        {
          question: "What is Section Slingshot?",
          answer:
            "Section Slingshot is a service that can notify you of any course openings from courses that were full. You can use this service through browsing the course catalog and bookmarking an overflowed course, or through course watcher rollover (more on the next question).",
        },
        {
          question: "What is Course Watcher?",
          answer:
            "Course Watcher is nothing more than a simple bookmarking system for desired class sections that you want, but better. It notifies you if your desired sections ever fill up, enabling you to adjust your schedule for new sections fast before your registration date. Once a class fills up through your Course Watcher list, it would automatically be added to your Section Slingshot list.",
        },
        {
          question:
            "What is the point of Section Slingshot if a waitlist system exists?",
          answer:
            "While UMD’s system allows students to join a course waitlist, there’s often a hidden window—between a course closing and the waitlist activating—where seats briefly open up and go unnoticed. Section Slingshot is designed to catch those fleeting opportunities and notify students instantly, giving them a real shot at registering. \n This is especially powerful during the add/drop period, when students frequently shuffle their schedules and seats open up unexpectedly. In some cases, courses don’t offer a waitlist at all or students aren’t eligible to join it—making Section Slingshot the only way to stay informed and act fast.",
        },
        {
          question: "Is the data from Tortuga SOC accurate?",
          answer:
            "Yes, we pull data directly from the UMD Schedule of Classes page, delivered to you in a streamlined and clean interface.",
        },
        {
          question: "Why isn't Tortuga open source?",
          answer:
            "Tortuga isn’t open source because I want to protect the platform’s integrity and avoid low-effort clones. Making the codebase public could lead to copycat sites that dilute the experience and trust I’ve worked to build. While the source code isn’t public, I’m always open to feedback, feature suggestions, and collaboration — feel free to reach out!",
        },
        {
          question:
            "If it's not open source, how can I trust that Tortuga is secure?",
          answer:
            "Even though Tortuga is closed source, security and transparency are top priorities. Read more about this in our privacy policy.",
        },
        {
          question: "When will the rest of the features be finished?",
          answer:
            "Ideally the rest of the website will be finished by Spring 2026, including Degree Planner and Schedule Builder.",
        },
        {
          question: "How can I be able to work on Tortuga SOC as a developer?",
          answer:
            "We have started an organization called TerpLabs that works on apps to improve UMD Student Life.",
        },
      ],
    };
  },
};
</script>
