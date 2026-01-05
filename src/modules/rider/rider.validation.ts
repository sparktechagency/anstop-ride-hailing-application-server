// validation schema and type for save address

import { z } from "zod";
import { addressValidationSchema, usernameValidationSchema } from "../../shared/shared.validation";
import { phoneNumberValidationSchema } from "../auth/auth.validation";

export const riderOnboardingValidationSchema = z.object({
	username: usernameValidationSchema,
	email: z.string().email("Invalid email format"),
});

export const saveAddressValidationSchema = z.object({
	title: z.string().trim().min(1, "Title is required"),
	address: addressValidationSchema,
});

// validation schema and type for add trusted contacts

export const addTrustedContactValidationSchema = z.object({
	phoneNumber: phoneNumberValidationSchema,
});
