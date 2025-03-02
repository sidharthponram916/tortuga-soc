import User from "@/server/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  try {
    const body: any = await readBody(event);

    const isUser = await User.findOne({ terpmail: body.terpmail });
    if (isUser)
      throw createError({
        statusCode: 400,
        message:
          "That email already exists within our records. Please choose something different.",
      });

    const usernameRepeat = await User.findOne({ username: body.username });
    if (usernameRepeat)
      throw createError({
        statusCode: 400,
        message:
          "That username already exists within our records. Please choose something different.",
      });

    const user = await User.create({
      ...body,
      password: await bcrypt.hash(
        body.password,
        parseInt(useRuntimeConfig().salt)
      ),
    });

    const { password, ...rest } = user;
    const token = jwt.sign({ id: `${user._id}` }, useRuntimeConfig().key, {
      expiresIn: "12h",
    });

    setCookie(event, "auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 43200,
      sameSite: "strict",
      path: "/",
    });

    return rest;
  } catch (e: any) {
    return { message: e.message };
  }
});
