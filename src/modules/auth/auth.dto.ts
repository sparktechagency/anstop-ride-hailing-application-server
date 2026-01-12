import { z } from "zod";
import { AuthValidation } from "./auth.validation";


export type TUserSignUpDTO = z.infer<typeof AuthValidation.SignUpScheam>["body"];
export type TUserSignInDTO = z.infer<typeof AuthValidation.SignInSchema>["body"];
export type TOtpVerificationDTO = z.infer<typeof AuthValidation.OtpVerificationSchema>["body"];
export type TResendOtpDTO = z.infer<typeof AuthValidation.ResendOtpSchema>["body"];
export type TResetPasswordDTO = z.infer<typeof AuthValidation.ResetPasswordSchema>["body"];
export type TChangePasswordDTO = z.infer<typeof AuthValidation.ChangePasswordSchema>["body"];
export type TForgotPasswordDTO = z.infer<typeof AuthValidation.ForgotPasswordSchema>["body"];
