import User from "@/server/models/user.model.js";
import bcrypt from "bcrypt";
import sendEmail from "../../config/send-email";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  try {
    const body: any = await readBody(event);

    const isUser = await User.findOne({ terpmail: body.terpmail });
    if (isUser)
      return createError({
        statusCode: 400,
        message:
          "That email already exists within our records. Please choose something different.",
      });

    const usernameRepeat = await User.findOne({ username: body.username });
    if (usernameRepeat)
      return createError({
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

    const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
    <title>Hello World</title>
  </head>
  <body
    style="
      text-align: center;
      background-color: #f0b942;
      color: rgb(59, 59, 59);
      font-family: Roboto, sans-serif;
    "
  >
    <div
      style="
        padding: 8px;
        margin: 8px auto;
        width: 50%;
        background-color: #790c0c;
        color: #ececec;
        text-align: center;
      "
    >
      <img
        src="https://static-00.iconduck.com/assets.00/turtle-emoji-1024x817-mtty96vf.png"
        style="
          display: block;
          margin: auto;
          width: 10rem;
          padding-top: 5rem;
          padding-bottom: 3rem;
        "
      />
      <div style="font-weight: bold; font-size: 1.875rem">
        Welcome to Tortuga.
      </div>
      <div
        style="
          font-weight: 500;
          font-size: 1.25rem;
          padding: 5px;
          width: 83.3333%;
          margin: auto;
        "
      >
        You have already taken the steps to get an edge at the UMD course
        selection process.
      </div>
      <div style="padding: 30px">
        <a
          href="https://tortugasoc.com/my-tools/dashboard"
          style="
            padding: 10px;
            margin: 100px;
            font-weight: bold;
            border-radius: 5px;
            color: white;
          "
        >
          Go to My Dashboard
        </a>
      </div>
    </div>
  </body>
</html>
`;

    sendEmail(`${body.terpmail}`, `Welcome to Tortuga!`, `${html}`);

    return rest;
  } catch (e: any) {
    return createError({ statusCode: 500, statusMessage: e.message });
  }
});
