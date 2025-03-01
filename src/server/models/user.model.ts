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
    required: false,
  },
  standing: {
    type: String,
    required: false,
  },
  major: {
    type: String,
    required: false,
  },
  saved_courses: {
    type: Array,
    required: false,
    default: [],
  },
});

export default model("users", userSchema);
