import { createMailTransport, MAIL_USER } from "~/server/config/mailer";

// Carrier -> email-to-SMS gateway domain. Emailing <10-digit-number>@<gateway>
// is delivered to the phone as a text message for FREE, reusing the existing
// Gmail SMTP pipeline (no AWS SNS charges, no SNS sandbox verification).
//
// These are the standard US carrier SMS gateways. MMS gateways (for longer
// messages) differ, but SMS gateways handle multipart concatenation fine.
const CARRIER_GATEWAYS: Record<string, string> = {
  verizon: "vtext.com",
  att: "txt.att.net",
  tmobile: "tmomail.net",
  sprint: "messaging.sprintpcs.com",
  boost: "sms.myboostmobile.com",
  cricket: "sms.cricketwireless.net",
  uscellular: "email.uscc.net",
  metropcs: "mymetropcs.com",
  googlefi: "msg.fi.google.com",
  virgin: "vmobl.com",
};

// Exposed so the UI / validation can enumerate supported carriers.
export const SUPPORTED_CARRIERS = Object.keys(CARRIER_GATEWAYS);

/**
 * Send a text message for free via the recipient's carrier email-to-SMS gateway.
 *
 * @param phone   Number in E.164 (+13015551234) or any digits; +1/country code stripped.
 * @param message Plain-text body. Keep it short (standard SMS ~160 chars).
 * @param carrier Carrier key (see SUPPORTED_CARRIERS), case-insensitive.
 */
const sendSMS = async function (
  phone: string,
  message: string,
  carrier: string
) {
  const gateway = CARRIER_GATEWAYS[(carrier || "").toLowerCase()];
  if (!gateway) {
    throw new Error(
      `Unsupported or missing carrier "${carrier}". Supported: ${SUPPORTED_CARRIERS.join(
        ", "
      )}`
    );
  }

  // Gateways expect the bare 10-digit US number (no +1 / country code).
  const digits = phone.replace(/\D/g, "");
  const local =
    digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  if (local.length !== 10) {
    throw new Error(`Cannot derive a 10-digit US number from "${phone}".`);
  }

  const to = `${local}@${gateway}`;

  try {
    const transporter = createMailTransport();

    await transporter.sendMail({
      from: `'Tortuga UMD' <${MAIL_USER}>`,
      to,
      // Empty subject: some gateways prepend the subject to the SMS body.
      subject: "",
      // Plain text, not HTML: gateways deliver the raw text as the message.
      text: message,
    });

    console.log(`SMS (via ${gateway}) pushed to ${to}`);
    return { to };
  } catch (e: any) {
    console.log("SMS send error:", e.message);
    throw e;
  }
};

export default sendSMS;
