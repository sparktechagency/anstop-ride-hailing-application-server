import { User } from "../modules/user/user.model";
import ApiError from "../utils/ApiError";
import {
	TAddress,
	TLanguagePreferencePayload,
	TSetUserAddress,
	TUserData,
} from "./shared.interface";
import httpStatus from "http-status";

const setLanguagePreference = async (
	payload: TLanguagePreferencePayload,
	userData: TUserData
): Promise<{ success: boolean }> => {
	const { languagePreference } = payload;
	const { userId } = userData;

	let user = await User.findById(userId);

	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
	}

	user.languagePreference = languagePreference;
	await user.save();

	return { success: true };
};

const getLanguagePreference = async (userData: TUserData): Promise<string> => {
	const { userId } = userData;

	// Find the user by ID
	let user = await User.findById(userId);

	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
	}

	if (!user.languagePreference) {
		throw new ApiError(httpStatus.NOT_FOUND, "Language preference not set");
	}

	return user.languagePreference;
};

// const setUserAddress = async (
// 	payload: TSetUserAddress,
// 	userData: TUserData
// ): Promise<{ success: boolean }> => {
// 	const { address } = payload;
// 	const { userId, role } = userData;

// 	let user;

// 	// checking if the user exists
// 	if (role === "Rider") {
// 		user = await User.findById(userId);
// 	} else {
// 		user = await Driver.findById(userId);
// 	}

// 	if (!user) {
// 		throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
// 	}

// 	user.address = address as TAddress;

// 	// Only for Driver: update location safely
// 	if (role === "Driver" && user instanceof Driver) {
// 		if (!user.location) {
// 			user.location = {
// 				type: "Point",
// 				coordinates: [0, 0],
// 			};
// 		}

// 		user.location.coordinates = [
// 			address.coordinates[0],
// 			address.coordinates[1],
// 		];
// 	}

// 	await user.save();

// 	return { success: true };
// };

// const getUserAddress = async (userData: TUserData): Promise<TAddress> => {
// 	const { userId, role } = userData;

// 	let user;
// 	// checking if the user is exist
// 	if (role === "Rider") {
// 		user = await User.findById(userId);
// 	} else {
// 		user = await Driver.findById(userId);
// 	}

// 	if (!user) {
// 		throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
// 	}

// 	if (!user.address) {
// 		throw new ApiError(httpStatus.NOT_FOUND, "User address not set");
// 	}
// 	return user.address;
// };

export const SharedService = {
	setLanguagePreference,
	getLanguagePreference,
	// setUserAddress,
	// getUserAddress,
};
