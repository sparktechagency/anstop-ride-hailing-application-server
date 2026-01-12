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


export const UserValidation = {
    onboardUserValidationSchema,
    setFcmTokenSchema,
    saveAddressSchema,
	getAddressSchema
}

