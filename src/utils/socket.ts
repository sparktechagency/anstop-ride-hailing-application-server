// import { Server, Socket } from "socket.io";
// import mongoose from "mongoose";
// import { User } from "../modules/user/user.model";
// import ApiError from "./ApiError";
// import { emitSocketError } from "./SocketError";
// import { Driver } from "../modules/driver/driver.model";



// // const socket = (io: Server) => {
// // 	io.on("connection", (socket: Socket) => {
// // 		socket.on("user-connected", (userId: string) => {
// // 			if (!mongoose.Types.ObjectId.isValid(userId)) {
// // 				console.error(`Invalid user ID: ${userId}`);
// // 				return;
// // 			}
// // 			socket.userId = userId;
// // 			socket.join(userId); // Join the room for the specific user
// // 		});

// // 		socket.on("user/connect", async ({ userId }) => {
// // 			if (!mongoose.Types.ObjectId.isValid(userId)) {
// // 				console.error(`Invalid user ID: ${userId}`);
// // 				return;
// // 			}
// // 			try {
// // 				socket.userId = userId;
// // 				socket.join(userId);
// // 				await User.updateOne(
// // 					{ _id: userId },
// // 					{ $set: { isOnline: true } }
// // 				);
// // 				socket.broadcast.emit("user/connect", userId);
// // 			} catch (error) {
// // 				console.error(`Error in user/connect: ${error}`);
// // 			}
// // 		});
// // 		socket.on("user/connectInMessageBox", async ({ userId }) => {
// // 			if (!mongoose.Types.ObjectId.isValid(userId)) {
// // 				console.error(`Invalid user ID: ${userId}`);
// // 				return;
// // 			}

// // 			try {
// // 				socket.userId = userId;
// // 				await User.updateOne(
// // 					{ _id: userId },
// // 					{ $set: { isInMessageBox: true } }
// // 				);
// // 			} catch (error) {
// // 				console.error(`Error in user/connectInMessageBox: ${error}`);
// // 			}
// // 		});

// // 		socket.on("user/disconnectInMessageBox", async ({ userId }) => {
// // 			if (!mongoose.Types.ObjectId.isValid(userId)) {
// // 				console.error(`Invalid user ID: ${userId}`);
// // 				return;
// // 			}

// // 			try {
// // 				socket.userId = userId;
// // 				await User.updateOne(
// // 					{ _id: userId },
// // 					{ $set: { isInMessageBox: false } }
// // 				);
// // 			} catch (error) {
// // 				console.error(`Error in user/disconnectInMessageBox: ${error}`);
// // 			}
// // 		});

// // 		const handleDisconnect = async () => {
// // 			if (
// // 				!socket.userId ||
// // 				!mongoose.Types.ObjectId.isValid(socket.userId)
// // 			) {
// // 				return;
// // 			}
// // 			try {
// // 				await User.updateOne(
// // 					{ _id: socket.userId },
// // 					{ $set: { isOnline: false, isInMessageBox: false } }
// // 				);
// // 				socket.broadcast.emit("user/disconnect", socket.userId);
// // 			} catch (error) {
// // 				console.error(`Error in handleDisconnect: ${error}`);
// // 			}
// // 		};

// // 		socket.on("disconnect", handleDisconnect);
// // 		socket.on("user/disconnect", handleDisconnect);
// // 	});
// // };

// const socket = (io: Server) => {
// 	io.on("connection", (socket: Socket) => {
// 		console.log(socket.handshake.auth);

// 		console.log("connection event triggered");

// 		socket.on("user-connected", (userId: string) => {
// 			if (!mongoose.Types.ObjectId.isValid(userId)) {
// 				console.error(`Invalid user ID: ${userId}`);
// 				return;
// 			}
// 			socket.userId = userId;
// 			socket.join(userId); // Join the room for the specific user
// 		});

// 		socket.on("connect-driver", async ({ userId }) => {
// 			if (!mongoose.Types.ObjectId.isValid(userId)) {
// 				console.error(`Invalid user ID: ${userId}`);
// 				emitSocketError({
// 					socket,
// 					message: "Invalid user ID",
// 					statusCode: 400,
// 				});
// 				return;
// 			}
// 			try {
// 				const driver = await Driver.findById(userId);
// 				if (!driver) {
// 					emitSocketError({
// 						socket,
// 						message: "Driver does not exist",
// 						statusCode: 400,
// 					});
// 					return;
// 				}

// 				if (driver.isOnline) {
// 					emitSocketError({
// 						socket,
// 						message: "Driver is already online",
// 						statusCode: 400,
// 					});
// 					return;
// 				}

// 				driver.isOnline = true;
// 				await driver.save();

// 				socket.userId = userId;
// 			} catch (error) {
// 				console.error(`failed to connect driver: ${error}`);
// 				emitSocketError({
// 					socket,
// 					message: "failed to connect driver",
// 				});
// 			}
// 		});

// 		socket.on("disconnect-driver", async ({ userId }) => {
// 			if (!mongoose.Types.ObjectId.isValid(userId)) {
// 				console.error(`Invalid user ID: ${userId}`);
// 				emitSocketError({
// 					socket,
// 					message: "Invalid user ID",
// 					statusCode: 400,
// 				});
// 				return;
// 			}
// 			try {
// 				const driver = await Driver.findById(userId);
// 				if (!driver) {
// 					emitSocketError({
// 						socket,
// 						message: "Driver does not exist",
// 						statusCode: 400,
// 					});
// 					return;
// 				}

// 				if (!driver.isOnline) {
// 					emitSocketError({
// 						socket,
// 						message: "Driver is not online",
// 						statusCode: 400,
// 					});
// 					return;
// 				}

// 				driver.isOnline = false;
// 				await driver.save();
// 				socket.userId = userId;
// 				handleDisconnect();
// 			} catch (error) {
// 				console.error(`failed to disconnect driver: ${error}`);
// 				emitSocketError({
// 					socket,
// 					message: "failed to disconnect driver",
// 				});
// 			}
// 		});

// 		const handleDisconnect = async () => {
// 			if (
// 				!socket.userId ||
// 				!mongoose.Types.ObjectId.isValid(socket.userId)
// 			) {
// 				return;
// 			}
// 			try {
// 				await User.updateOne(
// 					{ _id: socket.userId },
// 					{ $set: { isOnline: false, isInMessageBox: false } }
// 				);
// 				socket.broadcast.emit("user/disconnect", socket.userId);
// 			} catch (error) {
// 				console.error(`Error in handleDisconnect: ${error}`);
// 			}
// 		};

// 		socket.on("disconnect", handleDisconnect);
// 		socket.on("user/disconnect", handleDisconnect);
// 		socket.on("error", (error) => {
// 			console.error(`Socket error: ${error}`);
// 		});
// 	});
// };

// export const socketHelper = { socket };
