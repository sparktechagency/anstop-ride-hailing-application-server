import asyncHandler from "../../utils/asyncHandler";
import { AccountService } from "./account.service";
import httpStatus from "http-status";
import ApiResponse from "../../utils/ApiResponse";
import ApiError from "../../utils/ApiError";

const getMe = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	if (!req.user && !_id) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated");
	}
	const user = await AccountService.getMe(_id);
	res.status(httpStatus.OK).json(
		new ApiResponse({
			statusCode: httpStatus.OK,
			message: "User retrieved successfully",
			data: user,
		})
	);
});

export const AccountControllers = {
    getMe,
};
