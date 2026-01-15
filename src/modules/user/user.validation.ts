import { z } from "zod";
import {  usernameValidationSchema } from "../../shared/shared.validation";
import { SAVED_ADDRESS_TYPE } from "./user.constant";


// Validation schema and type for onboarding a user

const onboardUserValidationSchema = z.object({
	username: usernameValidationSchema,
	email: z.string().email("Invalid email format"),
});

const setFcmTokenSchema = z.object({
	body: z.object({
		fcmToken: z.string().min(1, "FCM token is required"),
	})
});

const saveAddressSchema = z.object({
	body: z.object({
		name: z.string().min(1, "Name is required"),
		latitude: z.number().min(-90).max(90, "Invalid latitude"),
		longitude: z.number().min(-180).max(180, "Invalid longitude"),
	}).strict(),
	query: z.object({
		type: z.enum([SAVED_ADDRESS_TYPE.HOME, SAVED_ADDRESS_TYPE.WORK, SAVED_ADDRESS_TYPE.BOOKMARK], {
			errorMap: () => ({
				message: `Invalid address type. Must be one of ${Object.values(SAVED_ADDRESS_TYPE).join(", ")}`,
			}),
		}),
	}).strict()
})

const getAddressSchema = z.object({
	query: z.object({
		type: z.enum([SAVED_ADDRESS_TYPE.HOME, SAVED_ADDRESS_TYPE.WORK, SAVED_ADDRESS_TYPE.BOOKMARK], {
			errorMap: () => ({
				message: `Invalid address type. Must be one of ${Object.values(SAVED_ADDRESS_TYPE).join(", ")}`,
			}),
		}).optional(),
	}).strict()
})

const setCurrentLocationSchema = z.object({
	body: z.object({
		name: z.string().min(1, "Name is required"),
		latitude: z.number().min(-90).max(90, "Invalid latitude"),
		longitude: z.number().min(-180).max(180, "Invalid longitude"),
	}).strict(),
})

const multipleFilesValidatonSchema = z
	.array(
		z.object({
			fieldname: z.string(),
			originalname: z.string().min(1),
			encoding: z.string(),
			mimetype: z
				.string()
				.refine(
					(mime) =>
						["image/jpeg", "image/png", "application/pdf"].includes(
							mime
						),
					"Only JPEG, PNG, and PDF files are allowed"
				),
			// size: z.number().max(10 * 1024 * 1024, "File too large"),
			filename: z.string().optional(),
			path: z.string().optional(),
		})
	)
	.min(1, "At least one file is required")
	.max(10, "Maximum 10 files allowed")
	// .refine(
	// 	(files) => files.every((file) => file.size <= 2 * 1024 * 1024),
	// 	"Each file must be smaller than 2MB"
	// )
	// .refine((files) => {
	// 	const totalSize = files.reduce((sum, file) => sum + file.size, 0);
	// 	return totalSize <= 10 * 1024 * 1024;
	// }, "Total file size cannot exceed 10MB");

export const uploadFilesSchema = z.object({
	files: multipleFilesValidatonSchema,
});

const updateProfileSchema = z.object({
	body: z.object({
		name: z.string().optional(),
		phoneNumber: z.string().optional(),
		email: z.string().email().optional(),
		address: z.string().optional(),
		profilePicture: z.string().url().optional(),
	})
	// at least one filed is requiered
	.refine((data) => data.name || data.phoneNumber || data.email || data.address || data.profilePicture, {
		message: "At least one field is required",
	})
})

export const UserValidation = {
    onboardUserValidationSchema,
    setFcmTokenSchema,
    saveAddressSchema,
	getAddressSchema,
	setCurrentLocationSchema,
	uploadFilesSchema,
	updateProfileSchema
}

