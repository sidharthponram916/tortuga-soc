import { getCourseInfo } from "~/server/config/functions/getCourse";
import User from "../../models/user.model";
import sendEmail from "../send-email";

interface Section {
  id: string;
  open: boolean;
}

const html = (name: string, id: string, section: string) => {
  return ` <!DOCTYPE html>
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
        src="https://w7.pngwing.com/pngs/730/52/png-transparent-cute-turtle-thumbnail.png"
        style="
          display: block;
          margin: auto;
          width: 10rem;
          padding-top: 5rem;
          padding-bottom: 1rem;
        "
      />
      <div style="font-weight: bold; font-size: 1.875rem">
        Section Open Notification
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
        <b>${id.toUpperCase()} - ${name} Section ${section}</b> has just opened. Linked
        below is the Testudo registration portal, register quick!
      </div>
      <div style="padding: 30px">
        <a
          href="https://app.testudo.umd.edu/#/main/dropAdd?null&termId=202508"
          style="
            padding: 10px;
            margin: 100px;
            font-weight: bold;
            border-radius: 5px;
            color: white;
          "
        >
          Navigate to Testudo
        </a>
      </div>
    </div>
  </body>
</html>`;
};

const slingshotUpdates = async () => {
  try {
    const users = await User.find();
    for (let user of users) {
      console.log(`SECTION SLINGSHOT: Cron running for user: ${user.terpmail}`);

      if (!user.slingshot_courses) continue;

      if (user.slingshot_courses.length > 0) {
        for (let course of user.slingshot_courses) {
          if (course.status != "Active") continue;
          let updated = false;

          let data = await getCourseInfo(course.course_id);

          let c = data.find((c: any) => course.course_id == c.id);

          if (!c || !c.sections) {
            continue;
          }

          let c_info = c.sections.find((section: Section) => {
            return section.id == course.section.id;
          });

          if (c_info.open != 0) {
            course.status = "Inactive (Email Sent Successfully)";

            course.section.open = c_info.open;
            updated = true;
            user.markModified("slingshot_courses");

            await sendEmail(
              `${user.terpmail}`,
              `[SECTION OPENED NOTIFICATION] Hey, ${user.username}! ${
                course.course_id
              } - ${
                course.course_name
              } Section ${course.section.id.toUpperCase()} has just opened!`,
              html(
                `${course.course_name}`,
                `${course.course_id}`,
                `${course.section.id}`
              )
            );
          }

          if (updated) {
            await user.save();
            console.log(
              `SECTION SLINGSHOT: SNIPED A CLOSED COURSE FOR: ${user.username}. EMAIL HAS BEEN SENT TO THEIR ACCOUNT!`
            );
          }
        }
      } else {
        console.log(
          `SECTION SLINGSHOT: Nothing to be updated for user: ${user.username}`
        );
      }
    }
  } catch (e: any) {
    console.log(e.message);
  }
};

export default slingshotUpdates;
