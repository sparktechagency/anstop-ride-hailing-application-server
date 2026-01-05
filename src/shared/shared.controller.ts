import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import httpStatus from "http-status";
import { SharedService } from "./shared.service";
import ApiResponse from "../utils/ApiResponse";

const setLanguagePreference = asyncHandler(async (req, res) => {
	const { _id, role } = req.user;
	if (!req.user && !_id) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated");
	}
	const payload = req.body;
	await SharedService.setLanguagePreference(payload, { userId: _id, role });
	res.status(httpStatus.CREATED).json(
		new ApiResponse({
			statusCode: httpStatus.CREATED,
			message: "Language preference is set successfully",
			data: null,
		})
	);
});

const getLanguagePreference = asyncHandler(async (req, res) => {
	const { _id, role } = req.user;
	if (!req.user && !_id) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated");
	}
	const languagePreference = await SharedService.getLanguagePreference({
		userId: _id,
		role,
	});
	res.status(httpStatus.OK).json(
		new ApiResponse({
			statusCode: httpStatus.OK,
			message: "Language preference retrieved successfully",
			data: { languagePreference },
		})
	);
});

// const setUserAddress = asyncHandler(async (req, res) => {
// 	const { _id, role } = req.user;
// 	if (!req.user && !_id) {
// 		throw new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated");
// 	}
// 	const payload = req.body;
// 	await SharedService.setUserAddress(payload, { userId: _id, role });
// 	res.status(httpStatus.OK).json(
// 		new ApiResponse({
// 			statusCode: httpStatus.OK,
// 			message: "User address is set successfully",
// 			data: null,
// 		})
// 	);
// });

// const getUserAddress = asyncHandler(async (req, res) => {
// 	const { _id, role } = req.user;
// 	if (!req.user && !_id) {
// 		throw new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated");
// 	}
// 	const address = await SharedService.getUserAddress({ userId: _id, role });
// 	res.status(httpStatus.OK).json(
// 		new ApiResponse({
// 			statusCode: httpStatus.OK,
// 			message: "User address retrieved successfully",
// 			data: { address },
// 		})
// 	);
// });

export const SharedController = {
	setLanguagePreference,
	getLanguagePreference,
	// setUserAddress,
	// getUserAddress,
};
