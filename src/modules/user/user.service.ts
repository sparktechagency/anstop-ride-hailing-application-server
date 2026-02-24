import { ClientSession, Types } from "mongoose";
import ApiError from "../../utils/ApiError";
import { User } from "./user.model";
import httpStatus from "http-status";
import { merge } from "lodash";
import { TLocation, TStatus, TUser } from "./user.interface";
import { TChangeUserStatusDto, TGetDriverDetailsDto, TSaveAddressDto, TSaveAddressQuery, TUpdateProfileDto } from "./user.dto";
import { locationExists } from "./user.utils";
import { TPaginateOptions } from "../../types/paginate";
import { USER_ROLES } from "./user.constant";



const setFcmToken = async (userId: Types.ObjectId, fcmToken: string) => {
	const user = await getUser({ _id: userId });
	user.fcmToken = fcmToken;
	await user.save();
};

const saveAddress = async (userId: Types.ObjectId, payload: TSaveAddressDto, query: TSaveAddressQuery) => {

	const user = await User.findById(userId);

	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "User not found");
	}

	if (query.type === "HOME") {
		if (locationExists(user.homeLocation, payload)) {
			throw new ApiError(httpStatus.BAD_REQUEST, "Home location already exists");
		}
		user.homeLocation = { name: payload.name, coordinates: [payload.longitude, payload.latitude] };

	} else if (query.type === "WORK") {
		if (locationExists(user.workLocation, payload)) {
			throw new ApiError(httpStatus.BAD_REQUEST, "Work location already exists");
		}
		user.workLocation = { name: payload.name, coordinates: [payload.longitude, payload.latitude] };

	} else if (query.type === "BOOKMARK") {
		if (user.bookMarks.some(b => locationExists(b, payload))) {
			throw new ApiError(httpStatus.BAD_REQUEST, "Bookmark already exists");
		}
		user.bookMarks.push({ name: payload.name, coordinates: [payload.longitude, payload.latitude] });
	}

	await user.save();
}

const getSavedAddress = async (userId: Types.ObjectId, query: TSaveAddressQuery) => {
	const user = await User.findById(userId).select("homeLocation workLocation bookMarks")

	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "user not found")
	}

	if (query.type === "BOOKMARK") {
		return user.bookMarks;
	} else if (query.type === "HOME") {
		return user.homeLocation
	} else if (query.type === "WORK") {
		return user.workLocation
	} else {
		return user;
	}
}

const getMyProfile = async (userId: Types.ObjectId) => {
	const user = await User.findById(userId).select("name email profilePicture phoneNumber address location locationName role")
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "User not found")
	}
	return user;
}

const updateProfile = async (userId: Types.ObjectId, payload: TUpdateProfileDto) => {
	const user = await User.findById(userId);
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "User not found");
	}

	if (payload.name) {
		user.name = payload.name;
	}
	if (payload.email) {
		user.email = payload.email;
	}
	if (payload.phoneNumber) {
		user.phoneNumber = payload.phoneNumber;
	}
	if (payload.address) {
		user.address = payload.address;
	}
	if (payload.profilePicture) {
		user.profilePicture = payload.profilePicture;
	}
	await user.save();
	return true;
}

const getBalance = async (userId: Types.ObjectId) => {
	const user = await User.findById(userId).lean().select("balance");
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "User not found");
	}
	return user;
}

const getAllUsers = async (filter: Record<string, any>, options: TPaginateOptions) => {
	options.select = "name email profilePicture phoneNumber address status role createdAt"

	console.log("filter", filter);
	console.log("options", options);

	const paginationResults = await User.paginate(filter, options)

	const totalUsers = await User.countDocuments(filter)
	
	return {paginationResults, totalUsers}
}

const changeUserStatus = async (payload: TChangeUserStatusDto) => {
	const user = await User.findById(payload.userId);
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "User not found");
	}

	if(user.status === payload.status){
		throw new ApiError(httpStatus.BAD_REQUEST, `${user.name} is already ${payload.status}`)
	}
	user.status = payload.status;	
	await user.save();
	return true;
}

const getDriverDetails = async(payload: TGetDriverDetailsDto) => {
	const user = await User.findById(payload.userId).select("name email profilePicture phoneNumber address status role createdAt dateOfBirth gender nid drivingLicense carInformation isOnboarded");
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "User not found");
	}

	if(!user.role.includes(USER_ROLES.DRIVER)){
		throw new ApiError(httpStatus.BAD_REQUEST, "User is not a driver");
	}
	

	if(!user.isOnboarded){
		throw new ApiError(httpStatus.BAD_REQUEST, "User is not onboarded");
	}

	return user;
}

export const UserServices = {
	setFcmToken,
	saveAddress,
	getSavedAddress,
	updateProfile,
	getMyProfile,
	getBalance,
	getAllUsers,
	changeUserStatus,
	getDriverDetails
}



// internal apis

const getUser = async (payload: Partial<TUser>) => {
	const user = await User.findOne(payload);
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "User not found");
	}
	if (user.isDeleted) {
		throw new ApiError(httpStatus.NOT_FOUND, "User not found");
	}
	return user;
};

const createUser = async (payload: Partial<TUser>, session?: ClientSession) => {
	const user = new User(payload);
	await user.save({ session });
	return user;
};

const updateUser = async (
	userId: Types.ObjectId,
	payload: Partial<TUser>,
	session?: ClientSession
) => {
	const user = await getUser({ _id: new Types.ObjectId(userId) });

	merge(user, payload);

	await user.save({ session });

	return user;
};

export const UserInternalApi = {
	getUser,
	createUser,
	updateUser,
};
