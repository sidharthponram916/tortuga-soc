import User from "../../models/user.model";
import sendEmail from "../send-email";
import axios from "axios";

interface Section {
  id: string;
  open: number;
}

const html = (name: string, id: string, section_id: string) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
    <title>Hello World</title>
  </head>
  <body
    style="
      text-align: center;
      background-color: #f0b942;
      color: rgb(59, 59, 59);
      font-family: Roboto, sans-serif;
    "
  >
    <div
      style="
        padding: 8px;
        margin: 8px auto;
        width: 50%;
        background-color: #790c0c;
        color: #ececec;
        text-align: center;
      "
    >
      <img
        src="https://static-00.iconduck.com/assets.00/turtle-emoji-1024x817-mtty96vf.png"
        style="
          display: block;
          margin: auto;
          width: 10rem;
          padding-top: 5rem;
          padding-bottom: 1rem;
        "
      />
      <div style="font-weight: bold; font-size: 1.875rem">
        Section Closed Notification
      </div>
      <div
        style="
          font-weight: 500;
          font-size: 0.85rem;
          padding: 5px;
          width: 83.3333%;
          margin: auto;
          text-align: center;
        "
      >
        <b>${id} - ${name} Section ${section_id}</b> has just closed. We
        transferred the course to Section Slingshot so it can detect any
        openings.
      </div>
      <div style="padding: 30px">
        <a
          href="https://tortugasoc.com/my-tools/slingshot"
          style="
            padding: 10px;
            margin: 100px;
            font-weight: bold;
            border-radius: 5px;
            color: white;
          "
        >
          Go to Slingshot
        </a>
      </div>
    </div>
  </body>
</html>
`;
};

const watchlistUpdates = async () => {
  try {
    const users = await User.find();
    for (let user of users) {
      let toDeleteIndexes = [];
      console.log(`COURSE WATCHER: Cron running for user ${user.username}`);

      if (!user.saved_courses) continue;

      if (user.saved_courses.length > 0) {
        for (let course of user.saved_courses) {
          let updated = false;

          let { data } = await axios.get(
            `/api/scraper/get-course-info?course=${course.course_id}`
          );

          let c = data.find((c: any) => course.course_id == c.id);

          if (!c || !c.sections) continue;

          let c_info = c.sections.find((section: Section) => {
            return section.id == course.section.id;
          });

          if (c_info.open == 0) {
            console.log(course.course_id + " just fell into case 1");

            if (!user.slingshot_courses) continue;

            course.section.open = c_info.open;

            user.saved_courses = user.saved_courses.filter(
              (c) =>
                !(
                  c.course_id === course.course_id &&
                  c.section.id === course.section.id
                )
            );

            course["status"] = "Active";
            user.slingshot_courses.unshift(course);

            updated = true;

            user.markModified("saved_courses");
            user.markModified("slingshot_courses");

            await sendEmail(
              `${user.terpmail}`,
              `Course Closed! Hey, ${user.username}! ${course.course_id} - ${
                course.course_name
              } Section ${course.section.id.toUpperCase()} has closed.`,
              html(course.course_name, course.course_id, course.section.id)
            );

            console.log(
              `COURSE WATCHER: ${
                course.course_id
              } - ${course.course_name.toUpperCase()} - ${
                course.section.id
              } just filled up! Transferred to SECTION SLINGSHOT!`
            );
          } else if (course.section.open != c_info.open) {
            console.log(course.course_id + " just fell into case 2");

            course.section.open = c_info.open;
            updated = true;

            user.markModified("saved_courses");
            console.log(
              `COURSE WATCHER: Change detected for ${
                course.course_id
              } - ${course.course_name.toUpperCase()} - ${
                course.section.id
              }. Updating database...`
            );
          } else {
            console.log(
              `COURSE WATCHER: Nothing to be updated for course: ${
                course.course_id
              } - ${course.course_name.toUpperCase()} - ${course.section.id}`
            );
          }

          if (updated) {
            await user.save();
            console.log(
              `COURSE WATCHER: Database updated for user - ${user.username}`
            );
          }
        }
      } else {
        console.log(
          `COURSE WATCHER: Nothing to be updated for user - ${user.username}`
        );
      }
    }
  } catch (e: any) {
    console.log(e.message);
  }
};

export default watchlistUpdates;
