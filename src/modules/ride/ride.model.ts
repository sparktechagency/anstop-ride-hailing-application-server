import { model, Schema } from "mongoose";
import { TRide } from "./ride.interface";
import { locationScheama } from "../user/user.model";
import { RideConstants } from "./ride.constant";


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


const rideSchema = new Schema<TRide>(
    {
        riderId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        driverId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        pickup: locationScheama,
        destination: locationScheama,
        distance: {
            type: String,
            required: true
        },
        baseFare: {
            type: Number,
            required: true
        },
        finalFare: {
            type: Number,
            required: true
        },
        note: {
            type: String,
            default: ""
        },
        rideNeeds: {
            type: [String],
            default: []
        },
        status: {
            type: String,
            enum: Object.values(RideConstants.RIDE_STATUS),
            default: "ACCEPTED"
        },
        paymentMethod: {
            type: String,
            enum: Object.values(RideConstants.PAYMENT_METHOD),
            required: true
        },
        cancellationInfo: cancellationInfoSchema,
    },
    {
        timestamps: true
    }
)

export const Ride = model<TRide>("Ride", rideSchema);
