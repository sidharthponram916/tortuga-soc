import { createMailTransport, MAIL_USER } from "~/server/config/mailer";

const sendEmail = async function (
  email: string,
  subject: string,
  text: string
) {
  try {
    const transporter = createMailTransport();

    await transporter.sendMail({
      from: `'Tortuga UMD' <${MAIL_USER}>`,
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
