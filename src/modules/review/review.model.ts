import { model, Schema } from "mongoose";
import { TReview } from "./review.interface";

const reviewSchema = new Schema<TReview>(
    {
        rideId: {
            type: Schema.Types.ObjectId,
            ref: "Ride",
            required: true,
        },
        reviewerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        revieweeId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Review = model<TReview>("Review", reviewSchema);
