import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { IAdminModel, IAdminDocument } from "./admin.interface";
import { Roles } from "../../shared/shared.interface";
import { config } from "../../config";

const adminSchema = new Schema<IAdminDocument, IAdminModel>(
	{
		username: {
			firstName: {
				type: String,
				required: true,
				trim: true,
			},
			lastName: {
				type: String,
				required: true,
				trim: true,
			},
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			match: [/\S+@\S+\.\S+/, "Invalid email"],
		},
		password: {
			type: String,
			required: true,
			minlength: 6,

		},
		phoneNumber: String,
		avatar: String,
		role: {
			type: String,
			enum: Roles,
			default: "Admin",
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		isOnline: {
			type: Boolean,
			default: false,
		},
		fcmTokenDetails: {
			fcmToken: {
				type: String,
				default: "",
			},
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

// ✅ Hash password before save
adminSchema.pre("save", async function (next) {
	const admin = this as IAdminDocument;

	if (!admin.isModified("password")) return next();

	try {
		const salt = await bcrypt.genSalt(Number(config.bcrypt_salt_rounds));
		admin.password = await bcrypt.hash(admin.password, salt);
		next();
	} catch (err) {
		next(err as Error);
	}
});

// ✅ Compare password method (on document)
adminSchema.methods.comparePassword = async function (
	candidatePassword: string
): Promise<boolean> {
	return bcrypt.compare(candidatePassword, this.password);
};

export const Admin = model<IAdminDocument, IAdminModel>("Admin", adminSchema);
