import { Document, Model } from "mongoose";
import { TRoles, TUserName } from "../../shared/shared.interface";

export type TFcmTokenDetails = {
	fcmToken: string;
};

export type TAdmin = {
	username: TUserName;
	email: string;
	password: string;
	phoneNumber?: string;
	avatar?: string;
	role: TRoles;
	isVerified: boolean;
	isOnline: boolean;
	isDeleted: boolean;
	fcmTokenDetails: TFcmTokenDetails;
	createdAt: Date;
	updatedAt: Date;
};

export interface IAdminDocument extends TAdmin, Document {
	comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IAdminModel extends Model<IAdminDocument> {}
