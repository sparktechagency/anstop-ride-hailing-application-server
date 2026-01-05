import asyncHandler from "../../utils/asyncHandler";
import httpStatus from "http-status";
import { RideRequestService } from "./rideRequest.service";
import ApiResponse from "../../utils/ApiResponse";
import ApiError from "../../utils/ApiError";


const createRideRequest = asyncHandler(async (req, res) => {

    const { _id: userId } = req.user;
    if (!req.user && !userId) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated");
    }

    const payload = req.body;
    await RideRequestService.createRideRequest(userId, payload);
    res.status(httpStatus.CREATED).json(
        new ApiResponse({
            statusCode: httpStatus.CREATED,
            message: "Ride request created successfully",
            data: null,
        })
    );
})

const getAllRideRequests = asyncHandler(async (req, res) => {
    const { _id: userId } = req.user;
    if (!req.user && !userId) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated");
    }
    const rideRequests = await RideRequestService.getAllRideRequests(userId);
    res.status(httpStatus.OK).json(
        new ApiResponse({
            statusCode: httpStatus.OK,
            message: "Ride requests retrieved successfully",
            data: {rideRequests},
        })
    );
})

const cancelRideRequest = asyncHandler(async (req, res) => {
    const { _id: userId } = req.user;
    if (!req.user && !userId) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated");
    }

    const {rideRequestId} = req.params;

    if (!rideRequestId) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Ride request ID param is required");
    }

    const payload = req.body;

    await RideRequestService.cancelRideRequest(userId, rideRequestId, payload);
    res.status(httpStatus.CREATED).json(
        new ApiResponse({
            statusCode: httpStatus.CREATED,
            message: "Ride request cancelled successfully",
            data: null,
        })
    );
})

export const RideRequestController = {
    createRideRequest,
    cancelRideRequest,
    getAllRideRequests
}