import { Model, Types } from "mongoose"
import { TPaginateOptions, TPaginateResult } from "../../types/paginate";

export type TTransaction = {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    amount: number;
    accountNumber: string;
    accountName: string;
    bankName: string;
    type: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ITransactionModel extends Model<TTransaction> {
    paginate: (
        filter: object,
        options: TPaginateOptions
    ) => Promise<TPaginateResult<TTransaction>>;
}

