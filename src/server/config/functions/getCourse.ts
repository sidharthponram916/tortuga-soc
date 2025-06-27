import cheerio from "cheerio";
import axios from "axios";

export const getCourseInfo = async (courseId: string) => {
  try {
    const { data } = await axios.get(
      `https://app.testudo.umd.edu/soc/search?courseId=${courseId}&sectionId=&termId=202508&_openSectionsOnly=on&creditCompare=&credits=&courseLevelFilter=ALL&instructor=&_facetoface=on&_blended=on&_online=on&courseStartCompare=&courseStartHour=&courseStartMin=&courseStartAM=&courseEndHour=&courseEndMin=&courseEndAM=&teachingCenter=ALL&_classDay1=on&_classDay2=on&_classDay3=on&_classDay4=on&_classDay5=on`
    );

    const $ = cheerio.load(data);

    const courses = $(".course");
    const outputs: any = [];
    const instructorSet = new Set();

    courses.each((_, courseEl) => {
      const course = $(courseEl);

      course.find(".section").each((_, sectionEl) => {
        $(sectionEl)
          .find(".section-instructor")
          .each((_, instructorEl) => {
            const name = $(instructorEl).text().trim();
            if (name) instructorSet.add(name);
          });
      });
    });

    courses.each((_, courseEl) => {
      const course = $(courseEl);

      const courseId = course.find(".course-id").text().trim() || "N/A";
      const credits = course.find(".course-min-credits").text().trim() || "N/A";
      const title = course.find(".course-title").text().trim() || "N/A";

      const information: any = [];
      course.find(".approved-course-text").each((_, infoEl) => {
        information.push($(infoEl).text().trim() || "N/A");
      });

      const genEdFlags: any = [];
      course.find(".course-subcategory").each((_, flagEl) => {
        genEdFlags.push($(flagEl).text().trim() || "N/A");
      });

      const notesText =
        course.find(".course-text").first().text().trim() || "N/A";

      const sections: any = [];

      course.find(".section").each((_, sectionEl) => {
        const section = $(sectionEl);
        const sectionId = section.find(".section-id").text().trim() || "N/A";

        const openSeatsRaw = section
          .find(".open-seats-count")
          .first()
          .text()
          .trim();
        const openSeats = openSeatsRaw !== "" ? parseInt(openSeatsRaw) : null;

        const totalSeats =
          parseInt(section.find(".total-seats-count").text().trim()) || null;

        const instructors: any = [];
        section.find(".section-instructor").each((_, i) => {
          instructors.push($(i).text().trim() || "N/A");
        });

        const daysInfo: any = [];
        section.find(".class-days-container .row").each((_, row) => {
          const r = $(row);
          daysInfo.push({
            days: r.find(".section-days").text().trim() || "N/A",
            start_time: r.find(".class-start-time").text().trim() || "N/A",
            end_time: r.find(".class-end-time").text().trim() || "N/A",
            building: r.find(".building-code").text().trim() || "N/A",
            room: r.find(".class-room").text().trim() || "N/A",
            message: r.find(".class-message").text().trim() || "N/A",
            class_type: r.find(".class-type").text().trim() || "Lecture",
          });
        });

        sections.push({
          id: sectionId,
          instructors,
          open: openSeats,
          total: totalSeats,
          days_info: daysInfo,
        });
      });

      outputs.push({
        id: courseId,
        flags: genEdFlags,
        title,
        information,
        notes: notesText,
        credits,
        sections,
      });
    });

    return outputs;
  } catch (error) {
    return { message: "Failed to retrieve page." };
  }
};
