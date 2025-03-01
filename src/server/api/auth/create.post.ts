import User from "@/server/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  try {
    const body: any = await readBody(event);

    const isUser = await User.findOne({ terpmail: body.terpmail });
    if (isUser) return { error: "User already exists as an entry." };

    const user = await User.create({
      ...body,
      password: await bcrypt.hash(
        body.password,
        parseInt(useRuntimeConfig().salt)
      ),
    });

    const token = jwt.sign({ id: `${user._id}` }, useRuntimeConfig().key);
    return { ...user, token };
  } catch (e: any) {
    return { message: e.message };
  }
});
