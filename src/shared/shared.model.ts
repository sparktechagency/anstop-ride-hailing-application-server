// username sub schema

import { TAddress, TUserName } from "./shared.interface";
import { Schema } from "mongoose";



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