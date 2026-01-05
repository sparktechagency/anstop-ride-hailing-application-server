import parsePhoneNumberFromString, {
	isValidPhoneNumber,
} from "libphonenumber-js";
import { z } from "zod";
import { Roles } from "../../shared/shared.interface";
import { languagePreferenceValidationSchema } from "../../shared/shared.validation";

export const phoneNumberValidationSchema = z
	.string({ required_error: "Phone number is required" })
	.trim()
	.length(14, "Phone number must be exactly 14 characters long");
// .refine(
// 	(phoneNumber) => {
// 		try {
// 			const parsed = parsePhoneNumberFromString(phoneNumber);
// 			return (
// 				parsed &&
// 				isValidPhoneNumber(phoneNumber) &&
// 				parsed.isValid() &&
// 				(parsed.country === "US" || parsed.country === "CA")
// 			);
// 		} catch {
// 			return false;
// 		}
// 	},
// 	{
// 		message:
// 			"Only US/Canada numbers allowed. Use E.164 format like +14165551234",
// 		path: ["phoneNumber"],
// 	}
// );

export const userRoleValidationSchema = z
	.enum(Roles, {
		errorMap: (issue) => {
			if (issue.code === "invalid_enum_value") {
				return {
					message: `"${issue.received}" is not a valid role. Role must be one of: Rider or Driver.`,
				};
			}
			return { message: "Invalid role." };
		},
	})
	.refine((role) => role === "Rider" || role === "Driver", {
		message: "Only 'Rider' or 'Driver' roles are allowed.",
	});

export const userRegistrationValidationSchema = z.object({
	phoneNumber: phoneNumberValidationSchema,
	role: userRoleValidationSchema,
});

export type TUserRegistration = z.infer<
	typeof userRegistrationValidationSchema
>;

export const optVerificationValidationSchema = z.object({
	otp: z.string().length(6, "OTP must be exactly 6 characters long"),
	phoneNumber: phoneNumberValidationSchema,
	role: userRoleValidationSchema,
});

export type TOptVerification = z.infer<typeof optVerificationValidationSchema>;

export const resendOTPValidationSchema = z.object({
	phoneNumber: phoneNumberValidationSchema,
	role: userRoleValidationSchema,
});

export type TResendOTP = z.infer<typeof resendOTPValidationSchema>;