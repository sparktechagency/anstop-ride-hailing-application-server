import { z } from "zod";
import { WITHDRAWAL_STATUS } from "./withdrawalRequest.constant";

const createSchema = z.object({
    body: z.object({
        amount: z.number().min(100),
        bankName: z.string().min(3),
        accountNumber: z.string().min(3),
        routingNumber: z.string().optional(),
        accountHolderName: z.string().optional(),
        accountType: z.string().optional(),
    })
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
            status: z.enum([WITHDRAWAL_STATUS.PENDING, WITHDRAWAL_STATUS.COMPLETED, WITHDRAWAL_STATUS.REJECTED]).optional(),
        })
        .strict()
});

const rejectSchema = z.object({
    body: z.object({
        rejectReason: z.string().min(3),
        requestId: z.string().min(3),
    })
})

export const withdrawalRequestValidation = {
    createSchema,
    getAllSchema,
    rejectSchema
}