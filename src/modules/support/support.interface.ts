import { Model, Types } from "mongoose";
import { SUPPORT_TYPE } from "./support.constant";
import { TTransaction } from "../transaction/transaction.interface";
import { TPaginateOptions, TPaginateResult } from "../../types/paginate";

type TSupportStatus = typeof SUPPORT_TYPE[keyof typeof SUPPORT_TYPE];

export interface TSupport {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    subject: string;
    message: string;
    status: TSupportStatus;
    createdAt: Date;
    updatedAt: Date;
}


export interface ISupportModel extends Model<TSupport> {
    paginate: (
        filter: object,
        options: TPaginateOptions
    ) => Promise<TPaginateResult<TSupport>>;
}
