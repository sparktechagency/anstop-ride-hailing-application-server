import pick from "../../types/pick";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import asyncHandler from "../../utils/asyncHandler";
import { AdminService } from "./admin.service";
import httpStatus from "http-status";

const login = asyncHandler(async (req, res) => {
	const payload = req.body;

	const result = await AdminService.login(payload);

	if (!result) {
		throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Login failed");
	}

	res.status(httpStatus.OK).json(
		new ApiResponse({
			statusCode: httpStatus.OK,
			message: "Login successful",
			data: result,
		})
	);
});

const forgotPassword = asyncHandler(async (req, res) => {
	const payload = req.body;

	const result = await AdminService.forgotPassword(payload);

	if (!result) {
		throw new ApiError(
			httpStatus.INTERNAL_SERVER_ERROR,
			"Failed to forgot password"
		);
	}

	res.status(httpStatus.OK).json(
		new ApiResponse({
			statusCode: httpStatus.OK,
			message: "Password reset otp sent successfully",
			data: null,
		})
	);
});

const resetPassword = asyncHandler(async (req, res) => {
	const payload = req.body;

	const result = await AdminService.resetPassword(payload);

	if (!result) {
		throw new ApiError(
			httpStatus.INTERNAL_SERVER_ERROR,
			"Failed to reset password"
		);
	}

	res.status(httpStatus.OK).json(
		new ApiResponse({
			statusCode: httpStatus.OK,
			message: "Password reset successfully",
			data: null,
		})
	);
});

const dashboardStats = asyncHandler(async (req, res) => {
	const result = await AdminService.dashboardStats();

	res.status(httpStatus.OK).json(
		new ApiResponse({
			statusCode: httpStatus.OK,
			message: "Dashboard stats retrieved successfully",
			data: result,
		})
	);
});

const getAllUser = asyncHandler(async (req, res) => {
	const filters = {};
	const options = pick(req.query, ["sortBy", "limit", "page"]);

	const result = await AdminService.getAllUser(filters, options);
	res.status(httpStatus.OK).json(
		new ApiResponse({
			statusCode: httpStatus.OK,
			message: "Users retrieved successfully",
			data: result,
		})
	);
});

const getAllDriver = asyncHandler(async (req, res) => {
	const filters = {};
	const options = pick(req.query, ["sortBy", "limit", "page"]);

	const result = await AdminService.getAllDriver(filters, options);
	res.status(httpStatus.OK).json(
		new ApiResponse({
			statusCode: httpStatus.OK,
			message: "Driver retrieved successfully",
			data: result,
		})
	);
});

const getUserById = asyncHandler(async (req, res) => {
	const { userId } = req.params;

	if (!userId) {
		throw new ApiError(httpStatus.BAD_REQUEST, "User ID is required");
	}

	const result = await AdminService.getUserById(userId);
	res.status(httpStatus.OK).json(
		new ApiResponse({
			statusCode: httpStatus.OK,
			message: "User retrieved successfully",
			data: result,
		})
	);
});

const getDriverById = asyncHandler(async (req, res) => {
	const { driverId } = req.params;

	if (!driverId) {
		throw new ApiError(httpStatus.BAD_REQUEST, "Driver ID is required");
	}

	const result = await AdminService.getDriverById(driverId);
	res.status(httpStatus.OK).json(
		new ApiResponse({
			statusCode: httpStatus.OK,
			message: "Driver retrieved successfully",
			data: result,
		})
	);
});

const tripStats = asyncHandler(async (req, res) => {
	const result = await AdminService.tripStats();
	res.status(httpStatus.OK).json(
		new ApiResponse({
			statusCode: httpStatus.OK,
			message: "Trip stats retrieved successfully",
			data: result,
		})
	);
});

export const AdminController = {
	login,
	forgotPassword,
	resetPassword,
	dashboardStats,
	getAllUser,
	getAllDriver,
	getUserById,
	getDriverById,
	tripStats
};
