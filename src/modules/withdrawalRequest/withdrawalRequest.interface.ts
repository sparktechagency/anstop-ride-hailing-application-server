import { Model, Types } from "mongoose";
import { TPaginateOptions, TPaginateResult } from "../../types/paginate";
import { WITHDRAWAL_STATUS } from "./withdrawalRequest.constant";

export type WithdrawalStatus = typeof WITHDRAWAL_STATUS[keyof typeof WITHDRAWAL_STATUS]

export interface IWithdrawalRequest {
    _id?: Types.ObjectId;
    userId: Types.ObjectId;
    amount: number;
    status: WithdrawalStatus;
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
    accountType: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IWithdrawalRequestModel extends Model<IWithdrawalRequest> {
	paginate: (
		filter: object,
		options: TPaginateOptions
	) => Promise<TPaginateResult<IWithdrawalRequest>>;
}