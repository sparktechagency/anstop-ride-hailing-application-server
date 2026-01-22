import { Socket } from "socket.io";
import { RideRequest } from "../../../modules/rideRequest/rideRequest.model";
import mongoose from "mongoose";
import { userSocketMap } from "../../utils/socketStore";
import { RideConstants } from "../../../modules/ride/ride.constant";
import { User } from "../../../modules/user/user.model";

export const RideEventHandler = (socket: Socket) => {
    socket.on("new-bid", async (data, callback = () => { }) => {

        const { rideId, amount } = data;
        const { _id: driverId } = socket.payload;

        // if (!data || !data.conversationId || !data.message) {
        // 	callback({
        // 		success: false,
        // 		message: "Invalid data",
        // 		data: null,
        // 	});
        // }

        const ride = await RideRequest.findOne({
            _id: rideId,
        });

        if (!ride) {
            console.log("ride not found");
            callback({
                success: false,
                message: "Ride not found",
                data: null,
            });
            return;
        }

        const rider = await User.findOne({
            _id: ride.riderId,
        });

        if (!rider) {
            console.log("rider not found");
            callback({
                success: false,
                message: "Rider not found",
                data: null,
            });
            return;
        }

        const driver = await User.findOne({
            _id: driverId,
        });

        if (!driver) {
            console.log("driver not found");
            callback({
                success: false,
                message: "Driver not found",
                data: null,
            });
            return;
        }


        // ConversationSocket.emitNewMessageToConversation({
        // 	socket,
        // 	conversationId,
        // 	message: data,
        // });

        const payload = {
            driver: {
                _id: driver._id,
                name: driver.name,
                profilePicture: driver.profilePicture,
                rating: driver.rating,
                totalReviews: driver.totalReviews,
                carInformation: driver.carInformation
            },
            rideId,
            amount
        }

        const userSockets = userSocketMap.get(ride.riderId.toString());
        if (userSockets) {
            userSockets.forEach(socketId => {
                const userSocket = io.sockets.sockets.get(socketId);
                if (userSocket) {
                    io.to(socketId).emit('new-bid', payload);
                }
            });
        }

        callback({
            success: true,
            message: "Message sent successfully",
            data: null,
        });
    });

    socket.on("accept-bid", async (data, callback = () => { }) => {

        const { rideId, driverId } = data;
        const { _id } = socket.payload;

        // if (!data || !data.conversationId || !data.message) {
        // 	callback({
        // 		success: false,
        // 		message: "Invalid data",
        // 		data: null,
        // 	});
        // }

        const ride = await RideRequest.findOne({
            _id: rideId,
        });

        if (!ride) {
            console.log("ride not found");
            callback({
                success: false,
                message: "Ride not found",
                data: null,
            });
            return;
        }

        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            ride.driverId = driverId;
            ride.status = RideConstants.RIDE_STATUS.ACCEPTED;

            await ride.save({ session });

            const driver = await User.findOne({
                _id: driverId,
            });

            if (!driver) {
                console.log("driver not found");
                callback({
                    success: false,
                    message: "Driver not found",
                    data: null,
                });
                return;
            }

            driver.isEngaged = true;
            driver.engagedRideId = rideId;

            await driver.save({ session });

            const rider = await User.findOne({
                _id: ride.riderId,
            });

            if (!rider) {
                console.log("rider not found");
                callback({
                    success: false,
                    message: "Rider not found",
                    data: null,
                });
                return;
            }

            rider.isEngaged = true;
            rider.engagedRideId = rideId;

            await rider.save({ session });

            // kill the socket room

            // kill the socket room

            io.in(`ride-${rideId.toString()}`).socketsLeave(`ride-${rideId.toString()}`);


            // join new room

            const driverSockets = userSocketMap.get(driverId.toString());
            const riderSockets = userSocketMap.get(ride.riderId.toString());

            if (driverSockets) {
                driverSockets.forEach(socketId => {
                    const socket = io.sockets.sockets.get(socketId);
                    if (socket) {
                        console.log("Driver Joined Ride Room: ride:" + rideId.toString());
                        socket.join(`ride-accepted-${rideId.toString()}`);
                    }
                });
            }

            if (riderSockets) {
                riderSockets.forEach(socketId => {
                    const socket = io.sockets.sockets.get(socketId);
                    if (socket) {
                        console.log("Rider Joined Ride Room: ride:" + rideId.toString());
                        socket.join(`ride-accepted-${rideId.toString()}`);
                    }
                });
            }

            // const payload = {
            //     rideId: ride._id,
            //     riderId: ride.riderId,
            //     driver: {
            //         _id: driver._id,
            //         name: driver.name,
            //         profilePicture: driver.profilePicture,
            //         rating: driver.rating,
            //         totalReviews: driver.totalReviews,
            //         carInformation: driver.carInformation
            //     },
            //     rider: {
            //         _id: rider._id,
            //         name: rider.name,
            //         profilePicture: rider.profilePicture,
            //         rating: rider.rating,
            //         totalReviews: rider.totalReviews,
            //     }
            // }

            io.to(`ride-accepted-${rideId.toString()}`).emit('ride-accepted', {
                rideId,
                riderId: ride.riderId,
            });


            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            console.log("failed to accept bid", error);
            callback({
                success: false,
                message: (error as Error).message || "Failed to accept bid",
                data: null,
            });
        } finally {
            await session.endSession();
        }


        // ConversationSocket.emitNewMessageToConversation({
        // 	socket,
        // 	conversationId,
        // 	message: data,
        // });

        callback({
            success: true,
            message: "Bid accepted successfully",
            data: null,
        });
    });

    socket.on("cancel-bid", async (data, callback = () => { }) => {

        const { rideId, driverId } = data;
        const { _id } = socket.payload;

        // if (!data || !data.conversationId || !data.message) {
        // 	callback({
        // 		success: false,
        // 		message: "Invalid data",
        // 		data: null,
        // 	});
        // }

        const ride = await RideRequest.findOne({
            _id: rideId,
        });

        if (!ride) {
            console.log("ride not found");
            callback({
                success: false,
                message: "Ride not found",
                data: null,
            });
            return;
        }


        // ConversationSocket.emitNewMessageToConversation({
        // 	socket,
        // 	conversationId,
        // 	message: data,
        // });

        const userSockets = userSocketMap.get(driverId.toString());
        if (userSockets) {
            userSockets.forEach(socketId => {
                const userSocket = io.sockets.sockets.get(socketId);
                if (userSocket) {
                    io.to(socketId).emit('cancel-bid', {
                        rideId,
                        driverId,
                    });
                }
            });
        }

        callback({
            success: true,
            message: "Message sent successfully",
            data: null,
        });
    });

    // update ride status to "ONGOING" after driver pickup rider

    socket.on("pickup-rider", async (data, callback = () => { }) => {

        const { _id } = socket.payload;

        // if (!data || !data.conversationId || !data.message) {
        // 	callback({
        // 		success: false,
        // 		message: "Invalid data",
        // 		data: null,
        // 	});
        // }

        const driver = await User.findOne({
            _id,
        });

        if (!driver) {
            console.log("driver not found");
            callback({
                success: false,
                message: "Driver not found",
                data: null,
            });
            return;
        }

        const ride = await RideRequest.findOne({
            _id: driver.engagedRideId,
        });

        if (!ride) {
            console.log("ride not found");
            callback({
                success: false,
                message: "Ride not found",
                data: null,
            });
            return;
        }




        if (ride.driverId && ride.driverId.toString() !== _id.toString()) {
            console.log("You are not the driver of this ride");
            callback({
                success: false,
                message: "You are not the driver of this ride",
                data: null,
            });
            return;
        }

        if (ride.status !== "ACCEPTED") {
            console.log("ride not accepted");
            callback({
                success: false,
                message: "Ride not accepted",
                data: null,
            });
            return;
        }

        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            ride.status = "ONGOING";
            await ride.save({ session });

            io.to(`ride-accepted-${ride._id.toString()}`).emit('ride-picked-up', {
                rideId: ride._id,
            });


            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            console.log("failed to accept bid", error);
            callback({
                success: false,
                message: (error as Error).message || "Failed to accept bid",
                data: null,
            });
        } finally {
            await session.endSession();
        }


        // ConversationSocket.emitNewMessageToConversation({
        // 	socket,
        // 	conversationId,
        // 	message: data,
        // });

        callback({
            success: true,
            message: "Ride picked up successfully",
            data: null,
        });
    });

    socket.on("drop-off-rider", async (data, callback = () => { }) => {

        const { _id } = socket.payload;


        const driver = await User.findOne({
            _id,
        });

        if (!driver) {
            console.log("driver not found");
            callback({
                success: false,
                message: "Driver not found",
                data: null,
            });
            return;
        }

        const ride = await RideRequest.findOne({
            _id: driver.engagedRideId,
        });

        if (!ride) {
            console.log("ride not found");
            callback({
                success: false,
                message: "Ride not found",
                data: null,
            });
            return;
        }



        if (ride.driverId && ride.driverId.toString() !== _id.toString()) {
            console.log("You are not the driver of this ride");
            callback({
                success: false,
                message: "You are not the driver of this ride",
                data: null,
            });
            return;
        }

        if (ride.status !== "ONGOING") {
            console.log("ride not ongoing");
            callback({
                success: false,
                message: "Ride not ongoing",
                data: null,
            });
            return;
        }

        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            ride.status = "COMPLETED";
            await ride.save({ session });

            driver.engagedRideId = null;
            driver.isEngaged = false;
            await driver.save({ session });

            const rider = await User.findOne({
                _id: ride.riderId,
            });

            if (!rider) {
                throw new Error("Rider not found");
            }

            rider.engagedRideId = null;
            rider.isEngaged = false;
            await rider.save({ session });

            io.to(`ride-accepted-${ride._id.toString()}`).emit('ride-completed', {
                rideId: ride._id,
                paymentMethod: ride.paymentMethod
            });


            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            console.log("failed to accept bid", error);
            callback({
                success: false,
                message: (error as Error).message || "Failed to accept bid",
                data: null,
            });
        } finally {
            await session.endSession();
        }

        callback({
            success: true,
            message: "Ride completed successfully",
            data: null,
        });
    });

    socket.on("cancel-ride", async (data, callback = () => { }) => {


        const { rideId, reason } = data;

        const { _id } = socket.payload;


        const user = await User.findOne({
            _id,
        });

        if (!user) {
            console.log("user not found");
            callback({
                success: false,
                message: "User not found",
                data: null,
            });
            return;
        }

        const ride = await RideRequest.findOne({
            _id: rideId,
        });

        if (!ride) {
            console.log("ride not found");
            callback({
                success: false,
                message: "Ride not found",
                data: null,
            });
            return;
        }



        if (ride.riderId.toString() !== _id.toString()) {
            console.log("You are not the rider of this ride");
            callback({
                success: false,
                message: "You are not the rider of this ride",
                data: null,
            });
            return;
        }

        if (ride.status == "ONGOING" || ride.status == "ACCEPTED" || ride.status == "COMPLETED") {
            console.log("ride is not in the right state");
            callback({
                success: false,
                message: "Ride is not in the right state to be cancelled",
                data: null,
            });
            return;
        }

        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            ride.status = "CANCELLED";
            ride.cancellationInfo = {
                cancelledAt: new Date(),
                cancelledBy: "RIDER",
                reason,
            }
            await ride.save({ session });

            user.engagedRideId = null;
            user.isEngaged = false;
            await user.save({ session });

            const driver = await User.findOne({
                _id: ride.driverId,
            });

            if (!driver) {
                throw new Error("Driver not found");
            }

            driver.engagedRideId = null;
            driver.isEngaged = false;
            await driver.save({ session });

            io.to(`ride-${ride._id.toString()}`).emit('ride-cancelled', {
                rideId: ride._id,
            });

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            console.log("failed to accept bid", error);
            callback({
                success: false,
                message: (error as Error).message || "Failed to accept bid",
                data: null,
            });
        } finally {
            await session.endSession();
        }

        callback({
            success: true,
            message: "Ride completed successfully",
            data: null,
        });
    });

};