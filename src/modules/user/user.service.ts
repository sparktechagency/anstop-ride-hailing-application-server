import { ClientSession, Types } from "mongoose";
import ApiError from "../../utils/ApiError";
import { User } from "./user.model";
import httpStatus from "http-status";
import { merge } from "lodash";
import { TUser } from "./user.interface";

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
