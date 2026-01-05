// notifyNearestDrivers.ts
import { Server } from "socket.io";
import { Driver } from "../driver/driver.model";
import { RideRequest } from "./rideRequest.model";
import { driverSocketMap, userSocketMap } from "../../socket/utils/socketStore";
import { RideRequestStatus } from "./rideRequest.interface";

export const notifyNearestDrivers = async (
	userLocation: { coordinates: [number, number] },
	requestId: string,
	userId: string
) => {
	console.log(io);
	const drivers = await Driver.find({
		isOnline: true,
		isEngaged: false,
		location: {
			$near: {
				$geometry: {
					type: "Point",
					coordinates: userLocation.coordinates,
				},
				$maxDistance: 500, // 500m radius
			},
		},
	}).lean();

	// console.log(drivers);

	if (drivers.length === 0) {
		console.log(userId);
		io.to(userId).emit("ride:no-available-drivers", {
			message: "No available drivers found",
		});
		console.log("No available drivers found.");
		return;
	}

	let index = 0;
	let rideAssigned = false;

	const tryNotifyDriver = () => {
		if (rideAssigned || index >= drivers.length) {
			if (!rideAssigned) {
				io.to(userId).emit("ride:no-available-drivers", {
					message: "No available drivers responded",
				});
				console.log("All drivers ignored the request.");
			}
			return;
		}

		const driver = drivers[index];
		const driverId = driver._id.toString();
		const rideRoom = `ride:${requestId}`;
		console.log(`Notifying driver: ${driverId}`);

		io.to(driverId).emit("ride:offer", {
			requestId,
			userLocation,
			expiresIn: 15000,
		});

		// Get the driver's socket instances
		const driverSocketIds = driverSocketMap.get(driverId);

		if (!driverSocketIds || driverSocketIds.size === 0) {
			console.log(`Driver ${driverId} not connected`);
			index++;
			tryNotifyDriver();
			return;
		}

		// Timeout if driver doesn't respond in 15s
		const timeout = setTimeout(() => {
			console.log(`Driver ${driverId} did not respond.`);
			io.to(driverId).emit("ride:timeout", {
				message: "You missed a ride request",
			});
			// Remove listeners from all driver sockets
			driverSocketIds.forEach((socketId) => {
				const driverSocket = io.sockets.sockets.get(socketId);
				if (driverSocket) {
					driverSocket.off("ride:accepted", onAccept);
				}
			});
			index++;
			tryNotifyDriver();
		}, 15000);

		// if user cancel the ride during the process then emmit use cancel information to driver and end the whole process

		// Temporary listener only for this driver
		const onAccept = async (data: any) => {
			if (data.requestId !== requestId || data.driverId !== driverId) {
				console.log("Error: Invalid accept data");
				return;
			}

			const existingRide = await RideRequest.findById(requestId);
			if (!existingRide || existingRide.driverId) return; // Already accepted

			clearTimeout(timeout);
			rideAssigned = true;
			// Remove listeners from all driver sockets
			driverSocketIds.forEach((socketId) => {
				const driverSocket = io.sockets.sockets.get(socketId);
				if (driverSocket) {
					driverSocket.off("ride:accepted", onAccept);
				}
			});

			// Join sockets to the room
			userSocketMap.get(userId)?.forEach((socketId) => {
				io.sockets.sockets.get(socketId)?.join(rideRoom);
			});
			driverSocketMap.get(driverId)?.forEach((socketId) => {
				io.sockets.sockets.get(socketId)?.join(rideRoom);
			});

			// Update DB
			await Driver.findByIdAndUpdate(driverId, {
				isEngaged: true,
				engagedWith: rideRoom,
			});
			await RideRequest.findByIdAndUpdate(requestId, {
				driverId,
				status: RideRequestStatus.ACCEPTED,
			});

			// Notify both parties
			io.to(userId).emit("ride:driver-assigned", {
				driverId,
			});
			io.to(rideRoom).emit("ride:connected", {
				driverId,
				userId,
				roomId: rideRoom,
				message: "Ride started",
			});
		};

		// get driver socket from map

		driverSocketIds.forEach((socketId) => {
			const driverSocket = io.sockets.sockets.get(socketId);
			if (driverSocket) {
				console.log(
					`Registering ride:accepted listener for driver ${driverId} on socket ${socketId}`
				);
				driverSocket.on("ride:accepted", onAccept);
			}
		});
	};

	tryNotifyDriver();
};


// notifyNearestDrivers.ts
// import { Server } from "socket.io";
// import { Driver } from "../driver/driver.model";
// import { RideRequest } from "./rideRequest.model";
// import { driverSocketMap, userSocketMap } from "../../socket/utils/socketStore";
// import { RideRequestStatus } from "./rideRequest.interface";

// export const notifyNearestDrivers = async (
// 	userLocation: { coordinates: [number, number] },
// 	requestId: string,
// 	userId: string
// ) => {
// 	console.log(io);
// 	const drivers = await Driver.find({
// 		isOnline: true,
// 		isEngaged: false,
// 		location: {
// 			$near: {
// 				$geometry: {
// 					type: "Point",
// 					coordinates: userLocation.coordinates,
// 				},
// 				$maxDistance: 500, // 500m radius
// 			},
// 		},
// 	}).lean();

// 	if (drivers.length === 0) {
// 		console.log(userId);
// 		io.to(userId).emit("ride:no-available-drivers", {
// 			message: "No available drivers found",
// 		});
// 		console.log("No available drivers found.");
// 		return;
// 	}

// 	let index = 0;
// 	let rideAssigned = false;
// 	let rideCancelled = false;
// 	let currentTimeout: NodeJS.Timeout | null = null;
// 	let currentDriverId: string | null = null;

// 	// Function to clean up current driver listeners
// 	const cleanupCurrentDriver = () => {
// 		if (currentDriverId && currentTimeout) {
// 			clearTimeout(currentTimeout);
// 			currentTimeout = null;
			
// 			const driverSocketIds = driverSocketMap.get(currentDriverId);
// 			if (driverSocketIds) {
// 				driverSocketIds.forEach((socketId) => {
// 					const driverSocket = io.sockets.sockets.get(socketId);
// 					if (driverSocket) {
// 						driverSocket.off("ride:accepted", onAccept);
// 					}
// 				});
// 			}
// 		}
// 	};

// 	// Function to clean up all listeners
// 	const cleanupAllListeners = () => {
// 		cleanupCurrentDriver();
		
// 		// Remove cancellation listeners from user sockets
// 		const userSocketIds = userSocketMap.get(userId);
// 		if (userSocketIds) {
// 			userSocketIds.forEach((socketId) => {
// 				const userSocket = io.sockets.sockets.get(socketId);
// 				if (userSocket) {
// 					userSocket.off("ride:cancel", onCancel);
// 				}
// 			});
// 		}
// 	};

// 	// User cancellation handler
// 	const onCancel = async (data: any) => {
// 		if (data.requestId !== requestId) {
// 			console.log("Error: Invalid cancel data");
// 			return;
// 		}

// 		console.log(`User ${userId} cancelled ride ${requestId}. Reason: ${data.reason || 'No reason provided'}`);
		
// 		rideCancelled = true;
// 		cleanupCurrentDriver();

// 		// Update ride status in database
// 		await RideRequest.findByIdAndUpdate(requestId, {
// 			status: RideRequestStatus.USER_CANCELED,
// 			cancellationReason: {
// 				type: RideRequestStatus.USER_CANCELED,
// 				reason: data.reason || 'No reason provided'
// 			}
// 		});

// 		// Notify the current driver if any
// 		if (currentDriverId) {
// 			io.to(currentDriverId).emit("ride:cancelled-by-user", {
// 				requestId,
// 				message: "The ride request was cancelled by the user",
// 				reason: data.reason || 'No reason provided'
// 			});
// 		}

// 		// Confirm cancellation to user
// 		io.to(userId).emit("ride:cancellation-confirmed", {
// 			requestId,
// 			message: "Your ride request has been cancelled"
// 		});

// 		cleanupAllListeners();
// 	};

// 	// Set up user cancellation listener
// 	const userSocketIds = userSocketMap.get(userId);
// 	if (userSocketIds) {
// 		userSocketIds.forEach((socketId) => {
// 			const userSocket = io.sockets.sockets.get(socketId);
// 			if (userSocket) {
// 				console.log(`Setting up cancellation listener for user ${userId} on socket ${socketId}`);
// 				userSocket.on("ride:cancel", onCancel);
// 			}
// 		});
// 	}

// 	const tryNotifyDriver = () => {
// 		// Check if ride was cancelled or assigned
// 		if (rideCancelled || rideAssigned || index >= drivers.length) {
// 			if (rideCancelled) {
// 				console.log("Ride was cancelled by user, stopping driver notification process.");
// 				return;
// 			}
			
// 			if (!rideAssigned && !rideCancelled) {
// 				io.to(userId).emit("ride:no-available-drivers", {
// 					message: "No available drivers responded",
// 				});
// 				console.log("All drivers ignored the request.");
// 			}
			
// 			cleanupAllListeners();
// 			return;
// 		}

// 		const driver = drivers[index];
// 		const driverId = driver._id.toString();
// 		const rideRoom = `ride:${requestId}`;
// 		currentDriverId = driverId;
		
// 		console.log(`Notifying driver: ${driverId}`);

// 		io.to(driverId).emit("ride:offer", {
// 			requestId,
// 			userLocation,
// 			expiresIn: 15000,
// 		});

// 		// Get the driver's socket instances
// 		const driverSocketIds = driverSocketMap.get(driverId);

// 		if (!driverSocketIds || driverSocketIds.size === 0) {
// 			console.log(`Driver ${driverId} not connected`);
// 			currentDriverId = null;
// 			index++;
// 			tryNotifyDriver();
// 			return;
// 		}

// 		// Timeout if driver doesn't respond in 15s
// 		currentTimeout = setTimeout(() => {
// 			if (rideCancelled) return; // Don't process timeout if ride was cancelled
			
// 			console.log(`Driver ${driverId} did not respond.`);
// 			io.to(driverId).emit("ride:timeout", {
// 				message: "You missed a ride request",
// 			});
			
// 			// Remove listeners from all driver sockets
// 			driverSocketIds.forEach((socketId) => {
// 				const driverSocket = io.sockets.sockets.get(socketId);
// 				if (driverSocket) {
// 					driverSocket.off("ride:accepted", onAccept);
// 				}
// 			});
			
// 			currentDriverId = null;
// 			currentTimeout = null;
// 			index++;
// 			tryNotifyDriver();
// 		}, 15000);

// 		// Driver acceptance handler
// 		const onAccept = async (data: any) => {
// 			if (rideCancelled) {
// 				console.log("Ride was cancelled, ignoring driver acceptance");
// 				return;
// 			}

// 			if (data.requestId !== requestId || data.driverId !== driverId) {
// 				console.log("Error: Invalid accept data");
// 				return;
// 			}

// 			const existingRide = await RideRequest.findById(requestId);
// 			if (!existingRide || existingRide.driverId || existingRide.status === RideRequestStatus.USER_CANCELED) {
// 				console.log("Ride no longer available or was cancelled");
// 				return;
// 			}

// 			clearTimeout(currentTimeout!);
// 			currentTimeout = null;
// 			rideAssigned = true;
			
// 			// Remove listeners from all driver sockets
// 			driverSocketIds.forEach((socketId) => {
// 				const driverSocket = io.sockets.sockets.get(socketId);
// 				if (driverSocket) {
// 					driverSocket.off("ride:accepted", onAccept);
// 				}
// 			});

// 			// Join sockets to the room
// 			userSocketMap.get(userId)?.forEach((socketId) => {
// 				io.sockets.sockets.get(socketId)?.join(rideRoom);
// 			});
// 			driverSocketMap.get(driverId)?.forEach((socketId) => {
// 				io.sockets.sockets.get(socketId)?.join(rideRoom);
// 			});

// 			// Update DB
// 			await Driver.findByIdAndUpdate(driverId, {
// 				isEngaged: true,
// 				engagedWith: rideRoom,
// 			});
// 			await RideRequest.findByIdAndUpdate(requestId, {
// 				driverId,
// 				status: RideRequestStatus.ACCEPTED,
// 			});

// 			// Notify both parties
// 			io.to(userId).emit("ride:driver-assigned", {
// 				driverId,
// 			});
// 			io.to(rideRoom).emit("ride:connected", {
// 				driverId,
// 				userId,
// 				roomId: rideRoom,
// 				message: "Ride started",
// 			});

// 			cleanupAllListeners();
// 		};

// 		// Register acceptance listeners for driver sockets
// 		driverSocketIds.forEach((socketId) => {
// 			const driverSocket = io.sockets.sockets.get(socketId);
// 			if (driverSocket) {
// 				console.log(
// 					`Registering ride:accepted listener for driver ${driverId} on socket ${socketId}`
// 				);
// 				driverSocket.on("ride:accepted", onAccept);
// 			}
// 		});
// 	};

// 	tryNotifyDriver();
// };




