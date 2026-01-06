import { Types } from "mongoose";
import { OTP_TYPE, OTPType } from "./otpToken.constant";
import { ClientSession } from "mongoose";
import { User } from "../user/user.model";
import ApiError from "../../utils/ApiError";
import httpStatus from "http-status";
import { config } from "../../config";
import { OTPUtils } from "./otpToken.utils";
import { OTPToken } from "./otpToken.model";
import { IOTPToken } from "./otpToken.interface";


const createOTPToken = async (
	payload: {
		userId: Types.ObjectId;
		type: OTPType;
	},
	options?: { session?: ClientSession }
) => {
	const { userId, type } = payload;

	const user = await User.findOne({ _id: userId }).lean();
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
	}

	const expirationTime =
		type === OTP_TYPE.EMAIL_VERIFICATION
			? config.OTP.VERIFY_EMAIL_OTP_EXPIRATION_TIME
			: config.OTP.RESET_PASSWORD_OTP_EXPIRATION_TIME;

	const otp = OTPUtils.GenerateOTP();
	const otpToken = new OTPToken({
		userId,
		otp,
		type,
		expiresAt: OTPUtils.GenerateExpirationTime(expirationTime),
	});
	await otpToken.save({
		session: options?.session,
	});

	return {
		otp: otp,
		expirationTime: expirationTime,
	};
};

const getOtpToken = async (payload: Partial<IOTPToken>) => {
	return await OTPToken.findOne(payload).lean();
};

const getOtpTokens = async (payload: Partial<IOTPToken>) => {
	return await OTPToken.find(payload).lean();
};

const invalidateOTPToken = async (
	payload: Partial<IOTPToken>,
	options?: { session?: ClientSession }
) => {
	return await OTPToken.updateMany(
		payload,
		{ $set: { isValid: false } },
		{ session: options?.session }
	);
};

export const OtpInternalApi = {
	createOTPToken,
	getOtpToken,
	getOtpTokens,
	invalidateOTPToken,
};
