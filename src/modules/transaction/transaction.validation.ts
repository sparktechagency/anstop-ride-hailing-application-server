import { z } from "zod";
import { TRANSACTION_STATUS, TRANSACTION_TYPE } from "./transaction.constant";

const getAllTransationsSchema = z.object({
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

            startDate: z.string().optional(),
            endDate: z.string().optional(),
            search: z.string().optional(),
        })
        .strict(),
});

const createTransactionSchema = z.object({
    body: z.object({
        transactionId: z.string({
            required_error: "Transaction ID is required",
        }),
        amount: z.number({
            required_error: "Amount is required",
        }).optional(),
        accountNumber: z.string({
            required_error: "Account number is required",
        }).optional(),
        accountHolderName: z.string({
            required_error: "Account holder name is required",
        }).optional(),
        accountType: z.string({
            required_error: "Account type is required",
        }).optional(),
        bankName: z.string({
            required_error: "Bank name is required",
        }).optional(),
        type: z.enum([TRANSACTION_TYPE.DEPOSIT, TRANSACTION_TYPE.WITHDRAWAL, TRANSACTION_TYPE.RIDE_FARE, TRANSACTION_TYPE.RIDE_TIP], {
            required_error: "Type is required",
        }),
        status: z.enum([TRANSACTION_STATUS.COMPLETED, TRANSACTION_STATUS.FAILED], {
            required_error: "Status is required",
        }),
        userId: z.string({
            required_error: "User ID is required",
        }).optional(),
    })
})
    // if type is withdrawal then userId is required
    .refine(
        (data) => {
            if (data.body.type === "WITHDRAWAL" && !data.body.userId) {
                return false;
            }
            return true;
        },
        {
            message: "userId is required for withdrawal",
        }
    )

    // if type is not withdrawal then amount is required
    .refine(
        (data) => {
            if (data.body.type !== "WITHDRAWAL" && !data.body.amount) {
                return false;
            }
            return true;
        },
        {
            message: "Amount is required for non-withdrawal transactions",
        }
    )

const transactionDetailsSchema = z.object({
    params: z.object({
        transactionId: z.string({
            required_error: "Transaction ID is required",
        }),
    })
})

export const TransactionValidation = {
    getAllTransationsSchema,
    createTransactionSchema,
    transactionDetailsSchema
} 