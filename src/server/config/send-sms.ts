import AWS from "aws-sdk";

// AWS SNS client. Credentials + region are read from the environment
// (AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY) via the default
// credential provider chain. See .env.example.
const sns = new AWS.SNS({
  region: process.env.AWS_REGION || "us-east-1",
});

/**
 * Send a transactional SMS via AWS SNS.
 * @param phone  Recipient number in E.164 format (e.g. +13015551234).
 * @param message  Plain-text message body.
 */
const sendSMS = async function (phone: string, message: string) {
  try {
    const result = await sns
      .publish({
        Message: message,
        PhoneNumber: phone,
        MessageAttributes: {
          // Transactional = highest delivery priority (used for auth/OTP).
          "AWS.SNS.SMS.SMSType": {
            DataType: "String",
            StringValue: "Transactional",
          },
        },
      })
      .promise();

    console.log(`SMS Pushed Successfully! MessageId: ${result.MessageId}`);
    return result;
  } catch (e: any) {
    console.log("SMS send error:", e.message);
    throw e;
  }
};

export default sendSMS;
