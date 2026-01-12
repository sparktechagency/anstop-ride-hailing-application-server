import { model, Schema } from "mongoose";
import {
	TUser,
	TRole,
	TLocation,
	TKYCDocument,
	TCarInformation,
} from "./user.interface";
import { GENDER, USER_ROLES, USER_STATUS } from "./user.constant";
import bcrypt from "bcrypt";

const coordinatesValidation = (coordinates: number[]) => {
	return (
		coordinates.length === 2 &&
		coordinates[0] >= -180 &&
		coordinates[0] <= 180 &&
		coordinates[1] >= -90 &&
		coordinates[1] <= 90
	);
};

const locationScheama = new Schema<TLocation>({
	name: {
		type: String,
	},
	coordinates: {
		type: [Number],
		validate: {
			validator: function (coordinates: number[]) {
				return coordinatesValidation(coordinates);
			},
			message:
				"Coordinates must be valid [longitude, latitude] and within the range of -180 to 180 for longitude and -90 to 90 for latitude",
		},
	},
});

const kycDocumentSchema = new Schema<TKYCDocument>({
	number: {
		type: String,
	},
	frontPicture: {
		type: String,
	},
	backPicture: {
		type: String,
	},
});

const carInformationSchema = new Schema<TCarInformation>({
	brand: {
		type: String,
	},
	model: {
		type: String,
	},
	yearOfManufacture: {
		type: Date,
	},
	licensePlate: {
		number: {
			type: String,
		},
		picture: {
			type: String,
		},
	},
	registrationCertificate: {
		number: {
			type: String,
		},
		fronPicture: {
			type: String,
		},
		backPicture: {
			type: String,
		},
	},
});

const userSchema = new Schema<TUser>(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		phoneNumber: {
			type: String,
		},
		password: {
			type: String,
			required: true,
		},
		avatar: {
			type: String,
		},
		role: {
			type: [String],
			enum: Object.values(USER_ROLES),
			required: true,
		},
		status: {
			type: String,
			enum: Object.values(USER_STATUS),
			default: "PENDING",
		},
		homeLocation: locationScheama,
		workLocation: locationScheama,
		bookMarks: [locationScheama],
		dateOfBirth: {
			type: Date,
		},
		gender: {
			type: String,
			enum: Object.values(GENDER),
		},
		nid: kycDocumentSchema,
		drivingLicense: kycDocumentSchema,
		carInformation: carInformationSchema,
		profilePicture: {
			type: String,
		},
		location: {
			coordinates: [Number],
		},
		locationName: {
			type: String,
		},
		fcmToken:{
			type: String,
			default: ""
		},
		isOnline: {
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
		address: {
			type: String,
		},
		isOnboarded: {
			type: Boolean,
			default: false,
		},
		isEmailVerified: {
			type: Boolean,
			default: false,
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

userSchema.index({ location: "2dsphere" });


userSchema.pre("save", async function (next) {
	const user = this;

	if (!user.isModified("password")) return next();

	try {
		console.log("Hashing password before saving user...", user);
		const salt = await bcrypt.genSalt(
			Number(process.env.BCRYPT_SALT_ROUNDS)
		);
		user.password = await bcrypt.hash(user.password, salt);
		next();
	} catch (err) {
		next(err as Error);
	}
});

export const User = model<TUser>("User", userSchema);
