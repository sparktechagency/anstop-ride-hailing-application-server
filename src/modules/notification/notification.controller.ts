import ApiResponse from "../../utils/ApiResponse";
import asyncHandler from "../../utils/asyncHandler";
import { NotificationService } from "./notification.service";
import httpStatus from "http-status";

const registerUserDevice = asyncHandler(async (req, res) => {
	const { fcmToken: token } = req.body;
	const { _id: userId, role } = req.user;

	console.log("Route hit",req.user, req.body);

	await NotificationService.registerUserDevice(userId, role, token);
	res.status(httpStatus.OK).json(
		new ApiResponse({
			statusCode: httpStatus.OK,
			message: "Notificaton token added successfully",
			data: null,
		})
	);
});

const driverAccountVerificaitonNotification = asyncHandler(async (req, res) => {
	const { _id: userId } = req.user;
	await NotificationService.driverAccountVerificaitonNotification(userId);
	res.status(httpStatus.OK).json(
		new ApiResponse({
			statusCode: httpStatus.OK,
			message:
				"Driver account verification notification sent successfully",
			data: null,
		})
	);
});

export const NotificationControllers = {
	registerUserDevice,
	driverAccountVerificaitonNotification,
};
