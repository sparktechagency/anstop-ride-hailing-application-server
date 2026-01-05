import mongoose from "mongoose";
import { Server, Socket } from "socket.io";
import { emitSocketError } from "./utils/SocketError";
import { UserRoles } from "../shared/shared.interface";
import { GetUserByIdAndRole } from "../utils/GetUserByIdAndRole";
import { connectionLifecycleHandler } from "./connectionLifecycleHandler";
import {
	driverSocketMap,
	removeSocketFromMap,
	userSocketMap,
} from "./utils/socketStore";
import { updateLocation } from "./updateLocation";
import { User } from "../modules/user/user.model";

const onConnection = (io: Server, socket: Socket) => {
	console.log(
		"socket connected: connection event triggered 💸💸",
		io.path,
		socket.id,
		socket.payload
	);
	connectionLifecycleHandler(socket);
	updateLocation(io, socket);

	socket.on("join-room", (data) => {
		console.log(data);
		socket.join(data.roomId);
		console.log("joined room", data.roomId);
	});

	socket.on("message", (data) => {
		io.to(data.roomId).emit("message", data.message);
	});
};

export const handleDisconnect = async (socket: Socket) => {
	if (!socket.payload || !socket.payload.userId || !socket.payload.role) {
		console.error("Unauthenticated user");
		return;
	}

	const { userId, role } = socket.payload;
	console.log("reaching here", role);

	if (!userId || !role) {
		console.error(`Unauthenticated user: ${userId}-${role}`);
		emitSocketError({
			socket,
			message: "Unauthenticated user",
			statusCode: 401,
		});
		return;
	}

	if (!mongoose.Types.ObjectId.isValid(userId)) {
		console.error(`Invalid user ID: ${userId}`);
		emitSocketError({
			socket,
			message: "Invalid user ID",
			statusCode: 400,
		});
		return;
	}

	if (!role || (role !== UserRoles.Driver && role !== UserRoles.Rider)) {
		console.error(`Invalid role: ${role}`);
		emitSocketError({
			socket,
			message: "Invalid role",
			statusCode: 400,
		});
		return;
	}

	try {
		let user = await User.findById(userId);
		if (!user) {
			console.error(
				`The user does not exist: ${userId.toString()}-${role}`
			);
			emitSocketError({
				socket,
				message: `The user does not exist: ${userId.toString()}-${role}`,
				statusCode: 400,
			});
			return;
		}

		if (!user.isOnline) {
			console.error(`${role} is not online: ${userId}`);
			emitSocketError({
				socket,
				message: `${role} is not online: ${userId}`,
				statusCode: 400,
			});
			return;
		}

		user.isOnline = false;
		await user.save();
		if (role === UserRoles.Rider) {
			removeSocketFromMap(userSocketMap, userId, socket.id);
		} else if (role === UserRoles.Driver) {
			removeSocketFromMap(driverSocketMap, userId, socket.id);
		}
		socket.leave(userId);
	} catch (error: any) {
		console.error(`Error in handleDisconnect:`, error.stack || error);
		emitSocketError({
			socket,
			message: "Error in handleDisconnect",
			statusCode: 500,
			error,
		});
		return;
	}
};

export const SocketHandler = (io: Server) => {
	io.on("connection", (socket: Socket) => {
		global.socket = socket;
		onConnection(io, socket);

		socket.on("disconnect", () => {
			handleDisconnect(socket);
		});
	});
};
