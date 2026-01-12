// import { z } from "zod";
// import { TServiceType } from "../rideRequest/rideRequest.interface";
// import { driverOnboardingValidationSchema } from "./driver.validation";
// import { TPaginateOptions, TPaginateResult } from "../../types/paginate";
// import { Model } from "mongoose";

// type TRegionalInformation = {
// 	city: string;
// 	province: string;
// 	country: string;
// };

// type TVehicleInformation = {
// 	brand: string;
// 	model: string;
// 	manufactureYear: Date;
// 	color: string;
// 	plateNumber: string;
// };

// export const Country = ["US", "CA"] as const;
// type TCountry = "US" | "CA";

// export const USDocuments = [
// 	"U.S. Passport or Passport Card",
// 	"Permanent Resident Card (Green Card)",
// 	"Employment Authorization Document (EAD)",
// 	"Social Security Card (with restrictions)",
// 	"Driver’s License + Birth Certificate",
// 	"Driver’s License + Certificate of Naturalization",
// 	"U.S. Birth Certificate",
// 	"Certificate of U.S. Citizenship",
// 	"Tribal ID",
// ] as const;

// export const CADocuments = [
// 	"Canadian Passport",
// 	"Permanent Resident Card",
// 	"Canadian Citizenship Certificate",
// 	"Work Permit",
// 	"Social Insurance Number (SIN) Letter",
// 	"Provincial Driver’s License + Birth Certificate",
// 	"Immigration Document (IMM 1442 / IMM 1208 / IMM 5292)",
// ] as const;

// export type TUSDocumentType =
// 	| "U.S. Passport or Passport Card"
// 	| "Permanent Resident Card (Green Card)"
// 	| "Employment Authorization Document (EAD)"
// 	| "Social Security Card (with restrictions)"
// 	| "Driver’s License + Birth Certificate"
// 	| "Driver’s License + Certificate of Naturalization"
// 	| "U.S. Birth Certificate"
// 	| "Certificate of U.S. Citizenship"
// 	| "Tribal ID";

// export type TCADocumentType =
// 	| "Canadian Passport"
// 	| "Permanent Resident Card"
// 	| "Canadian Citizenship Certificate"
// 	| "Work Permit"
// 	| "Social Insurance Number (SIN) Letter"
// 	| "Provincial Driver’s License + Birth Certificate"
// 	| "Immigration Document (IMM 1442 / IMM 1208 / IMM 5292)";

// type TDocumentType<C extends TCountry> = C extends "US"
// 	? TUSDocumentType
// 	: C extends "CA"
// 		? TCADocumentType
// 		: never;

// type TVehicleDocuments = {
// 	vehicleImage: string;
// 	// vehicle registration image
// 	vehicleRegistrationImage: string;
// 	// vehicle inspection/ safety standard certificate image
// 	vehicleInspectionImage: string;
// 	// vehicle insurance image
// 	vehicleInsuranceImage: string;
// };

// export type TLocation = {
// 	type: "Point";
// 	coordinates: [number, number]; // longitude, latitude
// };

// export type TFcmTokenDetails = {
// 	fcmToken: string;
// };

// export type TDriver = {
// 	currentLocation: TLocation;
// 	regionalInformation: TRegionalInformation;
// 	serviceType: TServiceType;
// 	vehicleInformation: TVehicleInformation;
// 	// proof of work eligibility document info
// 	workEligibilityDocument: {
// 		documentType: TDocumentType<TCountry>;
// 		image: string;
// 	};
// 	vehicleDocuments: TVehicleDocuments;
// 	createdAt: Date;
// 	updatedAt: Date;
// };


// // export interface IDriverDocument extends TDriver, Omit<Document, "location"> {}

// export interface IDriverModel extends Model<TDriver> {
// 	paginate: (
// 		filter: object,
// 		options: TPaginateOptions
// 	) => Promise<TPaginateResult<TDriver>>;
// }



// // type definition by zod schema

// export type TDriverOnboarding = z.infer<
// 	typeof driverOnboardingValidationSchema
// >;