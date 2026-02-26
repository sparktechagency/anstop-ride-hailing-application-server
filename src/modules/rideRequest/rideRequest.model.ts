import { Schema } from "mongoose";
import { TRideRequest } from "./rideRequest.interface";
import { RideConstants } from "./rideRequest.constant";
import { locationScheama } from "../user/user.model";
import { model } from "mongoose";

const cancellationInfoSchema = new Schema({
	cancelledBy: {
		type: String,
		enum: Object.values(RideConstants.CANCELLED_BY),
		required: true
	},
	reason: {
		type: String,
		required: true
	},
	cancelledAt: {
		type: Date,
		default: Date.now
	},
	refundAmount: {
		type: Number,
	},
	refundStatus: {
		type: String,
		enum: Object.values(RideConstants.REFUND_STATUS),
	}
})



const rideRequestSchema = new Schema<TRideRequest>(
	{
		riderId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		driverId: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		pickUp: locationScheama,
		destination: locationScheama,
		distance: {
			type: String,
			required: true
		},
		fare: {
			type: Number,
			required: true
		},
		// finalFare: {
		// 	type: Number,

		// },
		note: {
			type: String,
			default: ""
		},
		rideNeeds: {
			type: [String],
			default: []
		},
		rideFor: {
			type: String,
			enum: Object.values(RideConstants.RIDE_FOR),
			default: RideConstants.RIDE_FOR.SELF,
		},
		riderNumber: {
			type: String,
		},

		status: {
			type: String,
			enum: Object.values(RideConstants.RIDE_STATUS),
			default: RideConstants.RIDE_STATUS.PENDING,
		},
		cancellationInfo: cancellationInfoSchema,
		paymentMethod: {
			type: String,
			enum: Object.values(RideConstants.PAYMENT_METHOD),
			default: RideConstants.PAYMENT_METHOD.CASH,
		},
		isPaymentCompleted: {
			type: Boolean,
			default: false,
		},

	},
	{
		timestamps: true,
	}
);

// Optional: Add conditional validators using pre-save hook
rideRequestSchema.pre("save", function (next) {
	if (this.status === RideConstants.RIDE_STATUS.CANCELLED && !this.cancellationInfo) {
		return next(
			new Error("You must provide cancellation information when the ride is cancelled.")
		);
	}
	next();
});

export const RideRequest = model<TRideRequest>(
	"RideRequest",
	rideRequestSchema
);
