import nodemailer from "nodemailer";

// Single shared Gmail SMTP transport, used by both the email sender and the
// free email-to-SMS gateway sender. Prefer env vars; fall back to the existing
// hardcoded values so local dev keeps working.
//
// SECURITY: these Gmail credentials are currently committed in the repo (public
// GitHub). Rotate the app password and set EMAIL_USER / EMAIL_APP_PASSWORD in
// .env so the fallbacks below can be removed.
export const MAIL_USER = process.env.EMAIL_USER || "tortugaumd@gmail.com";
const MAIL_PASS = process.env.EMAIL_APP_PASSWORD || "brpv nxib qbat umce";

export const createMailTransport = () =>
  nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for port 465
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASS,
    },
  });
