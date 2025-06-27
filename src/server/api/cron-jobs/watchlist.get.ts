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
      await watchlistUpdates();
      return { statusCode: 200, message: "Cron successfully executed!" };
    }
  } catch (e) {
    return { statusCode: 500, message: "Error:" + e };
  }
});
