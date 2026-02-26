import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import asyncHandler from "../../utils/asyncHandler";
import { TChangePasswordDTO } from "./auth.dto";
import { authService } from "./auth.service";
import httpStatus from "http-status";

const SignUp = asyncHandler(async (req, res) => {
	const userData = req.body;

	await authService.SignUpUser(userData);

	res.status(httpStatus.CREATED).json(
		new ApiResponse({
			statusCode: httpStatus.CREATED,
			message:
				"Your account is created successfully. Please check your email for verification.",
			data: null,
		})
	);
});

const SignIn = asyncHandler(async (req, res) => {
	const payload = req.body;

	const result = await authService.SignInUser(payload);

	res.status(httpStatus.OK).json(
		new ApiResponse({
			statusCode: httpStatus.OK,
			message: "You are signed in successfully.",
			data: result,
		})
	);
});

const verifyOTP = asyncHandler(async (req, res) => {
	const payload = req.body;

	const result = await authService.verifyOTP(payload);

	res.status(httpStatus.OK).json(
		new ApiResponse({
			statusCode: httpStatus.OK,
			message: "OTP verified successfully",
			data: result,
		})
	);
});

const resendOTP = asyncHandler(async (req, res) => {
	const { email, type } = req.body;

	await authService.resendOTP({
		email,
		type,
	});

	res.status(httpStatus.OK).json(
		new ApiResponse({
			statusCode: httpStatus.OK,
			message: "OTP resent successfully",
			data: null,
		})
	);
});

const forgotPassword = asyncHandler(async (req, res) => {
	const { email } = req.body;

	await authService.forgotPassword(email);

	res.status(httpStatus.OK).json(
		new ApiResponse({
			statusCode: httpStatus.OK,
			message: "Please check your email for reset password instructions.",
			data: null,
		})
	);
});

const resetPassword = asyncHandler(async (req, res) => {
	const { password } = req.body;
	const userId = req.user._id;

	await authService.resetPassword(userId, password);

	res.status(httpStatus.OK).json(
		new ApiResponse({
			statusCode: httpStatus.OK,
			message: "Password reset successfully",
			data: null,
		})
	);
});

const changePassword = asyncHandler(async (req, res) => {
	const { newPassword, currentPassword, confirmPassword } =
		req.body as TChangePasswordDTO;
	const userId = req.user._id;

	await authService.changePassword(userId, {
		currentPassword,
		newPassword,
		confirmPassword,
	});

	res.status(httpStatus.OK).json(
		new ApiResponse({
			statusCode: httpStatus.OK,
			message: "Password changed successfully",
			data: null,
		})
	);
});

export const AuthControllers = {
	SignUp,
	SignIn,
	verifyOTP,
	resendOTP,
	forgotPassword,
	resetPassword,
	changePassword,
};
