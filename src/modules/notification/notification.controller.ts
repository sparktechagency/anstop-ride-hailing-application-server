import ApiResponse from "../../utils/ApiResponse";
import asyncHandler from "../../utils/asyncHandler";
import { NotificationService } from "./notification.service";
import httpStatus from "http-status";



// const driverAccountVerificaitonNotification = asyncHandler(async (req, res) => {
// 	const { _id: userId } = req.user;
// 	await NotificationService.driverAccountVerificaitonNotification(userId.toString());
// 	res.status(httpStatus.OK).json(
// 		new ApiResponse({
// 			statusCode: httpStatus.OK,
// 			message:
// 				"Driver account verification notification sent successfully",
// 			data: null,
// 		})
// 	);
// });


const getAllNotifications = asyncHandler(async (req, res) => {
	const { _id: userId } = req.user;
	const query = req.validatedData.query;

	const options = {
		page: query.page,
		limit: query.limit,
		sortBy: query.sortBy,
		sortOrder: query.sortOrder,
		
	}

	const notifications = await NotificationService.getNotifications(userId, options);
	res.status(httpStatus.OK).json(
		new ApiResponse({
			statusCode: httpStatus.OK,
			message: "Notifications fetched successfully",
			data: notifications.results,
			meta: notifications.meta,
		})
	);
});

export const NotificationControllers = {
	getAllNotifications
	// driverAccountVerificaitonNotification,
};
