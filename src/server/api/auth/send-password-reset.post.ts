import User from "~/server/models/user.model";
import EmailToken from "~/server/models/email-token.model";
import { v4 as uuidv4 } from "uuid";
import sendEmail from "~/server/config/send-email";

export default defineEventHandler(async (event) => {
  try {
    const body: any = await readBody(event);

    let user = await User.findOne({ terpmail: body.terpmail });

    if (!user)
      throw createError({
        statusCode: 404,
        message: "That user is not associated with a Tortuga Account.",
      });

    const existingToken = await EmailToken.findOne({ userId: user.id });

    if (existingToken)
      throw createError({
        statusCode: 401,
        message: "A password reset email has already been sent!",
      });

    const token = await EmailToken.create({
      userId: user._id,
      token: uuidv4(),
    });

    const link = `/auth/${user._id}/password-reset/${token.token}`;
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
      <div style="font-weight: bold; font-size: 1.875rem; color: white;">
        Reset your Password. 
      </div>
      <div
        style="
          font-weight: 500;
          font-size: 1.25rem;
          padding: 5px;
          width: 83.3333%;
          margin: auto;
          color: white;
        "
      >
        Click on the link below to set a new secure password for your account.
      </div>
      <div style="padding: 30px">
        <a
          href="${useRuntimeConfig().frontendURL}${link}"
          style="
            padding: 10px;
            margin: 100px;
            font-weight: bold;
            border-radius: 5px;
            color: white;
            text-align: center; 
          "
        >
        Reset password. 
        </a>
      </div>
    </div>
  </body>
</html>`;

    sendEmail(`${body.terpmail}`, `Reset your password.`, html);
  } catch (e: any) {
    throw createError({ statusCode: 500, message: e });
  }
});
