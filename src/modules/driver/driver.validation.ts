// driver.validation.ts
import { z } from "zod";
import { GENDER } from "../user/user.constant";



const carInformationValidationSchema = z
	.object({
		brand: z.string().trim().min(1, "Vehicle name is required"),
		model: z.string().trim().min(1, "Vehicle model is required"),
		yearOfManufacture: z.coerce.date(),
		licensePlate: z.object({
			number: z.string().trim().min(1, "License plate number is required"),
			picture: z.string().url("License plate picture must be a valid URL"),
		}),
		registrationCertificate: z.object({
			number: z.string().trim().min(1, "Registration certificate number is required"),
			frontPicture: z.string().url("Registration certificate front picture must be a valid URL"),
			backPicture: z.string().url("Registration certificate back picture must be a valid URL"),
		}),
		
	})
	.refine(
		(data) => {
			const { yearOfManufacture } = data;
			const currentYear = new Date().getFullYear();
			const carAge = currentYear - yearOfManufacture.getFullYear();
			return carAge <= 20; // Example: vehicles shouldn't be older than 20 years
		},
		{
			message: "Vehicle is too old for service",
			path: ["yearOfManufacture"],
		}
	)
	.refine(
		// date must be in the past
		(data) => {
			const { yearOfManufacture } = data;
			return yearOfManufacture <= new Date();
		},
		{
			message: "Vehicle manufacture year must be in the past",
			path: ["yearOfManufacture"],
		}
	);



const nidAndDriverLicenseValidationSchema = z.object({
		number: z.string().trim().min(1, "NID number is required"),
		frontPicture: z.string().url("NID front picture must be a valid URL"),
		backPicture: z.string().url("NID back picture must be a valid URL"),
	})

// Validation schema for onboarding a driver
const OnboardingSchema = z.object({
	body: z.object({
		nid: nidAndDriverLicenseValidationSchema,
		drivingLicense: nidAndDriverLicenseValidationSchema,
		carInformation: carInformationValidationSchema,
		profilePicture: z.string().url("Profile picture must be a valid URL"),	
		dateOfBirth: z.coerce.date(),
		address: z.string().trim().min(1, "Address is required"),
		gender: z.enum([GENDER.FEMALE, GENDER.MALE, GENDER.OTHER], {
				errorMap: (issue) => {
					if (issue.code === "invalid_enum_value") {
						return {
							message: `"${issue.received}" is not a valid gender. Gender must be one of: ${GENDER.FEMALE}, ${GENDER.MALE}, ${GENDER.OTHER}`,
						};
					}
					return { message: "Invalid gender." };
				},
			}),
	})
})


export const DriverValidation = {
	OnboardingSchema,
}
