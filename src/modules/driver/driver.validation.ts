// driver.validation.ts
import { z } from "zod";
import { CADocuments, Country, TCADocumentType, TUSDocumentType, USDocuments } from "./driver.interface";
import { SERVICETYPES } from "../rideRequest/rideRequest.interface";
import { serviceTypeValidationSchema } from "../rideRequest/rideRequestValidation";
import { usernameValidationSchema } from "../../shared/shared.validation";

const countryValidationSchema = z.enum(Country, {
	errorMap: (issue) => {
		if (issue.code === "invalid_enum_value") {
			return {
				message: `"${issue.received}" is not a valid country. Country must be one of: ${Country.join(", ")}`,
			};
		}
		return { message: "Invalid country." };
	},
});

const regionalInformationValidationSchema = z.object({
	province: z.string().trim().min(1, "Province is required"),
	city: z.string().trim().min(1, "City is required"),
	country: countryValidationSchema,
});

const vehicleDocumentsValidationSchema = z.object({
	vehicleImage: z.string().url("Vehicle image must be a valid URL"),
	vehicleRegistrationImage: z
		.string()
		.url("Vehicle registration image must be a valid URL"),
	vehicleInspectionImage: z
		.string()
		.url("Vehicle inspection image must be a valid URL"),
	vehicleInsuranceImage: z
		.string()
		.url("Vehicle insurance image must be a valid URL"),
});

const workEligibilityDocumentValidationSchema = z.object({
	documentType: z.union([
		z.enum(USDocuments),
		z.enum(CADocuments)
	]),
	image: z.string().url("Document image must be a valid URL"),
})

const vehicleInformationValidationSchema = z
	.object({
		brand: z.string().trim().min(1, "Vehicle brand is required"),
		model: z.string().trim().min(1, "Vehicle model is required"),
		manufactureYear: z.coerce.date(),
		color: z.string().trim().min(1, "Vehicle color is required"),
		plateNumber: z
			.string()
			.trim()
			.min(1, "Vehicle plate number is required")
			.regex(/^[A-Z0-9\-\s]+$/i, "Invalid plate number format"),
	})
	.refine(
		(data) => {
			const { manufactureYear } = data;
			const currentYear = new Date().getFullYear();
			const vehicleAge = currentYear - manufactureYear.getFullYear();
			return vehicleAge <= 20; // Example: vehicles shouldn't be older than 20 years
		},
		{
			message: "Vehicle is too old for service",
			path: ["manufactureYear"],
		}
	)
	.refine(
		// date must be in the past
		(data) => {
			const { manufactureYear } = data;
			return manufactureYear <= new Date();
		},
		{
			message: "Vehicle manufacture year must be in the past",
			path: ["manufactureYear"],
		}
	);

// Validation schema for onboarding a driver
export const driverOnboardingValidationSchema = z.object({
	username: usernameValidationSchema,
	email: z.string().email("Invalid email format"),
	avatar: z.string().url("Avatar must be a valid URL"),
	regionalInformation: regionalInformationValidationSchema,
	serviceType: serviceTypeValidationSchema,
	vehicleInformation: vehicleInformationValidationSchema,
	workEligibilityDocument: workEligibilityDocumentValidationSchema,
	// Vehicle document info matching interface structure
	vehicleDocuments: vehicleDocumentsValidationSchema,
})
.refine(
	// validate work eligibility document type according to country
	(data) => {
		const { regionalInformation: { country }, workEligibilityDocument: { documentType } } = data;
		if (country === "US" && !USDocuments.includes(documentType as TUSDocumentType)) {
			return false;
		}
		if (country === "CA" && !CADocuments.includes(documentType as TCADocumentType)) {
			return false;
		}
		return true;
	},
	{
		message: "Invalid document type for selected country",
		path: ["workEligibilityDocument.documentType"],
	}
)
