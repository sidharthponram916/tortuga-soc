import User from "@/server/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  try {
    const body: any = await readBody(event);

    const user = await User.findOne({ terpmail: body.terpmail });
    if (!user) return { error: "User not found." };

    const matches = await bcrypt.compare(body.password, user.password);
    if (!matches) return { error: "Invalid credentials." };

    const token = jwt.sign({ id: `${user._id}` }, useRuntimeConfig().key);
    return { ...user, token };
  } catch (e: any) {
    return { message: e.message };
  }
});
