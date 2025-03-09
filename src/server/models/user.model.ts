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
  registration_date: {
    type: String,
    required: false,
    default: "Not Set",
  },
  registration_time: {
    type: String,
    required: false,
    default: "Not Set",
  },
  saved_courses: {
    type: Array,
    required: false,
    default: [],
  },
  slingshot_courses: {
    type: Array,
    required: false,
    default: [],
  },
  notifications: {
    type: Boolean,
    default: true,
  },
});

export default model("users", userSchema);
