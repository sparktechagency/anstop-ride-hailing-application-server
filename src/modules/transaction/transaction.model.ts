import { model, Schema } from "mongoose";
import { ITransactionModel, TTransaction } from "./transaction.interface";
import paginate from "../../utils/paginate";
import { TRANSACTION_STATUS, TRANSACTION_TYPE } from "./transaction.constant";

const transactionSchema = new Schema<TTransaction, ITransactionModel>(
  {

    riderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    driverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    commissionRate: {
      type: Number, // %
      min: 0,
      max: 100,
    },

    commissionAmount: {
      type: Number, // actual system earning
      min: 0,
    },

    driverEarningAmount: {
      type: Number, // withdrawable earning
      min: 0,
    },

    type: {
      type: String,
      enum: Object.values(TRANSACTION_TYPE),
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(TRANSACTION_STATUS),
      required: true,
      index: true,
    },

    payoutDetails: {
      accountNumber: String,
      accountHolderName: String,
      accountType: String,
      bankName: String,
    },
  },
  {
    timestamps: true,
  }
);


transactionSchema.plugin(paginate)

export const Transaction = model<TTransaction, ITransactionModel>("Transaction", transactionSchema)