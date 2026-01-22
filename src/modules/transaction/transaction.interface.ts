import { Model, Types } from "mongoose"
import { TPaginateOptions, TPaginateResult } from "../../types/paginate";
import { TRANSACTION_STATUS, TRANSACTION_TYPE } from "./transaction.constant";

type TTransactionStatus = typeof TRANSACTION_STATUS[keyof typeof TRANSACTION_STATUS]
type TTransactionType = typeof TRANSACTION_TYPE[keyof typeof TRANSACTION_TYPE]

export type TTransaction = {
   _id: Types.ObjectId;
   riderId: Types.ObjectId;
   driverId: Types.ObjectId;
   amount: number;
   commissionRate: number;
   commissionAmount: number;
   driverEarningAmount: number;
   type: TTransactionType;
   status: TTransactionStatus;
   payoutDetails?: {
      accountNumber: string;
      accountHolderName: string;
      accountType: string;
      bankName: string;
   }
   createdAt: Date;
   updatedAt: Date;
}

export interface ITransactionModel extends Model<TTransaction> {
    paginate: (
        filter: object,
        options: TPaginateOptions
    ) => Promise<TPaginateResult<TTransaction>>;
}

