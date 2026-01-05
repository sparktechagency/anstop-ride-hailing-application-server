import mongoose, { Types } from "mongoose";
import ApiError from "../../utils/ApiError";
import { User } from "../user/user.model";
import { TDriverOnboarding } from "./driver.interface";
import { Driver } from "./driver.model";
import httpStatus from "http-status";

export const onboardDriver = async (
	userId: Types.ObjectId,
	payload: TDriverOnboarding
): Promise<void> => {
	const {
		username,
		email,
		avatar,
		regionalInformation,
		serviceType,
		vehicleInformation,
		workEligibilityDocument,
		vehicleDocuments,
	} = payload;

	const user = await User.findById(userId).select("_id isOnboarded");

	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "Driver not found");
	}

	if (user.isOnboarded) {
		throw new ApiError(
			httpStatus.BAD_REQUEST,
			"Driver is already onboarded"
		);
	}

	const session = await mongoose.startSession();

	try {
		// performing mongodb transaction
		await session.withTransaction(async () => {
			user.username = username;
			user.email = email;
			user.avatar = avatar;
			user.isVerified = true;
			user.isOnboarded = true;
			await user.save({ session });

			// create Driver
			await Driver.create(
				{
					user: user._id,
					regionalInformation,
					serviceType,
					vehicleInformation,
					workEligibilityDocument,
					vehicleDocuments,
				},
				{ session }
			);
		});
	} catch (error) {
		console.error("Driver onboarding transaction failed:", error);
		throw new ApiError(
			httpStatus.INTERNAL_SERVER_ERROR,
			"Driver onboarding failed"
		);
	} finally {
		session.endSession();
	}
};

export const DriverService = {
	onboardDriver,
};
