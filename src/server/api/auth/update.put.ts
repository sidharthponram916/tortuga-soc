import User from "../../models/user.model.js";

export default defineEventHandler(async (event) => {
  try {
    const body: any = await readBody(event);

    const user = await User.findByIdAndUpdate(body._id, body);

    return user;
  } catch (e: any) {
    throw createError({ statusCode: 500, message: e.message });
  }
});
