import ApiError from "../../utils/ApiError";
import { User } from "../user/user.model";
import httpStatus from "http-status";
import { USER_ROLES } from "../user/user.constant";
import { TOnboardDriverDto } from "./driver.dto";
import { Types } from "mongoose";

const onboardDriver = async (
	userId: Types.ObjectId,
	payload: TOnboardDriverDto
): Promise<void> => {
	const {
		nid,
		drivingLicense,
		carInformation,
		profilePicture,
		dateOfBirth,
		address,
		gender,
	} = payload;

	const user = await User.findById(userId).select("_id isOnboarded role");

	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "Driver not found");
	}

	if (user.isOnboarded) {

		const hasDriverRole = user.role.includes(USER_ROLES.DRIVER)

		if(!hasDriverRole){
			user.role.push(USER_ROLES.DRIVER)
			await user.save()
		}

		throw new ApiError(
			httpStatus.BAD_REQUEST,
			"Driver is already onboarded"
		);

	}

	user.isOnboarded = true;
	const hasDriverRole = user.role.includes(USER_ROLES.DRIVER)
	if(!hasDriverRole){
		user.role.push(USER_ROLES.DRIVER)
	}
	user.nid = nid;
	user.drivingLicense = drivingLicense;
	user.carInformation = carInformation;
	user.profilePicture = profilePicture;
	user.dateOfBirth = dateOfBirth;
	user.address = address;
	user.gender = gender;
	await user.save();

	
};


const checkOnboardingStatus = async (userId: Types.ObjectId) => {
	const user = await User.findById(userId).select("_id isOnboarded");
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "Driver not found");
	}
	return user
};

export const DriverService = {
	onboardDriver,
	checkOnboardingStatus,
};
