import watchlistUpdates from "~/server/config/cron-jobs/watchlist";

export default defineEventHandler(async (event) => {
  const apiKey = getHeader(event, "x-api-key");

  try {
    if (apiKey !== useRuntimeConfig().eventbridgeURI) {
      return {
        statusCode: 401,
        statusMessage: "Unauthorized Request.",
      };
    } else {
      watchlistUpdates();
      return { statusCode: 200, message: "Cron successfully executed!" };
    }
  } catch (e) {
    console.log({ statusCode: 500, message: "There was an error" });
  }
});
