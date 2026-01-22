import { Types } from "mongoose";
import { GetMyRideDto } from "./ride.dto";
import { Ride } from "./ride.model";

const getMyRides = async (userId: Types.ObjectId, query: GetMyRideDto) => {
    const { status } = query;

    let filter: Record<string, any> = {};

    if (status) {
        filter.status = status;
    }

    const rides = await Ride.find(filter).select("createdAt driverId riderId pickup destination distance finalFare baseFare").populate({
        path: "driverId",
        select: "name phone profilePicture"
    }).populate({
        path: "riderId",
        select: "name phone profilePicture"
    });

    return rides;
}

const rideDetails = async (userId: Types.ObjectId, rideId: string) => {

    const ride = await Ride.findById(rideId).select("createdAt driverId riderId pickup destination distance finalFare baseFare status").populate({
        path: "driverId",
        select: "name phone profilePicture rating totalReviews totalRides"
    }).populate({
        path: "riderId",
        select: "name phone profilePicture rating totalReviews totalRides"
    });

    if (!ride) {
        throw new Error("Ride not found");
    }

    return ride;
}

const calculateFare = (distance: number, baseFare: number = 10, farePerKm: number = 5) => {
    return { fare: baseFare + (distance * farePerKm) }
}

export const RideService = {
    getMyRides,
    rideDetails,
    calculateFare
}