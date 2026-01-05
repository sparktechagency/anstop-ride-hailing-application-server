import { z } from "zod";
import {  usernameValidationSchema } from "../../shared/shared.validation";


// Validation schema and type for onboarding a user

export const onboardUserValidationSchema = z.object({
	username: usernameValidationSchema,
	email: z.string().email("Invalid email format"),
});



