import User from "@/server/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  try {
    const body: any = await readBody(event);
    const user = await User.findOne({ terpmail: body.terpmail });
    if (!user)
      return createError({
        statusCode: 404,
        statusMessage: "This user was not found.",
      });

    const matches = await bcrypt.compare(body.password, user.password);

    if (!matches)
      return createError({
        statusCode: 401,
        statusMessage: "You entered invalid credentials. Please try again.",
      });

    const { password, ...rest } = user.toObject();

    const token = jwt.sign(
      { id: `${user._id.toString()}` },
      useRuntimeConfig().key,
      {
        expiresIn: "12h",
      }
    );

    setCookie(event, "auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 43200,
      sameSite: "strict",
      path: "/",
    });

    return rest;
  } catch (e: any) {
    return createError({ statusCode: 500, statusMessage: e.message });
  }
});
