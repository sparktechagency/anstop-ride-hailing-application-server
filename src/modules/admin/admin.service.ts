import { config } from "../../config";
import ApiError from "../../utils/ApiError";
import asyncHandler from "../../utils/asyncHandler";
import { GenerateToken } from "../auth/auth.utils";
import { Admin } from "./admin.model";
import httpStatus from "http-status";
import {
	TAdminForgotPassword,
	TAdminLogin,
	TAdminResetPassword,
} from "./admin.validation";
import { GenerateOTP } from "../otpToken/otpToken.utils";
import { sendEmail } from "../../utils/SendEmail";
import { OTPToken } from "../otpToken/otpToken.model";
import { ForgotPasswordEmail } from "./admin.utils";
import { User } from "../user/user.model";
import { Driver } from "../driver/driver.model";
import { RideRequest } from "../rideRequest/rideRequest.model";
import { RideRequestStatus } from "../rideRequest/rideRequest.interface";
import { TPaginateOptions, TPaginateResult } from "../../types/paginate";
import { TDriver } from "../driver/driver.interface";
import { TUser } from "../user/user.interface";

type TDashboardStatsResponse = {
	totalUsers: number;
	totalDrivers: number;
	activeOrders: number;
	totalEarnings: number;
};

type TTripStatsResponse = {
	totalTrips: number;
	totalCompletedTrips: number;
	totalCancelledTrips: number;
	revenue: number;
};

const login = async (payload: TAdminLogin) => {
	const { email, password } = payload;
	const user = await Admin.findOne({ email });
	if (!user) {
		throw new ApiError(httpStatus.BAD_REQUEST, "User not found.");
	}
	console.log(payload);
	// const isPasswordValid = await user.comparePassword(password);
	const isPasswordValid = await user.comparePassword(password);
	console.log(isPasswordValid);
	if (!isPasswordValid) {
		throw new ApiError(httpStatus.BAD_REQUEST, "Invalid credentials.");
	}

	const token = GenerateToken(
		{ _id: String(user._id), role: user.role },
		config.jwt_access_secret as string,
		config.jwtExpiry
	);

	return { token };
};

const forgotPassword = async (payload: TAdminForgotPassword) => {
	const { email } = payload;

	const user = await Admin.findOne({ email });
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
	}

	const otp = GenerateOTP();
	console.log("inside if user exist", otp);

	await sendEmail(
		email,
		"Forgot Password",
		ForgotPasswordEmail(
			`${user.username.firstName} ${user.username.lastName}`,
			otp,
			"10"
		)
	);

	// Save the OTP to the database
	const otpToken = new OTPToken({
		userId: user._id,
		otp: otp,
		expiresAt: new Date(Date.now() + 10 * 60 * 1000), // OTP valid for 10 minutes
	});
	await otpToken.save();

	return { message: "OTP sent successfully" };
};

const resetPassword = async (payload: TAdminResetPassword) => {
	const { email, password } = payload;

	const user = await Admin.findOne({ email });
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
	}
	user.password = password;
	await user.save();
	return user;
};

const dashboardStats = async (): Promise<TDashboardStatsResponse> => {
	const totalUser = await User.countDocuments();
	const totalDrivers = await Driver.countDocuments();
	const activeOrders = await RideRequest.find({
		status: {
			$in: [RideRequestStatus.PENDING, RideRequestStatus.ACCEPTED],
		},
	}).countDocuments();
	const totalEarnings = await RideRequest.aggregate([
		{
			$match: {
				status: { $in: [RideRequestStatus.COMPLETED] },
			},
		},
		{
			$group: {
				_id: null,
				totalEarnings: { $sum: "$pricingInfo.totalFare" },
			},
		},
	]);

	return {
		totalUsers: totalUser,
		totalDrivers: totalDrivers,
		activeOrders: activeOrders,
		totalEarnings: totalEarnings[0]?.totalEarnings || 0,
	};
};

const getAllUser = async (
	filters: Record<string, any>,
	options: TPaginateOptions
) => {
	options.sortBy = options.sortBy || "createdAt";
	options.select =
		"username email phoneNumber avatar regionalInformation isOnline";
	// return await User.paginate(filters, options);
};

const getAllDriver = async (
	filters: Record<string, any>,
	options: TPaginateOptions
): Promise<TPaginateResult<TDriver>> => {
	options.sortBy = options.sortBy || "createdAt";
	options.select =
		"username email phoneNumber avatar regionalInformation isOnline";
	return await Driver.paginate(filters, options);
};

const getUserById = async (id: string) => {
	const user = await User.findById(id);

	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "User not found");
	}

	return user;
};

const getDriverById = async (id: string) => {
	const driver = await Driver.findById(id);

	if (!driver) {
		throw new ApiError(httpStatus.NOT_FOUND, "Driver not found");
	}

	return driver;
};

const tripStats = async () => {
	// total trips

	const totalTrips = await RideRequest.countDocuments();

	const totalCompletedTrips = await RideRequest.find({
		status: {
			$in: [RideRequestStatus.COMPLETED],
		},
	}).countDocuments();

	const totalCancelledTrips = await RideRequest.find({
		status: {
			$in: [RideRequestStatus.USER_CANCELED],
		},
	}).countDocuments();

	// total revenue

	const revenue = await RideRequest.aggregate([
		{
			$match: {
				status: { $in: [RideRequestStatus.COMPLETED] },
			},
		},
		{
			$group: {
				_id: null,
				totalEarnings: { $sum: "$pricingInfo.totalFare" },
			},
		},
	]);

	return {
		totalTrips: totalTrips,
		totalCompletedTrips: totalCompletedTrips,
		totalCancelledTrips: totalCancelledTrips,
		totalEarnings: revenue[0]?.totalEarnings || 0,
	};
};

export const AdminService = {
	login,
	forgotPassword,
	resetPassword,
	dashboardStats,
	getAllUser,
	getAllDriver,
	getUserById,
	getDriverById,
	tripStats,
};
