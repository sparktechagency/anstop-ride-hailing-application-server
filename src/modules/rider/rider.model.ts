import { model, Schema } from "mongoose";
import { TRider, TSavedAddresses } from "./rider.interface";
import { addressSchema } from "../../shared/shared.model";

const savedAddressSchema = new Schema<TSavedAddresses>({
	title: {
		type: String,
		required: true,
	},
	address: addressSchema,
});

const riderSchema = new Schema<TRider>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		savedAddresses: [savedAddressSchema],

		trustedContacts: [
			{
				type: String,
				default: "",
			},
		],
		rides: [
			{
				type: Schema.Types.ObjectId,
				ref: "RideRequest",
			},
		],
	},
	{
		timestamps: true,
	}
);

export const Rider = model<TRider>("Rider", riderSchema);
