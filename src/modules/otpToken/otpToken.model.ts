import { model, Schema } from "mongoose";
import { IOTPToken } from "./otpToken.interface";
import { config } from "../../config";
import bcrypt from "bcrypt";

const otpTokenSchema = new Schema<IOTPToken>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        otp: {
            type: String,
            required: true,
            trim: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        isValid: {
            type: Boolean,
            default: true, // Indicates if the OTP is valid or has been used
        },
    },
    { timestamps: true },
);

// // Index to automatically delete expired OTP tokens

// otpTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

otpTokenSchema.pre("save", async function (next) {
    if (!this.isModified("otp")) {
        return next();
    }
    this.otp = await bcrypt.hash(this.otp, Number(config.bcrypt_salt_rounds));
    next();
});

export const OTPToken = model<IOTPToken>("OTPToken", otpTokenSchema);
