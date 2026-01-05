import { model, Schema } from "mongoose";
import {
	TRideRequest,
	RIDEREQUESTSTATUS,
	SERVICETYPES,
} from "./rideRequest.interface";
import { TAddress } from "../../shared/shared.interface";

const addressSchema = new Schema<TAddress>(
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

const cancellationReasonSchema = new Schema(
	{
		type: {
			type: String,
			enum: ["USER_CANCELED", "DRIVER_CANCELED"],
			required: true,
		},
		reason: {
			type: String,
			required: true,
		},
	},
	{
		_id: false,
	}
);

const pricingInfoSchema = new Schema({
	recommendedFare: {
				type: Number,
				required: true,
			},
			minimumFare: {
				type: Number,
				required: true,
			},
			fare: {
				type: Number,
				required: true,
			},
			operationFee: {
				type: Number,
				required: true,
			},
			totalFare: {
				type: Number,
				required: true,
			},
}, {
	_id: false
})

const rideRequestSchema = new Schema<TRideRequest>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		driverId: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		pickupAddress: addressSchema,
		dropOffAddress: addressSchema,
		hasSteps: {
			type: Boolean,
			default: false,
		},
		steps: [addressSchema],
		serviceType: {
			type: String,
			enum: SERVICETYPES,
			required: true,
		},
		status: {
			type: String,
			enum: RIDEREQUESTSTATUS,
			default: "PENDING",
		},
		isCancelled: {
			type: Boolean,
			default: false,
		},
		cancellationReason: cancellationReasonSchema,
		isScheduled: {
			type: Boolean,
			default: false,
		},
		scheduledAt: {
			type: Date,
		},
		pricingInfo: pricingInfoSchema,
		estimatedDuration: {
			type: Number,
			required: true,
		},
		estimatedEndTime: {
			type: Date,
			required: true,
		},
		distance: {
			type: Number,
			required: true,
		}
	},
	{
		timestamps: true,
	}
);

// Optional: Add conditional validators using pre-save hook
rideRequestSchema.pre("save", function (next) {
	if (this.hasSteps && (!this.steps || this.steps.length === 0)) {
		return next(new Error("Steps are required if hasSteps is true."));
	}
	if (this.isScheduled && !this.scheduledAt) {
		return next(
			new Error("ScheduledAt is required if isScheduled is true.")
		);
	}
	if (this.isCancelled && !this.cancellationReason) {
		return next(
			new Error("Cancellation reason is required if isCancelled is true.")
		);
	}
	next();
});

export const RideRequest = model<TRideRequest>(
	"RideRequest",
	rideRequestSchema
);
