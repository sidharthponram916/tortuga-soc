import cron from "node-cron";
import User from "../models/user.model";
import axios from "axios";

interface Section {
  id: string;
  open: boolean;
}

const watchlistUpdates = async () => {
  cron.schedule("*/5 * * * *", async () => {
    try {
      const users = await User.find();
      for (let user of users) {
        console.log(`Cron running for user: ${user.terpmail}`);

        let updated = false;

        if (!user.saved_courses) return;

        if (user.saved_courses.length > 0) {
          for (let course of user.saved_courses) {
            let { data } = await axios.get(
              `https://schedule-of-classes-api.vercel.app/api/get-courses?name=${course.course_id}`
            );

            let c = data.find((c: any) => course.course_id == c.id);

            if (!c || !c.sections) return;

            let c_info = c.sections.find((section: Section) => {
              return section.id == course.section.id;
            });

            if (course.section.open != c_info.open) {
              course.section.open = c_info.open;
              updated = true;
              user.markModified("saved_courses");

              /* console.log("Open Seats Before: " + course.section.open);
               console.log("Open Seats Now: " + c_info.open); */
            } else {
              console.log(`Nothing to be updated for user: ${user.terpmail}`);
            }
          }

          if (updated) {
            await user.save();
            console.log(`Database updated for user: ${user.terpmail}`);
          }
        } else {
          console.log(`Nothing to be updated for user: ${user.terpmail}`);
        }
      }
    } catch (e: any) {
      console.log(e.message);
    }
  });
};

export default watchlistUpdates;
