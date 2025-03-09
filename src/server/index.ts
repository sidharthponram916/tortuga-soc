import { Nitro } from "nitropack";
import mongoose from "mongoose";
import watchlistUpdates from "./config/cron-jobs/watchlist";
import slingshotUpdates from "./config/cron-jobs/slingshot";

export default async (_nitroApp: Nitro) => {
  try {
    await mongoose.connect(useRuntimeConfig().dbURI);

    // Run both cron jobs 
    watchlistUpdates();
    slingshotUpdates();
    console.log("Connected to MongoDB server!");
  } catch (e) {
    console.error(e);
  }
};
