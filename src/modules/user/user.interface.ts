import { Types } from "mongoose";
import {
	TAddress,
	TLanguagePreference,
	TRoles,
	TUserName,
} from "../../shared/shared.interface";
import { z } from "zod";
import { onboardUserValidationSchema } from "./user.validation";

// For now we assume a user can have only one device
export type TFcmTokenDetails = {
	fcmToken: string;
};

export type TUser = {
	_id: Types.ObjectId;
	username: TUserName;
	phoneNumber: string;
	email: string;
	avatar: string;
	role: TRoles;
	address: TAddress;
	languagePreference: TLanguagePreference;
	isVerified: boolean;
	isOnboarded: boolean;
	isOnline: boolean;
	socketId: string;
	fcmTokenDetails: TFcmTokenDetails;
	isDeleted: boolean;
	isEngaged: boolean;
	engagedWith: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
};

export interface IUserModel {
	// validate password using bcrypt
	validatePassword(password: string): Promise<boolean>;
}


