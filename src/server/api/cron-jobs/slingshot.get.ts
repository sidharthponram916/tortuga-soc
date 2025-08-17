import slingshotUpdates from "~/server/config/cron-jobs/slingshot";

export default defineEventHandler(async (event) => {
  const authHeader = getRequestHeader(event, "Authorization");

  try {
    if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return {
        statusCode: 401,
        statusMessage: "Unauthorized Request Made.",
      };
    } else {
      await slingshotUpdates();
      return { statusCode: 200, message: "Cron successfully executed!" };
    }
  } catch (e) {
    return { statusCode: 500, message: e };
  }
});
