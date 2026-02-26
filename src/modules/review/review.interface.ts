import { Types } from "mongoose";

export interface TReview {
    _id: Types.ObjectId;
    rideId: Types.ObjectId;
    reviewerId: Types.ObjectId;
    revieweeId: Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}
