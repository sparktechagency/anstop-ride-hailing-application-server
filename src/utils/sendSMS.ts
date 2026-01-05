import { Twilio } from "twilio";
import { config } from "../config";
import ApiError from "./ApiError";

const apiKey = config.twilio_api_key_sid;
const secret = config.twilio_api_key_secret;
const accountSid = config.twilio_account_sid;
const twilioClient = new Twilio(apiKey, secret, {
  accountSid: accountSid
});

// export async function sendOtpToUser(phoneNumber: string): Promise<void> {
//   console.log("Twilio Verification Service SID:", config.twilio_verification_service_sid);
//   try {
//     const response = await twilioClient.verify.v2.services(config.twilio_verification_service_sid!).verifications.create({
//       to: phoneNumber,
//       channel: 'sms',
//     });
  
//     console.log(response);
// } catch (error) {
//     console.error("Error sending OTP:", error);
//     throw new ApiError(500,"Failed to send OTP");
//   }
  
// }

// // controllers/auth.ts
// export const verifyOtp = async (phone: string, code: string) => {
//   try {
//     const verification_check = await twilioClient.verify.v2
//       .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
//       .verificationChecks.create({
//         to: phone,
//         code,
//       });

//     if (verification_check.status !== "approved") {
//       throw new ApiError(400, "Invalid code");
//     }
//   } catch (error) {
//     console.error("OTP Verify Error:", error);
//     throw new ApiError(500, "OTP verification failed");
//   }
// };


export async function sendOtpToUser(phoneNumber: string, otp: string): Promise<void> {
  console.log("Twilio Verification Service SID:", config.twilio_verification_service_sid);
  try {
    
    const response = await twilioClient.messages.create({
      body: `Your OTP code is: ${otp}. Please do not share it with anyone.`,
      from: config.twilio_phone_number,
      to: phoneNumber,
    });
  
    console.log(response);
} catch (error) {
    console.error("Error sending OTP:", error);
    throw new ApiError(500,"Failed to send OTP");
  }
  
}

// controllers/auth.ts
export const verifyOtp = async (phone: string, code: string) => {
  try {
    const verification_check = await twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verificationChecks.create({
        to: phone,
        code,
      });

    if (verification_check.status !== "approved") {
      throw new ApiError(400, "Invalid code");
    }
  } catch (error) {
    console.error("OTP Verify Error:", error);
    throw new ApiError(500, "OTP verification failed");
  }
};