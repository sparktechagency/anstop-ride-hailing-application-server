import { z } from "zod";

const createSchema = z.object({
    body: z.object({
        subject: z.string().min(3, "Subject must be at least 3 characters long"),
        message: z.string().min(3, "Message must be at least 3 characters long"),
    }).strict()
})

const getAllSchema = z.object({
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
            search: z.string().optional(),
        })
        .strict(),
});

const updateSchema = z.object({
    params: z.object({
        id: z.string().optional(),
    }).strict(),
})

export const SupportValidation = {
    createSchema,
    getAllSchema,
    updateSchema
}