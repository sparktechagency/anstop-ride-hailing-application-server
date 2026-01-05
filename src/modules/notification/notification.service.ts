import { getMessaging, Message } from "firebase-admin/messaging";
import { User } from "../user/user.model";
import { TAddTokenPayload } from "./notification.interface";
import ApiError from "../../utils/ApiError";
import httpStatus from "http-status";
import { Driver } from "../driver/driver.model";
import { GetUserByIdAndRole } from "../../utils/GetUserByIdAndRole";
import { TRoles } from "../../shared/shared.interface";
import { Admin } from "../admin/admin.model";

const registerUserDevice = async (
	userId: string,
	role: TRoles,
	token: string
) => {
	const user = await GetUserByIdAndRole(userId, role);

	console.log("Logged in user", user);

	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "User not found");
	}

	console.log(user);

	// user.fcmTokenDetails.fcmToken = token;
	await user.save();

	return true;
};

const onSignup = async (token: string) => {
	console.log("Token ", token);
	const registrationToken = token;

	const message: Message = {
		notification: {
			// <-- Add this notification object
			title: "New Update!",
			body: "Your score is 850, and time is 2:45.",
		},
		data: {
			score: "850",
			time: "2:45",
		},
		token: registrationToken,
	};

	// Send a message to the device corresponding to the provided
	// registration token.
	try {
		const response = await getMessaging().send(message);

		console.log("Successfully sent message:", response);
	} catch (error) {
		console.log("Error sending message:", error);
	}
};

const driverAccountVerificaitonNotification = async (driverId: string) => {
	const driver = await Driver.findById(driverId)
		.lean()
		.select("username regionalInformation");

	if (!driver) {
		throw new ApiError(httpStatus.NOT_FOUND, "Driver not found");
	}

	const admin = await Admin.findOne({ role: "Admin" })
		.lean()
		.select("fcmTokenDetails");

	if (!admin) {
		throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");
	}

	const message: Message = {
		notification: {
			// <-- Add this notification object
			title: "New Driver Account Request",
			body: "A new driver account request has been made. Please check and verify it.",
		},
		// data: {
		// 	username: `${driver?.username?.firstName} ${driver.username?.lastName}`,
		// 	regionalInformation: `From ${driver?.regionalInformation?.city}`,
		// },
		token: admin.fcmTokenDetails.fcmToken,
	};

	// Send a message to the device corresponding to the provided
	// registration token.
	const response = await getMessaging().send(message);

	if (!response) {
		throw new ApiError(
			httpStatus.INTERNAL_SERVER_ERROR,
			"Failed to send notification"
		);
	}

	return true;
};



export const NotificationService = {
	onSignup,
	registerUserDevice,
	driverAccountVerificaitonNotification,
};
