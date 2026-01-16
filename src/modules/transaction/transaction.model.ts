import { model, Schema } from "mongoose";
import { ITransactionModel, TTransaction } from "./transaction.interface";
import paginate from "../../utils/paginate";
import { TRANSACTION_STATUS, TRANSACTION_TYPE } from "./transaction.constant";

const transactionSchema = new Schema<TTransaction, ITransactionModel>(
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
        accountHolderName: {
            type: String,
            required: true
        },
        accountType: {
            type: String,
            required: true
        },
        bankName: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: Object.values(TRANSACTION_TYPE),
            required: true
        },
        status: {
            type: String,
            enum: Object.values(TRANSACTION_STATUS),
            required: true
        }
    },
    {
        timestamps: true
    }
)

transactionSchema.plugin(paginate)

export const Transaction = model<TTransaction, ITransactionModel>("Transaction", transactionSchema)