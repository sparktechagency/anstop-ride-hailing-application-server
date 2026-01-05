import { z } from "zod";

export const addTokenValidationSchema = z.object({
    fcmToken: z.string().min(1, "Token is required"),
})