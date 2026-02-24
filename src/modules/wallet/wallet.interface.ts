import { Model, Types } from "mongoose";
import { TPaginateOptions, TPaginateResult } from "../../types/paginate";
import { WalletConstant } from "./wallet.constant";

type TWalletType = typeof WalletConstant.WALLET_TYPE[keyof typeof WalletConstant.WALLET_TYPE];
type TWalletStatus = typeof WalletConstant.WALLET_STATUS[keyof typeof WalletConstant.WALLET_STATUS];



export interface IWallet {
	_id: Types.ObjectId;
	ownerId?: Types.ObjectId;
	type: TWalletType;
	status: TWalletStatus;
	balance: number;
	currency: string;
	createdAt?: Date;
	updatedAt?: Date;
}


export interface IWalletModel extends Model<IWallet> {
	paginate: (
		filter: object,
		options: TPaginateOptions
	) => Promise<TPaginateResult<IWallet>>;
}

