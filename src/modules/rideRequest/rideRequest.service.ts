import ApiError from "../../utils/ApiError";
import { User } from "../user/user.model";
import { TCalculateFareDto, TCreateRideRequestDto } from "./rideRequest.dto";
import httpStatus from "http-status";
import { RideRequest } from "./rideRequest.model";
import { RideConstants } from "./rideRequest.constant";
import { USER_ROLES } from "../user/user.constant";
import {
	addToMap,
	userRoomMap,
	userSocketMap,
} from "../../socket/utils/socketStore";
import { first } from "lodash";
import { ComputeRoute } from "./rideRequest.utils";
import { config } from "../../config";
import mongoose, { Types } from "mongoose";
import { StripeService } from "../../stripe";

const findNearestDrivers = async (coordinates: [number, number]) => {
	const drivers = await User.aggregate([
		{
			$geoNear: {
				near: {
					type: "Point",
					coordinates: coordinates,
				},
				distanceField: "distance",
				maxDistance: 10000,
				spherical: true,
				query: {
					role: { $in: [USER_ROLES.DRIVER] },
					isOnline: true,
					isEngaged: false,
					isEmailVerified: true,
				},
			},
		},
		{
			$limit: 10,
		},
		{
			$project: {
				_id: 1,
				name: 1,
				distance: 1,
				location: 1,
				locationName: 1,
				email: 1,
				profilePicture: 1,
			},
		},
	]);

	console.log("drivers", drivers);

	return drivers;
};

const createRideRequest = async (
	userId: string,
	payload: TCreateRideRequestDto
) => {
	// if userId is valid

	const user = await User.findById(userId);
	if (!user) {
		throw new ApiError(httpStatus.BAD_REQUEST, "User does not exist");
	}

	if (user.isEngaged) {
		throw new ApiError(
			httpStatus.BAD_REQUEST,
			"User is already engaged in a ride"
		);
	}

	// case 1: user has a pending, accepted or ongoing ride request
	const existingRideRequest = await RideRequest.findOne({
		riderId: userId,
		$or: [
			{ status: RideConstants.RIDE_STATUS.PENDING },
			{ status: RideConstants.RIDE_STATUS.ACCEPTED },
			{ status: RideConstants.RIDE_STATUS.ONGOING },
			{ isPaymentCompleted: false },
		],
		// status: {
		// 	$in: [
		// 		RideConstants.RIDE_STATUS.ACCEPTED,
		// 		RideConstants.RIDE_STATUS.ONGOING,
		// 		RideConstants.RIDE_STATUS.PENDING,
		// 	],
		// },
	});

	console.log("existingRideRequest", existingRideRequest);

	if (existingRideRequest) {
		throw new ApiError(
			httpStatus.BAD_REQUEST,
			"you already have a incomplete ride request"
		);
	}

	const { distanceKm, durationSeconds } = await ComputeRoute(
		{
			latitude: payload.pickUp.latitude,
			longitude: payload.pickUp.longitude,
		},
		{
			latitude: payload.destination.latitude,
			longitude: payload.destination.longitude,
		}
	);

	const fare =
		distanceKm * config.RIDE_REQUEST.PER_KM_RATE +
		config.RIDE_REQUEST.BASE_FARE +
		config.RIDE_REQUEST.PER_MINUTE_RATE * (durationSeconds / 60);

	const rideRequestData = {
		riderId: userId,
		pickUp: {
			name: payload.pickUp.name,
			coordinates: [payload.pickUp.longitude, payload.pickUp.latitude],
		},
		destination: {
			name: payload.destination.name,
			coordinates: [
				payload.destination.longitude,
				payload.destination.latitude,
			],
		},
		distance: distanceKm,
		fare: fare,
		note: payload.note,
		rideNeeds: payload.rideNeeds,
		paymentMethod: payload.paymentMethod,
		rideFor: payload.rideFor,
		riderNumber: payload.riderNumber,
	};

	const newRideRequest = new RideRequest({
		userId,
		...rideRequestData,
	});

	await newRideRequest.save();

	const nearestDrivers = await findNearestDrivers([
		newRideRequest.pickUp.coordinates[0],
		newRideRequest.pickUp.coordinates[1],
	]);

	console.log("nearestDrivers", nearestDrivers);

	if (!nearestDrivers || nearestDrivers.length === 0) {
		// delete trip if no drivers found
		await RideRequest.findByIdAndDelete(newRideRequest._id);
		throw new ApiError(
			httpStatus.NOT_FOUND,
			"No available drivers found in your area"
		);
	}

	console.log("dirverids", nearestDrivers);

	// Create ride room for socket communication
	const rideRoom = `ride:${newRideRequest._id}`;

	// Add user to ride room

	// Batch update drivers and notify them
	nearestDrivers.map((driver) => {
		// Update driver's ride requests array atomically
		// const updatedDriver = await User.findByIdAndUpdate(
		// 	driver._id,
		// 	{ $addToSet: { rideRequests: newTrip._id } }, // Use $addToSet to prevent duplicates
		// 	{ new: true }
		// ).populate({
		// 	path: 'rideRequests',
		// 	match: { status: { $in: ['Pending'] } }, // Only populate active requests
		// 	select:
		// 		'pickupLocationName pickupLocationLatitude pickupLocationLongitude user',
		// 	populate: {
		// 		path: 'user',
		// 		select: 'username profileImage',
		// 	},
		// });

		const payload = {
			notification: {
				title: "New Ride Request",
				body: `You have a new ride request from ${user.name}`,
			},
		};

		// sendMessageToSingleDevice(driver.fcmToken, payload);

		// if (!updatedDriver) {
		// 	console.log('Driver not found during update:', driver._id);
		// 	return;
		// }

		// Add driver to ride room and emit notification
		const driverSockets = userSocketMap.get(driver._id.toString());
		if (driverSockets) {
			driverSockets.forEach((socketId) => {
				const driverSocket = io.sockets.sockets.get(socketId);
				if (driverSocket) {
					console.log("Driver Joined Ride Room:", rideRoom);
					driverSocket.join(rideRoom);
					addToMap(userRoomMap, driver._id.toString(), rideRoom);
					// Emit ride request to specific driver socket
					io.to(socketId).emit("ride-request", {
						rideId: newRideRequest._id.toString(),
						riderId: newRideRequest.riderId.toString(),
						rider: {
							_id: user._id,
							name: user.name,
							profilePicture: user.profilePicture,
							rating: user.rating,
							totalReviews: user.totalReviews,
						},
						pickUp: newRideRequest.pickUp,
						destination: newRideRequest.destination,
						distance: newRideRequest.distance,
						fare: newRideRequest.fare,
						note: newRideRequest.note,
						rideNeeds: newRideRequest.rideNeeds,
						riderNumber: newRideRequest.riderNumber,
						rideFor: newRideRequest.rideFor,
					});
				}
			});
		}
	});

	// notify rider about the nearest drivers

	const userSockets = userSocketMap.get(userId.toString());
	if (userSockets) {
		userSockets.forEach((socketId) => {
			const userSocket = io.sockets.sockets.get(socketId);
			if (userSocket) {
				io.to(socketId).emit("nearest-drivers", nearestDrivers);
				userSocket.join(rideRoom);
				addToMap(userRoomMap, userId.toString(), rideRoom);
			}
		});
	}
	// notifyNearestDrivers(
	// 	{
	// 		coordinates: [
	// 			newRideRequest.pickupAddress.coordinates[0],
	// 			newRideRequest.pickupAddress.coordinates[1],
	// 		],
	// 	},
	// 	newRideRequest._id.toString(),
	// 	userId
	// );

	// auto cancel ride request after 5 minutes

	setTimeout(
		async () => {
			console.log("One minute passed without driver acceptance");
			const trip = await RideRequest.findById(newRideRequest._id);
			if (trip && trip.status === RideConstants.RIDE_STATUS.PENDING) {
				// remove rideRequest from driver

				//   const first = await User.updateMany(
				//     { rideRequests: { $in: [newRideRequest._id] } },
				//     { $pull: { rideRequests: newRideRequest._id } }
				//   );

				//   console.log(first, 'Remove ride from driver vault');
				// Notify user and driver
				io.to(rideRoom).emit("ride/expired", { tripId: trip._id });

				await RideRequest.findByIdAndDelete(trip._id);
				console.log(
					`Trip ${trip._id} auto-cancelled due to no driver acceptance`
				);
			}
		},
		1000 * 60 * 5
	); // 5 minutes

	return newRideRequest;
};

const getAllRideRequests = async (userId: string) => {
	console.log("userid", userId);
	const rideRequests = await RideRequest.find({ userId: userId }).lean();
	return rideRequests;
};

const cancelRideRequest = async (
	userId: string,
	rideRequestId: string,
	payload: any
): Promise<boolean> => {
	const { reason } = payload;

	const rideRequest = await RideRequest.findById(rideRequestId);

	if (!rideRequest) {
		throw new ApiError(httpStatus.NOT_FOUND, "Ride request not found");
	}

	if (rideRequest.riderId.toString() !== userId.toString()) {
		throw new ApiError(
			httpStatus.UNAUTHORIZED,
			"You are not authorized to cancel this ride request"
		);
	}

	if (rideRequest.status === RideConstants.RIDE_STATUS.CANCELLED) {
		throw new ApiError(
			httpStatus.BAD_REQUEST,
			"Ride request is already cancelled"
		);
	}

	rideRequest.status = RideConstants.RIDE_STATUS.CANCELLED;
	// rideRequest.cancellationReason = {
	// 	type: RideConstants.RIDE_STATUS.CANCELLED,
	// 	reason,
	// };

	await rideRequest.save();

	return true;
};

const calCulateFare = async (payload: TCalculateFareDto) => {
	const { distanceKm, durationSeconds } = await ComputeRoute(
		{
			latitude: payload.pickUpLat,
			longitude: payload.pickUpLng,
		},
		{
			latitude: payload.destinationLat,
			longitude: payload.destinationLng,
		}
	);

	const fare =
		distanceKm * config.RIDE_REQUEST.PER_KM_RATE +
		config.RIDE_REQUEST.BASE_FARE +
		config.RIDE_REQUEST.PER_MINUTE_RATE * (durationSeconds / 60);

	console.log("hello", { fare, distance: distanceKm, duration: durationSeconds });

	return { fare, distance: distanceKm, duration: durationSeconds };
};


const payRideFare = async (userId: Types.ObjectId) => {

	const session = await mongoose.startSession()

	try {
		const response: { message: string, data: any } = { message: "", data: null }
		session.startTransaction()

		// pass session to all the queries

		const rideRequest = await RideRequest.findOne({ riderId: userId }).session(session)

		if (!rideRequest) {
			throw new ApiError(httpStatus.NOT_FOUND, "Ride request not found");
		}

		if (rideRequest.status !== RideConstants.RIDE_STATUS.COMPLETED) {
			throw new ApiError(httpStatus.BAD_REQUEST, "The ride is not completed yet");
		}

		if (rideRequest.isPaymentCompleted) {
			throw new ApiError(httpStatus.BAD_REQUEST, "The ride is already paid");
		}

		if (!rideRequest.driverId) {
			throw new ApiError(httpStatus.BAD_REQUEST, "Driver not found");
		}

		if (rideRequest.paymentMethod === RideConstants.PAYMENT_METHOD.CASH) {

			io.to(rideRequest.driverId.toString()).emit("payment-confirmation", {
				rideId: rideRequest._id.toString(),
				fare: rideRequest.fare,
			})

			response.message = "Please wait for the driver confirmation"
		} else if (rideRequest.paymentMethod === RideConstants.PAYMENT_METHOD.WALLET) {

			const user = await User.findById(userId).session(session)

			if (!user) {
				throw new ApiError(httpStatus.NOT_FOUND, "User not found");
			}

			if (user.balance < rideRequest.fare) {
				throw new ApiError(httpStatus.BAD_REQUEST, "Insufficient wallet balance. Please add more money to your wallet or user card/cash option");
			}

			user.balance -= rideRequest.fare;
			await user.save({ session });

			response.message = "Payment successful"
		} else if (rideRequest.paymentMethod === RideConstants.PAYMENT_METHOD.CARD) {
			const session = await StripeService.createCheckoutSession(rideRequest.fare * 100);
			response.message = "Please use the secure payment gateway to complete the payment"
			response.data = session
		}

		await session.commitTransaction()
		return response;
	} catch (error) {
		await session.abortTransaction()
		console.log(error)
		throw error
	} finally {
		await session.endSession()
	}




}

export const RideRequestService = {
	createRideRequest,
	getAllRideRequests,
	cancelRideRequest,
	calCulateFare,
	payRideFare
};
