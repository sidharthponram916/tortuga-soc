import User from "../../models/user.model.js";

export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, "auth_token");

    if (!token)
      throw createError({
        statusCode: 401,
        statusMessage: "User is not authenticated.",
      });

    const body: any = await readBody(event);

    const user = await User.findByIdAndUpdate(body._id, body);

    return user;
  } catch (e: any) {
    console.log(e.message);
    return { statusCode: 500, message: e.message };
  }
});
