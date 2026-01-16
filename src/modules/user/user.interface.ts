import { Types } from "mongoose";
import { GENDER, USER_ROLES, USER_STATUS } from "./user.constant";

// ROLE TYPE

export type TRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// USER STATUS

export type TStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

// USER GENDER
export type TGender = (typeof GENDER)[keyof typeof GENDER];

// TYPE OF NID and DRIVER LICENSE

export type TKYCDocument = {
	number: string;
	frontPicture: string;
	backPicture: string;
};

// type of car information

export type TCarInformation = {
	brand: string;
	model: string;
	yearOfManufacture: Date;
	licensePlate: {
		number: string;
		picture: string;
	};
	registrationCertificate: {
		number: string;
		frontPicture: string;
		backPicture: string;
	};
};

// TYPE OF LOCATION

export type TLocation = {
	name: string;
	coordinates: [number, number];
};

// For now we assume a user can have only one device
export type TFcmTokenDetails = {
	fcmToken: string;
};

export type TUser = {
	_id: Types.ObjectId;
	name: string;
	email: string;
	phoneNumber: string;
	password: string;
	role: TRole[];
	status: TStatus;
	homeLocation: TLocation;
	workLocation: TLocation;
	bookMarks: [TLocation];
	// DRIVER SPECIFIC PROPERTIES START
	dateOfBirth: Date;
	gender: TGender;
	nid: TKYCDocument;
	drivingLicense: TKYCDocument;
	carInformation: TCarInformation;
	profilePicture: string;
	// DRIVER SPECIFIC PROPERTIES END
	location: {
		type: "Point";
		coordinates: [number, number];
	};
	locationName: string;

	isOnline: boolean;
	isEngaged: boolean;
	engagedWith: Types.ObjectId;
	address: string;
	isEmailVerified: boolean;
	isOnboarded: boolean;
	fcmToken: string;
	languagePreference: string;
	rating: number;
	totalReviews: number;
	totalRides: number;
	balance: number;
	isDeleted: boolean;
	createdAt: Date;
	updatedAt: Date;
};

export interface IUserModel {
	// validate password using bcrypt
	validatePassword(password: string): Promise<boolean>;
}
