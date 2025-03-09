import User from "../../models/user.model";
import EmailToken from "../../models/email-token.model";

import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  try {
    const body: any = await readBody(event);
    const user = await User.findById(body.id);

    if (!user)
      return {
        statusCode: 404,
        statusMessage: "This is an invalid link.",
      };

    const token = await EmailToken.findOne({
      userId: user._id,
      token: body.token,
    });

    if (!token)
      return {
        statusCode: 404,
        statusMessage: "The token used has been found to be invalid.",
      };

    await User.findByIdAndUpdate(user._id, {
      password: await bcrypt.hash(
        body.new_password,
        parseInt(useRuntimeConfig().salt)
      ),
    });

    await token.deleteOne();

    return user;
  } catch (e: any) {
    return {
      statusCode: 500,
      statusMessage: e.message,
    };
  }
});
