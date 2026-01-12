import ApiError from "../../utils/ApiError";
import { User } from "../user/user.model";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { GenerateToken } from "./auth.utils";
import { config } from "../../config";
import { TChangePasswordDTO, TForgotPasswordDTO, TOtpVerificationDTO, TResendOtpDTO, TResetPasswordDTO, TUserSignInDTO, TUserSignUpDTO } from "./auth.dto";
import { EmailPublicApi } from "../../utils/email/emailPublicApi";
import { OTP_TYPE } from "../otpToken/otpToken.constant";
import { Types } from "mongoose";
import { OtpInternalApi } from "../otpToken/otpToken.internalApi";

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

const SignUpUser = async (userData: TUserSignUpDTO): Promise<void> => {
	const { email } = userData;
	let user = await User.findOne({ email });

	if (user) {
		if (user.isEmailVerified) {
			throw new ApiError(
				httpStatus.BAD_REQUEST,
				"Account already exists with these credentials"
			);
		}

		// invalidate all existing OTP tokens
		await OtpInternalApi.invalidateOTPToken({
			userId: user._id,
			isValid: true,
		});

		if (userData?.name) user.name = userData.name;
		if (userData?.password) user.password = userData.password;
		if (userData?.role) user.role = [userData.role];


		await user.save();
	} else {
		// Create new user
		user = new User({
			...userData,
			role: [userData.role],
		});
		await user.save();
	}

	const otpDetails = await OtpInternalApi.createOTPToken({
		userId: user._id,
		type: "EMAIL_VERIFICATION",
	});
	// TODO: impliement queueing system / background job for sending email with retry mechanism

	new EmailPublicApi().sendOtpEmail(
		"EMAIL_VERIFICATION",
		{ email: user.email, username: user.name },
		otpDetails.otp,
		otpDetails.expirationTime
	);
};

const SignInUser = async(payload: TUserSignInDTO) => {
	const user = await User.findOne({
		email: payload.email,
	});

	console.log(user);

	if (!user) throw new ApiError(httpStatus.NOT_FOUND, "Invalid credentials.");

	const isPasswordValid = await bcrypt.compare(
		payload.password,
		user.password
	);

	if (!isPasswordValid)
		throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials.");

	if (!user.isEmailVerified) {

		//invalidate all existing OTP tokens
		await OtpInternalApi.invalidateOTPToken({
			userId: user._id,
			isValid: true,
		});

		const otpDetails = await OtpInternalApi.createOTPToken({
			userId: user._id,
			type: "EMAIL_VERIFICATION",
		});
		// TODO: impliement queueing system / background job for sending email with retry mechanism

		new EmailPublicApi().sendOtpEmail(
			"EMAIL_VERIFICATION",
			{ email: user.email, username: user.name },
			otpDetails.otp,
			otpDetails.expirationTime
		);	

		return {
			needsVerification: true,
			accessToken: "",
			refreshToken: "",
		};
	}

	const accessToken = GenerateToken(
		{ _id: user._id.toString(), role: user.role },
		config.JWT.access_secret,
		config.JWT.access_expiration_time
	);

	const refreshToken = GenerateToken(
		{ _id: user._id.toString(), role: user.role },
		config.JWT.refresh_secret,
		config.JWT.refresh_expiration_time 
	);

	return {
		accessToken,
		refreshToken,
		role: user.role,
		needsVerification: false,
	};
};


const verifyOTP = async (payload: TOtpVerificationDTO) => {
	const user = await User.findOne({
		email: payload.email,
	});

	if (!user) {
		throw new ApiError(
			httpStatus.NOT_FOUND,
			"You have not registered yet. Please register first."
		);
	}

	const otpToken = await OtpInternalApi.getOtpToken({
		userId: user._id,
		type: payload.type,
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

	const isOTPValid = await bcrypt.compare(payload.otp, otpToken.otp);

	if (!isOTPValid) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid OTP");
	}

	await OtpInternalApi.invalidateOTPToken({
		_id: otpToken._id,
	});

	const accessToken = GenerateToken(
		{ _id: user._id.toString(), role: user.role },
		config.JWT.access_secret,
		config.JWT.access_expiration_time
	);

	const refreshToken = GenerateToken(
		{ _id: user._id.toString(), role: user.role },
		config.JWT.refresh_secret,
		config.JWT.refresh_expiration_time 
	);


	if (!user.isEmailVerified) {
		// mark user as verified
		user.isEmailVerified = true;
		await user.save();
	}
	return { accessToken, refreshToken, role: user.role	 };
};

const resendOTP = async (userData: TResendOtpDTO): Promise<void> => {

	const user = await User.findOne({
		email: userData?.email,
	});

	if (!user) {
		throw new ApiError(
			httpStatus.NOT_FOUND,
			"You have not registered yet. Please register first."
		);
	}

	const existingOtpToken = await OtpInternalApi.getOtpToken({
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

	await OtpInternalApi.invalidateOTPToken({
		userId: user._id,
		isValid: true,
	});


	const otpDetails = await OtpInternalApi.createOTPToken({
		userId: user._id,
		type: userData.type,
	});

	const emailService = new EmailPublicApi();
	await emailService.sendOtpEmail(
		userData.type,
		{ email: user.email, username: user.name },
		otpDetails.otp,
		otpDetails.expirationTime
	);
};

const forgotPassword = async (email: string) => {
	const user = await User.findOne({ email });
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
	}


	await OtpInternalApi.invalidateOTPToken({
		userId: user._id,
	});


	const otpDetails = await OtpInternalApi.createOTPToken({
		userId: user._id,
		type: OTP_TYPE.PASSWORD_RESET,
	});


	const emailService = new EmailPublicApi();
	await emailService.sendOtpEmail(
		OTP_TYPE.PASSWORD_RESET,
		{ email: user.email, username: user.name },
		otpDetails.otp,
		otpDetails.expirationTime
	);
};

const resetPassword = async (userId: Types.ObjectId, password: string) => {
	// TODO: reset password should be more secure and robust
	const user = await User.findById(userId);
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
	}

	console.log(user);

	user.password = password;
	if (!user.isEmailVerified) {
		user.isEmailVerified = true;
	}
	await user.save();

	// TODO: send email for password reset success
};

const changePassword = async (
	userId: Types.ObjectId,
	payload: TChangePasswordDTO
) => {
	const { currentPassword, newPassword } = payload;

	console.log(payload);

	const user = await User.findById(userId).select("+password");
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
	}
	console.log(user);

	const isPasswordValid = await bcrypt.compare(
		currentPassword,
		user.password
	);
	if (!isPasswordValid) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials.");
	}

	user.password = newPassword;
	await user.save();
};

export const authService = {
	SignUpUser,
	SignInUser,
	verifyOTP,
	resendOTP,
	forgotPassword,
	resetPassword,
	changePassword,
};
