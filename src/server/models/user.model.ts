import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  terpmail: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  telephone: {
    type: String,
    default: "",
  },
  standing: {
    type: String,
    required: false,
    default: "Not Set",
  },
  major: {
    type: String,
    required: false,
    default: "Not Set",
  },
  saved_courses: {
    type: Array,
    required: false,
    default: [],
  },
  profile_complete: {
    type: Boolean,
    default: false,
  },
});

export default model("users", userSchema);
