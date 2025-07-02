import slingshotUpdates from "~/server/config/cron-jobs/slingshot";

export default defineEventHandler(async (event) => {
  const apiKey = getHeader(event, "x-api-key");

  try {
    // if (apiKey !== useRuntimeConfig().eventbridgeURI) {
    //   return {
    //     statusCode: 401,
    //     statusMessage: "Unauthorized Request.",
    //   };
    // } else {
      await slingshotUpdates();
      return { statusCode: 200, message: "Cron successfully executed!" };
    // }
  } catch (e) {
    return { statusCode: 500, message: e };
  }
});
