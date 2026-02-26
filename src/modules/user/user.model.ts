import { model, Schema } from "mongoose";
import {
	TUser,
	TRole,
	TLocation,
	TKYCDocument,
	TCarInformation,
	IUserModel,
} from "./user.interface";
import { GENDER, USER_ROLES, USER_STATUS } from "./user.constant";
import bcrypt from "bcrypt";
import paginate from "../../utils/paginate";

const coordinatesValidation = (coordinates: number[]) => {
	return (
		coordinates.length === 2 &&
		coordinates[0] >= -180 &&
		coordinates[0] <= 180 &&
		coordinates[1] >= -90 &&
		coordinates[1] <= 90
	);
};

export const locationScheama = new Schema<TLocation>({
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

const userSchema = new Schema<TUser, IUserModel>(
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
		rejectionReason: {
			type: String,
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
			type: {
				type: String,
				enum: ["Point"],
				default: "Point",
			},
			coordinates: {
				type: [Number],
				// required: true,
				default: [0, 0],
			},
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
		engagedRideId: {
			type: Schema.Types.ObjectId,
			ref: "RideRequest",
		},
		rating: {
			type: Number,
			default: 0,
		},
		totalReviews: {
			type: Number,
			default: 0,
		},
		balance: {
			type: Number,
			default: 0,
		},
		languagePreference: {
			type: String,
			default: "en",
		},
		totalRides: {
			type: Number,
			default: 0,
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

userSchema.plugin(paginate);

export const User = model<TUser, IUserModel>("User", userSchema);
