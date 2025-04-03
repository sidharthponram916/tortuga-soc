import nodemailer from "nodemailer";

const sendEmail = async function (
  email: string,
  subject: string,
  text: string
) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
      user: "tortugaumd@gmail.com",
      pass: "xtfz qmth udfp vemm",
    },
  });

  await transporter.sendMail({
    from: "'Tortuga UMD' <TortugaSOC@com>",
    to: `${email}`,
    subject: `${subject}`,
    html: `${text}`,
  });

  console.log("Email Pushed Successfully!");
};

export default sendEmail;
