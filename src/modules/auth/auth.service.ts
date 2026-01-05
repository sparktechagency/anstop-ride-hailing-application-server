import ApiError from "../../utils/ApiError";
import { User } from "../user/user.model";
import httpStatus from "http-status";
import { OTPToken } from "../otpToken/otpToken.model";
import bcrypt from "bcrypt";
import {
	TOptVerification,
	TResendOTP,
	TUserRegistration,
} from "./auth.validation";
import { sendOtpToUser } from "../../utils/sendSMS";
import { GenerateOTP } from "../otpToken/otpToken.utils";
import { GenerateToken } from "./auth.utils";
import { config } from "../../config";
import { Driver } from "../driver/driver.model";

// const registerUserIntoDB = async (
// 	userData: UserRegistration
// ): Promise<boolean> => {
// 	// checking if the user is exist
// 	const user = await User.findOne({
// 		phoneNumber: userData?.phoneNumber,
// 	});

// 	if (user) {
// 		await sendOtpToUser(user.phoneNumber);
// 		return true;
// 	} else {
// 		// if user is not exist then create new user
// 		const newUser = new User({
// 			phoneNumber: userData?.phoneNumber,
// 		});
// 		await newUser.save();
// 		await sendOtpToUser(newUser.phoneNumber);
// 		return true;
// 	}
// };

// const verifyOTP = async (
// 	email: string,
// 	otp: string
// ): Promise<IPasswordOperationResponse> => {
// 	// Find the user by email

// 	const user = await User.findOne({ email });

// 	if (!user) {
// 		throw new ApiError(
// 			httpStatus.NOT_FOUND,
// 			"User not found with this email"
// 		);
// 	}

// 	// Find the OTP token for the user
// 	const otpToken = await OTPToken.findOne({ userId: user._id });

// 	if (!otpToken) {
// 		throw new ApiError(httpStatus.NOT_FOUND, "Invalid or expired OTP");
// 	}

// 	// Check if the OTP is already verified

// 	if (otpToken.verified) {
// 		throw new ApiError(
// 			httpStatus.UNAUTHORIZED,
// 			"OTP has already been used"
// 		);
// 	}

// 	// Check if the OTP is expired
// 	if (otpToken.expiresAt < new Date()) {
// 		throw new ApiError(httpStatus.UNAUTHORIZED, "OTP has expired");
// 	}

// 	// Check if the OTP matches

// 	const isOTPValid = await bcrypt.compare(otp, otpToken.otp);

// 	if (!isOTPValid) {
// 		throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid OTP");
// 	}

// 	// Mark the OTP as verified

// 	otpToken.verified = true;
// 	await otpToken.save();

// 	return { message: "OTP verified successfully" };
// };

const registerUserIntoDB = async (
	userData: TUserRegistration
): Promise<{ message: string; shouldOnboard: boolean }> => {
	const { role, phoneNumber } = userData;

	let user = await User.findOne({
		phoneNumber,
		role,
	});

	console.log("user exist", user);

	if (user) {
		const existingOtpToken = await OTPToken.find({
			userId: user._id,
			isValid: true,
		});

		console.log("existingOtpToken: ", existingOtpToken);

		// check if the user requesting to fast for resend OTP
		if (existingOtpToken && existingOtpToken.length > 0) {
			console.log("existingOtpToken: ", existingOtpToken);
			existingOtpToken.forEach(async (otpToken) => {
				otpToken.isValid = false;
				await otpToken.save();
			});
		}
		const otp = GenerateOTP();
		console.log("inside if user exist", otp);
		await sendOtpToUser(user.phoneNumber, otp);

		// Save the OTP to the database
		const otpToken = new OTPToken({
			userId: user._id,
			otp: otp,
			expiresAt: new Date(Date.now() + 10 * 60 * 1000), // OTP valid for 10 minutes
		});
		await otpToken.save();

		return {
			message:
				"You have already registered. OTP sent to your phone.Please verify to login.",
			shouldOnboard: user.isOnboarded ? false : true,
		};
	} else {
		let newUser = new User({
			phoneNumber: userData?.phoneNumber,
			role: userData?.role,
		});
		newUser.save();

		const otp = GenerateOTP();
		console.log("inside else user not exist", otp);
		await sendOtpToUser(newUser.phoneNumber, otp);

		const otpToken = new OTPToken({
			userId: newUser._id,
			otp: otp,
			expiresAt: new Date(Date.now() + 10 * 60 * 1000), // OTP valid for 10 minutes
		});
		await otpToken.save();

		return {
			message:
				"Your account has been created successfully. OTP sent to your phone.Verify to continue the registration process.",
			shouldOnboard: true,
		};
	}
};

const verifyOTP = async (
	payload: TOptVerification
): Promise<{ token: string }> => {
	// Find the user by phone number

	let user = await User.findOne({
		phoneNumber: payload.phoneNumber,
		role: payload.role,
	});

	console.log(user);

	if (!user) {
		throw new ApiError(
			httpStatus.NOT_FOUND,
			"You have not registered yet. Please register first."
		);
	}

	// Find the OTP token for the user
	const otpToken = await OTPToken.findOne({
		userId: user._id,
		isValid: true,
	});

	if (!otpToken) {
		throw new ApiError(httpStatus.NOT_FOUND, "Invalid or expired OTP");
	}

	if (!otpToken.isValid) {
		throw new ApiError(
			httpStatus.UNAUTHORIZED,
			"OTP has already been used or expired"
		);
	}

	// Check if the OTP is expired
	if (otpToken.expiresAt < new Date()) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "OTP has expired");
	}

	// Check if the OTP matches

	const isOTPValid = await bcrypt.compare(payload.otp, otpToken.otp);

	if (!isOTPValid) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid OTP");
	}

	// Mark the OTP as verified

	otpToken.isValid = false; // Set isValid to false to mark it as used
	await otpToken.save();

	const token = GenerateToken(
		{ _id: user._id.toString(), role: user.role },
		config.jwt_access_secret as string,
		config.jwtExpiry
	);

	if (!user.isVerified) {
		user.isVerified = true;
		await user.save();
	}
	return { token };
};

const resendOTP = async (userData: TResendOTP): Promise<void> => {
	let user = await User.findOne({
		phoneNumber: userData?.phoneNumber,
		role: userData?.role,
	});
	// // checking if the user is exist
	// if (userData.role === "Rider") {
	// 	user = await User.findOne({
	// 		phoneNumber: userData?.phoneNumber,
	// 		isVerified: true,
	// 	});
	// } else {
	// 	user = await Driver.findOne({
	// 		phoneNumber: userData?.phoneNumber,
	// 		isVerified: true,
	// 	});
	// }

	if (!user) {
		throw new ApiError(
			httpStatus.NOT_FOUND,
			"You have not registered yet. Please register first."
		);
	}

	const existingOtpToken = await OTPToken.findOne({
		userId: user._id,
		isValid: true,
	});

	// check if the user requesting to fast for resend OTP

	if (
		existingOtpToken?.createdAt &&
		new Date().getTime() - existingOtpToken.createdAt.getTime() < 30000
	) {
		throw new ApiError(
			httpStatus.BAD_REQUEST,
			"You can only request OTP once every 30 seconds."
		);
	}

	// If an existing valid OTP token is found, invalidate it

	if (existingOtpToken) {
		existingOtpToken.isValid = false; // Invalidate the existing OTP
		await existingOtpToken.save();
	}

	const otp = GenerateOTP();
	await sendOtpToUser(user.phoneNumber, otp);

	// Save the OTP to the database
	const otpToken = new OTPToken({
		userId: user._id,
		otp: otp,
		expiresAt: new Date(Date.now() + 10 * 60 * 1000), // OTP valid for 10 minutes
	});
	await otpToken.save();
};

export const authService = {
	registerUserIntoDB,
	verifyOTP,
	resendOTP,
};
