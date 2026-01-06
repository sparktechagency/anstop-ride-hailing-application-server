import { Types } from "mongoose";
import { OTPType } from "./otpToken.constant";

export interface IOTPToken {
	_id: Types.ObjectId;
	userId: Types.ObjectId;
	otp: string;
	type: OTPType;
	expiresAt: Date;
	isValid: boolean;
	createdAt: Date;
	updatedAt: Date;
}
