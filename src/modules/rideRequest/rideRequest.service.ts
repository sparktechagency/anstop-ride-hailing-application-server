import { TRideRequest, RideRequestStatus } from "./rideRequest.interface";
import { RideRequest } from "./rideRequest.model";
import {
	TCancelRideRequest,
	TCreateRideRequest,
} from "./rideRequestValidation";
import ApiError from "../../utils/ApiError";
import httpStatus from "http-status";
import { User } from "../user/user.model";
import { notifyNearestDrivers } from "./rideRequest.utils";

const createRideRequest = async (
	userId: string,
	payload: TCreateRideRequest
): Promise<TRideRequest> => {
	const { isScheduled, scheduledAt, estimatedEndTime } = payload;

	// if userId is valid

	const user = await User.findById(userId);
	if (!user) {
		throw new ApiError(httpStatus.BAD_REQUEST, "User does not exist");
	}

	// case 1: user has a pending, accepted or ongoing ride request
	const existingRideRequest = await RideRequest.findOne({
		userId: userId,
		status: {
			$in: [
				RideRequestStatus.PENDING,
				RideRequestStatus.ACCEPTED,
				RideRequestStatus.ONGOING,
			],
		},
		isScheduled: false,
	});

	if (existingRideRequest) {
		throw new ApiError(
			httpStatus.BAD_REQUEST,
			"Ride request already exists for this user"
		);
	}

	const existingScheduledRideRequest = await RideRequest.find({
		userId: userId,
		status: {
			$in: [
				RideRequestStatus.PENDING,
				RideRequestStatus.ACCEPTED,
				RideRequestStatus.ONGOING,
			],
		},
		isScheduled: true,
	});

	const rideStartTime = isScheduled ? new Date(scheduledAt!) : new Date();

	const rideEndTime = new Date(estimatedEndTime);

	if (
		existingScheduledRideRequest &&
		existingScheduledRideRequest.length > 0
	) {
		const hasConflict = existingScheduledRideRequest.some((ride) => {
			const existingStart = ride.isScheduled
				? new Date(ride.scheduledAt!)
				: new Date(ride.createdAt);

			const existingEndtime = new Date(ride.estimatedEndTime);

			return (
				rideStartTime < existingEndtime && rideEndTime > existingStart
			);
		});

		if (hasConflict) {
			throw new ApiError(
				httpStatus.BAD_REQUEST,
				"User already has a conflicting ride request."
			);
		}
	}

	const newRideRequest = new RideRequest({
		userId,
		...payload,
	});

	await newRideRequest.save();

	notifyNearestDrivers(
		{
			coordinates: [
				newRideRequest.pickupAddress.coordinates[0],
				newRideRequest.pickupAddress.coordinates[1],
			],
		},
		newRideRequest._id.toString(),
		userId
	);

	return newRideRequest;
};

const getAllRideRequests = async (userId: string): Promise<TRideRequest[]> => {
	console.log("userid", userId);
	const rideRequests = await RideRequest.find({ userId: userId }).lean();
	return rideRequests;
};

const cancelRideRequest = async (
	userId: string,
	rideRequestId: string,
	payload: TCancelRideRequest
): Promise<boolean> => {
	const { reason } = payload;

	const rideRequest = await RideRequest.findById(rideRequestId);

	if (!rideRequest) {
		throw new ApiError(httpStatus.NOT_FOUND, "Ride request not found");
	}

	if (rideRequest.userId.toString() !== userId.toString()) {
		throw new ApiError(
			httpStatus.UNAUTHORIZED,
			"You are not authorized to cancel this ride request"
		);
	}

	if (rideRequest.isCancelled) {
		throw new ApiError(
			httpStatus.BAD_REQUEST,
			"Ride request is already cancelled"
		);
	}

	rideRequest.isCancelled = true;
	rideRequest.status = RideRequestStatus.USER_CANCELED;
	rideRequest.cancellationReason = {
		type: RideRequestStatus.USER_CANCELED,
		reason,
	};

	await rideRequest.save();

	return true;
};

export const RideRequestService = {
	createRideRequest,
	getAllRideRequests,
	cancelRideRequest,
};
