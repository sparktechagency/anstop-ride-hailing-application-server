import { model, Schema } from "mongoose";
import { ITransactionModel, TTransaction } from "./transaction.interface";
import paginate from "../../utils/paginate";

const transactionSchema = new Schema<TTransaction>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        accountNumber: {
            type: String,
            required: true
        },
        accountName: {
            type: String,
            required: true
        },
        bankName: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

transactionSchema.plugin(paginate)

export const Transaction = model<TTransaction, ITransactionModel>("Transaction", transactionSchema)