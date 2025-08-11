import { Nitro } from "nitropack";
import mongoose from "mongoose";
import watchlistUpdates from "./config/cron-jobs/watchlist";
import slingshotUpdates from "./config/cron-jobs/slingshot";
import amazonUpdates from "./config/cron-jobs/job-alerts/amazon";

import { getCourseInfo } from "./config/functions/getCourse";

export default async (_nitroApp: Nitro) => {
  try {
    await mongoose.connect(
      "mongodb+srv://sidharth_ponram:Startlink129@cluster0.lbatq.mongodb.net/tortuga?retryWrites=true&w=majority&appName=Cluster0"
    );

    // Run both cron jobs
    // watchlistUpdates();
    // slingshotUpdates();
    amazonUpdates();
    
    console.log("Connected to database server!");
  } catch (e) {
    console.error(e);
  }
};
