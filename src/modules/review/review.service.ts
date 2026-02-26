import { Types } from "mongoose";
import { Review } from "./review.model";
import { CreateReviewDto } from "./review.dto";
import { RideRequest } from "../rideRequest/rideRequest.model";
import ApiError from "../../utils/ApiError";
import httpStatus from "http-status";


const createReview = async (reviewerId: Types.ObjectId, payload: CreateReviewDto) => {

    const ride = await RideRequest.findById(payload.rideId);
    if (!ride) {
        throw new ApiError(httpStatus.NOT_FOUND, "Ride not found");
    }

    if(ride.status !== "COMPLETED"){
        throw new ApiError(httpStatus.FORBIDDEN, "You can only review completed rides");
    }

    if(ride.riderId.toString() !== reviewerId.toString() || ride.driverId?.toString() !== reviewerId.toString()){
        throw new ApiError(httpStatus.FORBIDDEN, "You are not the rider or driver of this ride");
    }

    if(!ride.isPaymentCompleted){
        throw new ApiError(httpStatus.FORBIDDEN, "You can only review completed rides. Please complete the payment first");
    }

    const review = await Review.create({
        reviewerId,
        ...payload,
    });
    return review;
};


const getReviewsForUser = async (userId: string) => {
    const reviews = await Review.find({ revieweeId: userId }).select("rating comment rideId")
        .populate("reviewerId", "name profileImage")
        .sort("-createdAt");
    return reviews;
};

const getReviewsForRide = async (rideId: string) => {
    const reviews = await Review.find({ rideId })
        .populate("reviewerId", "name profileImage")
        .populate("revieweeId", "name profileImage");
    return reviews;
};



export const ReviewService = {
    createReview,
    getReviewsForUser,
    getReviewsForRide,
};
