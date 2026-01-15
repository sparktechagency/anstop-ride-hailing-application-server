import { Types } from "mongoose";
import { INotification } from "./notification.interface";
import {Notification} from "./notification.model";
import { Message } from "firebase-admin/lib/messaging/messaging-api";
import { TPaginateOptions } from "../../types/paginate";
// import { Message, getmessaging } from "firebase-admin/lib/messaging/messaging-api";

const createNotification = async (payload: INotification) => {
    const notification = await Notification.create(payload);
    return notification;
}

const getNotifications = async(userId: Types.ObjectId, options: TPaginateOptions) => {

	options.select = "title description icon createdAt"

    const notifications = await Notification.paginate({userId}, options)
    return notifications;
}

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
		// const response = await getmessaging().send(message);

		// console.log("Successfully sent message:", response);
	} catch (error) {
		console.log("Error sending message:", error);
	}
};

// const driverAccountVerificaitonNotification = async (driverId: string) => {
// 	const driver = await Rider.findById(driverId)
// 		.lean()
// 		.select("username regionalInformation");

// 	if (!driver) {
// 		throw new ApiError(httpStatus.NOT_FOUND, "Driver not found");
// 	}

// 	const admin = await Admin.findOne({ role: "Admin" })
// 		.lean()
// 		.select("fcmTokenDetails");

// 	if (!admin) {
// 		throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");
// 	}

// 	const message: Message = {
// 		notification: {
// 			// <-- Add this notification object
// 			title: "New Driver Account Request",
// 			body: "A new driver account request has been made. Please check and verify it.",
// 		},
// 		// data: {
// 		// 	username: `${driver?.username?.firstName} ${driver.username?.lastName}`,
// 		// 	regionalInformation: `From ${driver?.regionalInformation?.city}`,
// 		// },
// 		token: admin.fcmTokenDetails.fcmToken,
// 	};

// 	// Send a message to the device corresponding to the provided
// 	// registration token.
// 	const response = await getMessaging().send(message);

// 	if (!response) {
// 		throw new ApiError(
// 			httpStatus.INTERNAL_SERVER_ERROR,
// 			"Failed to send notification"
// 		);
// 	}

// 	return true;
// };



export const NotificationService = {
	onSignup,
	// registerUserDevice,
	// driverAccountVerificaitonNotification,
	getNotifications
};
