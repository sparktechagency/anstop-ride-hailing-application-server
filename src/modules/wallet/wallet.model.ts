import { Schema, model } from "mongoose";
import { IWallet, IWalletModel } from "./wallet.interface";
import paginate from "../../utils/paginate";

const WalletSchema = new Schema<IWallet, IWalletModel>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			unique: true,
		},
		balance: {
			type: Number,
			default: 0,
			min: 0,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

WalletSchema.plugin(paginate);

export const Wallet = model<IWallet, IWalletModel>("Wallet", WalletSchema);
