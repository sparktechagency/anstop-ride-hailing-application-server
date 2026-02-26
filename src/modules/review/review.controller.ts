import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import ApiResponse from "../../utils/ApiResponse";
import { ReviewService } from "./review.service";
import { Types } from "mongoose";

const createReview = asyncHandler(async (req: Request, res: Response) => {
    const reviewerId = (req as any).user?._id;
    const result = await ReviewService.createReview(new Types.ObjectId(reviewerId), req.body);

    res.status(201).json(
        new ApiResponse({
            statusCode: 201,
            message: "Review created successfully",
            data: result,
        })
    );
});

const getReviewsForUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const result = await ReviewService.getReviewsForUser(userId);

    res.status(200).json(
        new ApiResponse({
            statusCode: 200,
            message: "Reviews retrieved successfully",
            data: result,
        })
    );
});

const getReviewsForRide = asyncHandler(async (req: Request, res: Response) => {
    const { rideId } = req.params;
    const result = await ReviewService.getReviewsForRide(rideId);

    res.status(200).json(
        new ApiResponse({
            statusCode: 200,
            message: "Reviews retrieved successfully",
            data: result,
        })
    );
});

export const ReviewController = {
    createReview,
    getReviewsForUser,
    getReviewsForRide,
};
