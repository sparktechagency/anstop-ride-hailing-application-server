import httpStatus from "http-status";
import asyncHandler from "../../utils/asyncHandler";
import ApiResponse from "../../utils/ApiResponse";
import ApiError from "../../utils/ApiError";
import { DriverService } from "./driver.service";

const onboardDriver = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	const payload = req.body;
	await DriverService.onboardDriver(_id, payload);
	res.status(httpStatus.CREATED).json(
		new ApiResponse({
			statusCode: httpStatus.CREATED,
			message: "Driver is onboarded successfully",
			data: null,
		})
	);
});

const checkOnboardingStatus = asyncHandler(async (req, res) => {
	const { _id } = req.user;

	const status = await DriverService.checkOnboardingStatus(_id);
	res.status(httpStatus.OK).json(
		new ApiResponse({
			statusCode: httpStatus.OK,
			message: "Driver onboarding status retrieved successfully",
			data: status,
		})
	);
});

export const DriverControllers = {
	onboardDriver,
	checkOnboardingStatus,
};
