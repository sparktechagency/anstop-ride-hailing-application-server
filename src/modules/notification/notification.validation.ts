import { z } from "zod";

export const addTokenValidationSchema = z.object({
    fcmToken: z.string().min(1, "Token is required"),
}).strict()


const getAllNotifications = z.object({
    query: z
        .object({
            page: z.coerce
                .number({
                    invalid_type_error: "Page must be a string",
                })
                .default(1),

            limit: z.coerce
                .number({
                    invalid_type_error: "Limit must be a string",
                })
                .default(10),

            sortBy: z
                .string({
                    invalid_type_error: "SortBy must be a string",
                })
                .default("createdAt"),

            sortOrder: z
                .enum(["asc", "desc"], {
                    invalid_type_error:
                        "Sort order must be either 'asc' or 'desc'",
                })
                .default("asc")
                .transform((val) => (val === "asc" ? 1 : -1)),
        })
        .strict(),
});

export const NotificationValidation = { addTokenValidationSchema, getAllNotifications };