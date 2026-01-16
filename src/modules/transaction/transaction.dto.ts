import { z } from "zod"
import { TransactionValidation } from "./transaction.validation"

export type TTransactionDTO = z.infer<typeof TransactionValidation.createTransactionSchema>["body"]