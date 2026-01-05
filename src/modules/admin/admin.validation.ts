import { z } from "zod";

export const adminLoginValidationSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
})

export type TAdminLogin = z.infer<typeof adminLoginValidationSchema>

export const adminForgotPasswordValidationSchema = z.object({
    email: z.string().email("Invalid email format"),
})

export type TAdminForgotPassword = z.infer<typeof adminForgotPasswordValidationSchema>


export const adminResetPasswordValidationSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
})

export type TAdminResetPassword = z.infer<typeof adminResetPasswordValidationSchema>