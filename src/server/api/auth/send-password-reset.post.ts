import User from "~/server/models/user.model";
import EmailToken from "~/server/models/email-token.model";
import { v4 as uuidv4 } from "uuid";
import sendSMS from "~/server/config/send-sms";
import normalizePhone from "~/server/config/normalize-phone";

export default defineEventHandler(async (event) => {
  try {
    const body: any = await readBody(event);

    let user = await User.findOne({ terpmail: body.terpmail });

    if (!user)
      return {
        statusCode: 404,
        message: "That user is not associated with a Tortuga Account.",
      };

    // SMS reset requires a phone number on file.
    const phone = normalizePhone(user.telephone || "");
    if (!phone)
      return {
        statusCode: 400,
        message:
          "No valid phone number is on file for this account. Add one in your profile before requesting an SMS reset.",
      };

    const existingToken = await EmailToken.findOne({ userId: user.id });

    if (existingToken)
      return {
        statusCode: 401,
        message: "A password reset text has already been sent!",
      };

    const token = await EmailToken.create({
      userId: user._id,
      token: uuidv4(),
    });

    const link = `/auth/${user._id}/password-reset/${token.token}`;
    const message = `Tortuga: reset your password using this link (expires in 1 hour): ${
      useRuntimeConfig().frontendURL
    }${link}`;

    await sendSMS(phone, message);

    return { statusCode: 200, message: "Reset text sent!" };
  } catch (e: any) {
    return { statusCode: 500, message: e.message || e };
  }
});
