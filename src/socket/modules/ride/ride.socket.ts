import { Socket } from "socket.io";
import { RideRequest } from "../../../modules/rideRequest/rideRequest.model";
import SocketError from "../../utils/socketError";
import mongoose, { Types } from "mongoose";
import { RideConstants } from "../../../modules/rideRequest/rideRequest.constant";
import { User } from "../../../modules/user/user.model";
import { userSocketMap } from "../../utils/socketStore";
import { USER_ROLES } from "../../../modules/user/user.constant";
import { RideSocketDto } from "./ride.dto";

const rideAcceptedEventHandler = async (
	socket: Socket,
	data: RideSocketDto["AcceptRide"]
) => {
	const { rideId, driverId } = data;
	const { _id } = socket.payload;

	const user = await User.findOne({ _id });
	if (!user) {
		throw new SocketError("accept-ride", "User not found", null);
	}

	if (!user.role.includes(USER_ROLES.RIDER)) {
		throw new SocketError("accept-ride", "You are not a rider", null);
	}

	if (user.isEngaged) {
		throw new SocketError(
			"accept-ride",
			"You are already engaged with another ride",
			null
		);
	}

	const ride = await RideRequest.findOne({ _id: rideId });
	if (!ride) {
		throw new SocketError("accept-ride", "Ride not found", null);
	}

	if (ride.status !== RideConstants.RIDE_STATUS.PENDING) {
		throw new SocketError(
			"accept-ride",
			"You can't accept this ride",
			null
		);
	}

	const driver = await User.findOne({ _id: driverId });
	if (!driver) {
		throw new SocketError("accept-offer", "Driver not found", null);
	}

	if (driver.isEngaged) {
		throw new SocketError("accept-ride", "Driver is already engaged", null);
	}

	const session = await mongoose.startSession();
	try {
		session.startTransaction();

		ride.driverId = new Types.ObjectId(driverId);
		ride.status = RideConstants.RIDE_STATUS.ACCEPTED;
		await ride.save({ session });

		const driver = await User.findOne({ _id: driverId });
		if (!driver) {
			throw new SocketError("accept-ride", "Driver not found", null);
		}

		if (!driver.isOnline) {
			throw new SocketError("accept-ride", "Driver is not online", null);
		}

		driver.isEngaged = true;
		driver.engagedRideId = new Types.ObjectId(rideId);
		await driver.save({ session });

		const rider = await User.findOne({ _id: ride.riderId });
		if (!rider) {
			throw new SocketError("accept-ride", "Rider not found", null);
		}

		rider.isEngaged = true;
		rider.engagedRideId = new Types.ObjectId(rideId);
		await rider.save({ session });

		io.in(`ride-${rideId.toString()}`).socketsLeave(
			`ride-${rideId.toString()}`
		);

		const driverSockets = userSocketMap.get(driverId.toString());
		const riderSockets = userSocketMap.get(ride.riderId.toString());

		if (driverSockets) {
			driverSockets.forEach((socketId) => {
				const s = io.sockets.sockets.get(socketId);
				if (s) {
					s.join(`ride-accepted-${rideId.toString()}`);
				}
			});
		}

		if (riderSockets) {
			riderSockets.forEach((socketId) => {
				const s = io.sockets.sockets.get(socketId);
				if (s) {
					s.join(`ride-accepted-${rideId.toString()}`);
				}
			});
		}

		io.to(`ride-accepted-${rideId.toString()}`).emit("ride-accepted", {
			rideId,
			riderId: ride.riderId,
		});

		await session.commitTransaction();
	} catch (error: any) {
		await session.abortTransaction();
		if (error instanceof SocketError) throw error;
		throw new SocketError(
			"accept-offer",
			error.message || "Failed to accept offer",
			null
		);
	} finally {
		await session.endSession();
	}

	return null;
};

const newOfferEventHandler = async (
	socket: Socket,
	data: RideSocketDto["NewOffer"]
) => {
	const { rideId } = data;
	const { _id: driverId } = socket.payload;

	const ride = await RideRequest.findOne({ _id: rideId });
	if (!ride) {
		throw new SocketError("new-offer", "Ride not found", null);
	}

	const rider = await User.findOne({ _id: ride.riderId });
	if (!rider) {
		throw new SocketError("new-offer", "Rider not found", null);
	}

	const driver = await User.findOne({ _id: driverId });
	if (!driver) {
		throw new SocketError("new-offer", "Driver not found", null);
	}

	const payload = {
		driver: {
			_id: driver._id,
			name: driver.name,
			profilePicture: driver.profilePicture,
			rating: driver.rating,
			totalReviews: driver.totalReviews,
			carInformation: driver.carInformation,
		},
		rideId,
		amount: ride.fare,
	};

	const userSockets = userSocketMap.get(ride.riderId.toString());
	if (userSockets) {
		userSockets.forEach((socketId) => {
			io.to(socketId).emit("new-offer", payload);
		});
	}

	return null;
};

const cancelOfferEventHandler = async (
	socket: Socket,
	data: RideSocketDto["CancelOffer"]
) => {
	const { rideId, driverId } = data;

	const ride = await RideRequest.findOne({ _id: rideId });
	if (!ride) {
		throw new SocketError("cancel-offer", "Ride not found", null);
	}

	const userSockets = userSocketMap.get(driverId.toString());
	if (userSockets) {
		userSockets.forEach((socketId) => {
			io.to(socketId).emit("cancel-offer", {
				rideId,
				driverId,
			});
		});
	}

	return null;
};

const pickupRiderEventHandler = async (
	socket: Socket,
	data: RideSocketDto["PickupRider"]
) => {
	const { _id } = socket.payload;

	const driver = await User.findOne({ _id });
	if (!driver) {
		throw new SocketError("pickup-rider", "Driver not found", null);
	}

	const ride = await RideRequest.findOne({ _id: driver.engagedRideId });
	if (!ride) {
		throw new SocketError("pickup-rider", "Ride not found", null);
	}

	if (ride.driverId && ride.driverId.toString() !== _id.toString()) {
		throw new SocketError(
			"pickup-rider",
			"You are not the driver of this ride",
			null
		);
	}

	if (ride.status !== "ACCEPTED") {
		throw new SocketError(
			"pickup-rider",
			`The ride cannot be picked up as it is not in accepted state. Current state: ${ride.status}`,
			null
		);
	}

	const session = await mongoose.startSession();
	try {
		session.startTransaction();

		ride.status = "ONGOING";
		await ride.save({ session });

		io.to(ride.riderId.toString()).emit("ride-picked-up", {
			rideId: ride._id,
		});

		await session.commitTransaction();
	} catch (error: any) {
		await session.abortTransaction();
		if (error instanceof SocketError) throw error;
		throw new SocketError(
			"pickup-rider",
			error.message || "Failed to pickup rider",
			null
		);
	} finally {
		await session.endSession();
	}

	return null;
};

const dropOffRiderEventHandler = async (
	socket: Socket,
	data: RideSocketDto["DropOffRider"]
) => {
	const { _id } = socket.payload;

	const driver = await User.findOne({ _id });
	if (!driver) {
		throw new SocketError("drop-off-rider", "Driver not found", null);
	}

	const ride = await RideRequest.findOne({ _id: driver.engagedRideId });
	if (!ride) {
		throw new SocketError("drop-off-rider", "Ride not found", null);
	}

	if (ride.driverId && ride.driverId.toString() !== _id.toString()) {
		throw new SocketError(
			"drop-off-rider",
			"You are not the driver of this ride",
			null
		);
	}

	if (ride.status !== "ONGOING") {
		throw new SocketError("drop-off-rider", "Ride not ongoing", null);
	}

	const session = await mongoose.startSession();
	try {
		session.startTransaction();

		ride.status = "COMPLETED";
		await ride.save({ session });

		driver.engagedRideId = null;
		driver.isEngaged = false;
		await driver.save({ session });

		const rider = await User.findOne({ _id: ride.riderId });
		if (!rider) {
			throw new Error("Rider not found");
		}

		rider.engagedRideId = null;
		rider.isEngaged = false;
		await rider.save({ session });

		io.to(ride.riderId.toString()).emit("ride-completed", {
			rideId: ride._id,
			paymentMethod: ride.paymentMethod,
		});

		await session.commitTransaction();
	} catch (error: any) {
		await session.abortTransaction();
		if (error instanceof SocketError) throw error;
		throw new SocketError(
			"drop-off-rider",
			error.message || "Failed to drop off rider",
			null
		);
	} finally {
		await session.endSession();
	}

	return null;
};

const cancelRideEventHandler = async (
	socket: Socket,
	data: RideSocketDto["CancelRide"]
) => {
	const { rideId, reason } = data;
	const { _id } = socket.payload;

	const user = await User.findOne({ _id });
	if (!user) {
		throw new SocketError("cancel-ride", "User not found", null);
	}

	const ride = await RideRequest.findOne({ _id: rideId });
	if (!ride) {
		throw new SocketError("cancel-ride", "Ride not found", null);
	}

	if (ride.riderId.toString() !== _id.toString()) {
		throw new SocketError(
			"cancel-ride",
			"You are not the rider of this ride",
			null
		);
	}

	if (
		ride.status == "ONGOING" ||
		ride.status == "ACCEPTED" ||
		ride.status == "COMPLETED"
	) {
		throw new SocketError(
			"cancel-ride",
			"Ride is not in the right state to be cancelled",
			null
		);
	}

	const session = await mongoose.startSession();
	try {
		session.startTransaction();

		ride.status = "CANCELLED";
		ride.cancellationInfo = {
			cancelledAt: new Date(),
			cancelledBy: "RIDER",
			reason,
		};
		await ride.save({ session });

		user.engagedRideId = null;
		user.isEngaged = false;
		await user.save({ session });

		const driver = await User.findOne({ _id: ride.driverId });
		if (driver) {
			driver.engagedRideId = null;
			driver.isEngaged = false;
			await driver.save({ session });
		}

		io.to(`ride-${ride._id.toString()}`).emit("ride-cancelled", {
			rideId: ride._id,
		});

		await session.commitTransaction();
	} catch (error: any) {
		await session.abortTransaction();
		if (error instanceof SocketError) throw error;
		throw new SocketError(
			"cancel-ride",
			error.message || "Failed to cancel ride",
			null
		);
	} finally {
		await session.endSession();
	}

	return null;
};



export const RideSocket = {
	newOfferEventHandler,
	rideAcceptedEventHandler,
	cancelOfferEventHandler,
	pickupRiderEventHandler,
	dropOffRiderEventHandler,
	cancelRideEventHandler,
};
