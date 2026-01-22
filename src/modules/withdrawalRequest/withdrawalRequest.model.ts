import { Schema, model } from "mongoose";
import paginate from "../../utils/paginate";
import { IWithdrawalRequest, IWithdrawalRequestModel } from "./withdrawalRequest.interface";
import { WITHDRAWAL_STATUS } from "./withdrawalRequest.constant";



const WithdrawalRequestSchema = new Schema<
	IWithdrawalRequest,
	IWithdrawalRequestModel
>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		amount: {
			type: Number,
			required: true,
			min: 100,
		},
		status: {
			type: String,
			enum: Object.values(WITHDRAWAL_STATUS),
			default: WITHDRAWAL_STATUS.PENDING,
		},

		bankName: {
			type: String,
			trim: true,
			required: true,
		},

		accountNumber: {
			type: String,
			trim: true,
			required: true,
		},

		accountType: {
			type: String,
			trim: true,
		},
		accountHolderName:{
			type: String,
			trim: true,
		},
		 rejectReason: {
			type: String,
			trim: true,
		 }
	},
	{
		timestamps: true,
	}
);



WithdrawalRequestSchema.plugin(paginate);

export const WithdrawalRequest = model<
	IWithdrawalRequest,
	IWithdrawalRequestModel
>("WithdrawalRequest", WithdrawalRequestSchema);
