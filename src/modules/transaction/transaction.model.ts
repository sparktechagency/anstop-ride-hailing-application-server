import { model, Schema } from "mongoose";
import { ITransactionModel, TTransaction } from "./transaction.interface";
import paginate from "../../utils/paginate";
import { TRANSACTION_STATUS, TRANSACTION_TYPE } from "./transaction.constant";

const transactionSchema = new Schema<TTransaction, ITransactionModel>(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(TRANSACTION_TYPE),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TRANSACTION_STATUS),
      required: true,
    },
    payoutDetails: {
      accountNumber: {
        type: String,
      },
      accountHolderName: {
        type: String,
      },
      accountType: {
        type: String,
      },
      bankName: {
        type: String,
      },
    },
    rideId: {
      type: Schema.Types.ObjectId,
      ref: "Ride",
    },
  },
  {
    timestamps: true,
  }
);


transactionSchema.plugin(paginate)

export const Transaction = model<TTransaction, ITransactionModel>("Transaction", transactionSchema)