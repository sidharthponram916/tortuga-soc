import { Nitro } from "nitropack";
import mongoose from "mongoose";
import sendEmail from "./config/send-email";
import watchlistUpdates from "./config/run-cron-jobs";

export default async (_nitroApp: Nitro) => {
  try {
    await mongoose.connect(useRuntimeConfig().dbURI);
    watchlistUpdates();
    console.log("Connected to MongoDB server!");
  } catch (e) {
    console.error(e);
  }
};
