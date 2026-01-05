import { Types } from "mongoose";

export interface IOTPToken {
    userId: Types.ObjectId;
    otp: string;
    expiresAt: Date;
    isValid: boolean;
    createdAt: Date;
    updatedAt: Date;
}
