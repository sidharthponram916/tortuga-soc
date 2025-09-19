import { Nitro } from "nitropack";
import mongoose from "mongoose";
import watchlistUpdates from "./config/cron-jobs/watchlist";
import slingshotUpdates from "./config/cron-jobs/slingshot";
// Job Updates
// import amazonUpdates from "./config/cron-jobs/job-alerts/amazon";
// import figmaJobUpdates from "./config/cron-jobs/job-alerts/figma";
// import datadogJobUpdates from "./config/cron-jobs/job-alerts/datadog";

// import { getCourseInfo } from "./config/functions/getCourse";
// import amazonJobUpdates from "./config/cron-jobs/job-alerts/amazon";

export default async (_nitroApp: Nitro) => {
  try {
    await mongoose.connect(
      "mongodb+srv://sidharth_ponram:Startlink129@cluster0.lbatq.mongodb.net/tortuga?retryWrites=true&w=majority&appName=Cluster0"
    );

    // Run both cron jobs
    // watchlistUpdates();
    // slingshotUpdates();
    // figmaJobUpdates();
    // datadogJobUpdates();
    // amazonJobUpdates();

    console.log("Connected to Tortuga Web Service!");
  } catch (e) {
    console.error(e);
  }
};
