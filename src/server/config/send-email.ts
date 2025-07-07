import nodemailer from "nodemailer";

const sendEmail = async function (
  email: string,
  subject: string,
  text: string
) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for port 465, false for other ports
      auth: {
        user: "tortugaumd@gmail.com",
        pass: "brpv nxib qbat umce",
      },
    });

    await transporter.sendMail({
      from: "'Tortuga UMD' <tortugaumd@gmail.com>",
      to: `${email}`,
      subject: `${subject}`,
      html: `${text}`,
    });

    console.log("Email Pushed Successfully!");
  } catch (e: any) {
    console.log(e.message);
  }
};

export default sendEmail;
