import { User } from "../user/user.model";
import { TGetMEResponse } from "./account.interface";
import ApiError from "../../utils/ApiError";
import httpStatus from 'http-status';

const getMe = async (userId: string) => {
	const user = await User.findById(userId)
		.select("username email phoneNumber avatar totalRides createdAt")
		.lean();
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND,"User not found");
	}
	const response = {
		_id: user._id,
		username: user.username,
		phoneNumber: user.phoneNumber,
		email: user.email,
		avatar: user.avatar,
		accountAge: new Date().getTime() - user.createdAt.getTime(),
	};
	return response;
};

export const AccountService = {
	getMe,
};
