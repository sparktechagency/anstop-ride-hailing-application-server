import { Model, Types } from "mongoose";
import { TPaginateOptions, TPaginateResult } from "../../types/paginate";



export interface IWallet {
	_id: Types.ObjectId;
	user: Types.ObjectId;
	balance: number;
	createdAt?: Date;
	updatedAt?: Date;
}


export interface IWalletModel extends Model<IWallet> {
	paginate: (
		filter: object,
		options: TPaginateOptions
	) => Promise<TPaginateResult<IWallet>>;
}

