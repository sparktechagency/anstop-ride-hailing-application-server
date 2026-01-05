// Validation schema and type for setting language preference
import { z } from "zod";

// shared to every module


// validation schema for mongodb object id

export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const usernameValidationSchema = z.object({
	firstName: z.string().trim().min(2, "First name is required"),
	lastName: z.string().trim().min(2, "Last name is required"),
})

// Validation schema and type for setting user address

export const coordinatesValidationSchema = z
	.array(z.number())
	.length(2, {
		message: "Coordinates must contain exactly [longitude, latitude]",
	})
	.refine(
		([lng, lat]) => lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90,
		{
			message:
				"Longitude must be between -180 and 180; Latitude must be between -90 and 90",
		}
	);

export const addressValidationSchema = z.object({
	addressLabel: z.string().trim().min(1, "Address label is required"),
	// validate coordinates
	coordinates: coordinatesValidationSchema,
})



// user and driver shared validation

export const languagePreferenceValidationSchema = z.object({
    languagePreference: z.enum(["en", "es", "fr"], {
        message: "Language preference must be one of 'en', 'es', or 'fr'",
    })
});


// Validation schema and type for setting user address

export const setUserAddressValidationSchema = z.object({
    address: addressValidationSchema
});

