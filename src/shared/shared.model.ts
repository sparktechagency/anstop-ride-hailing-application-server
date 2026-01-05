// username sub schema

import { TAddress, TUserName } from "./shared.interface";
import { Schema } from "mongoose";

export const userNameSchema = new Schema<TUserName>(
	{
		firstName: {
			type: String,
			required: true,
			trim: true,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{
		_id: false,
	}
);

export const addressSchema = new Schema<TAddress>(
	{
		addressLabel: {
			type: String,
			required: true,
		},
		coordinates: {
			type: [Number],
			required: true,
		},
	},
	{
		_id: false,
	}
);