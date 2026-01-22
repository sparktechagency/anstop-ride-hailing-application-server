import { Request, Response } from "express";

import asyncHandler from "../../utils/asyncHandler";
import { TRideStatus } from "./ride.interface";
import { RideService } from "./ride.service";
import ApiResponse from "../../utils/ApiResponse";

const getMyRidesController = asyncHandler(async (req: Request, res: Response) => {

    const userId = req.user._id
    
    const status = req.query as unknown as {status: TRideStatus};

    const rides = await RideService.getMyRides(userId, status);

    res.status(200).json(new ApiResponse({
        statusCode: 200,
        message: "Rides fetched successfully",
        data: rides
    }))
})

const getRideDetails = asyncHandler(async(req: Request, res: Response) => {

    const userId = req.user._id;
    const rideId = req.params.id;

    const ride = await RideService.rideDetails(userId, rideId);

    res.status(200).json(new ApiResponse({
        statusCode: 200,
        message: "Ride details fetched successfully",
        data: ride
    })) 
})

const calculateFare = asyncHandler(async(req: Request, res: Response) => {

    const { distance } = req.validatedData.query;

    const fare = RideService.calculateFare(distance);

    res.status(200).json(new ApiResponse({
        statusCode: 200,
        message: "Fare calculated successfully",
        data: fare
    }))
})

export const RideController = {
    getMyRidesController,
    getRideDetails,
    calculateFare
}