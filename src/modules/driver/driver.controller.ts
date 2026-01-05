import httpStatus from "http-status";
import asyncHandler from "../../utils/asyncHandler";
import ApiResponse from "../../utils/ApiResponse";
import ApiError from "../../utils/ApiError";
import { DriverService } from "./driver.service";

const onboardDriver = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	if (!req.user && !_id) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated");
	}
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

export const DriverControllers = {
	onboardDriver,
};
