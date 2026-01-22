import z from "zod";
import { USER_ROLES } from "../user/user.constant";
import { OTP_TYPE } from "../otpToken/otpToken.constant";

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
	.enum([USER_ROLES.RIDER, USER_ROLES.DRIVER], {
		errorMap: (issue) => {
			if (issue.code === "invalid_enum_value") {
				return {
					message: `"${issue.received}" is not a valid role. Role must be one of: Rider or Driver.`,
				};
			}
			return { message: "Invalid role." };
		},
	})
	.refine((role) => role === USER_ROLES.RIDER || role === USER_ROLES.DRIVER, {
		message: "Only 'Rider' or 'Driver' roles are allowed.",
	});

const SignUpScheam = z.object({
	body: z.object({
		name: z
			.string({ required_error: "Name is required" })
			.trim()
			.nonempty({ message: "Name is required" }),
		email: z.string({ required_error: "Email is required" }).email(),
		role: userRoleValidationSchema,
		password: z
			.string({ required_error: "Password is required" })
			.min(6, { message: "Password must be at least 6 characters long" }),
	}).strict(),
});

const SignInSchema = z.object({
	body: z.object({
		email: z.string({ required_error: "Email is required" }).email(),
		password: z
			.string({ required_error: "Password is required" })
			.min(6, { message: "Password must be at least 6 characters long" }),
	}),
});

const OtpVerificationSchema = z.object({
	body: z.object({
		otp: z.string().length(6, "OTP must be exactly 6 characters long"),
		email: z.string({ required_error: "Email is required" }).email(),
		type: z.enum([OTP_TYPE.EMAIL_VERIFICATION, OTP_TYPE.PASSWORD_RESET], {
			errorMap: (issue) => {
				if (issue.code === "invalid_enum_value") {
					return {
						message: `"${issue.received}" is not a valid type. Type must be one of: ${OTP_TYPE.EMAIL_VERIFICATION} or ${OTP_TYPE.PASSWORD_RESET}.`,
					};
				}
				return { message: "Invalid type." };
			},
		}),
	})
});


const ResendOtpSchema = z.object({
	body: z.object({
		email: z.string({ required_error: "Email is required" }).email(),
		type: z.enum([OTP_TYPE.EMAIL_VERIFICATION, OTP_TYPE.PASSWORD_RESET]),
	})
});

const ForgotPasswordSchema = z.object({
	body: z.object({
		email: z.string({ required_error: "Email is required" }).email(),
	})
});

const ResetPasswordSchema = z.object({
	body: z.object({
		password: z
			.string({ required_error: "Password is required" })
			.min(6, { message: "Password must be at least 6 characters long" }),
	})
});

const ChangePasswordSchema = z.object({
	body: z.object({
		currentPassword: z
			.string({ required_error: "Current Password is required" })
			.min(6, { message: "Current Password must be at least 6 characters long" }),
		newPassword: z
			.string({ required_error: "New Password is required" })
			.min(6, { message: "New Password must be at least 6 characters long" }),
		confirmPassword: z.string().min(6, {message: "Confirm password must be at least 6 character long"})
	})
	// confirm password must be same as new password
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Confirm password must be same as new password",
	})
});
	

export const AuthValidation = {
	SignUpScheam,
	SignInSchema,
	OtpVerificationSchema,
	ResendOtpSchema,
	ResetPasswordSchema,
	ChangePasswordSchema,
	ForgotPasswordSchema,
}