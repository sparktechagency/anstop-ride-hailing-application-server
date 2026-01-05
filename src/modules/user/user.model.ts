import { Schema, model } from "mongoose";
import { Roles, UserRoles } from "../../shared/shared.interface";
import { addressSchema, userNameSchema } from "../../shared/shared.model";
import paginate from "../../utils/paginate";
import { TUser } from "./user.interface";

const UserSchema = new Schema<TUser>(
	{
		username: userNameSchema,

		phoneNumber: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},

		email: {
			type: String,
			unique: true,
			trim: true,
		},

		avatar: {
			type: String,
			default: "",
		},

		role: {
			type: String,
			enum: Roles,
			default: UserRoles.Rider,
		},

		address: addressSchema,

		languagePreference: {
			type: String,
			enum: ["en", "es", "fr"],
			default: "en",
		},

		isVerified: {
			type: Boolean,
			default: false,
		},

		isOnboarded: {
			type: Boolean,
			default: false,
		},

		fcmTokenDetails: {
			fcmToken: {
				type: String,
				default: "",
			},
		},

		socketId: {
			type: String,
			default: "",
		},

		isOnline: {
			type: Boolean,
			default: false,
		},

		isDeleted: {
			type: Boolean,
			default: false,
		},

		isEngaged: {
			type: Boolean,
			default: false,
		},

		engagedWith: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{
		timestamps: true,
	}
);

UserSchema.plugin(paginate);

export const User = model<TUser>("User", UserSchema);
