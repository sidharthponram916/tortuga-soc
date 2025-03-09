import jwt from "jsonwebtoken";
import User from "@/server/models/user.model.js";

export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, "auth_token");

    if (!token)
      return createError({
        statusCode: 401,
        statusMessage: "User is not authenticated.",
      });

    try {
      const verified_user = jwt.verify(token, useRuntimeConfig().key) as {
        id: string;
      };

      const user = await User.findById(verified_user.id);
      if (!user)
        return createError({ statusCode: 404, message: "User not found" });

      return { success: true, user: user.toObject() };
    } catch (e) {
      return createError({ statusCode: 401, message: "Invalid token." });
    }
  } catch (e: any) {
    console.log(e);
    return {
      statusCode: 500,
      message: e,
    };
  }
});
