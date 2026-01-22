import { Socket, Server } from "socket.io";
import { User } from "../modules/user/user.model";
import { addToMap, removeFromMap, userSocketMap } from "./utils/socketStore";
import SocketError from "./utils/socketError";
import { ConversationService } from "../modules/messaging/conversation/conversation.service";
import { InboxService } from "../modules/messaging/inbox/inbox.service";

export const connectionLifecycleHandler = async (
	socket: Socket,
	io: Server
) => {
	try {
		const { _id } = socket.payload;

		if (!_id) {
			throw new SocketError(
				"connection",
				"User ID not found in payload",
				null
			);
		}

		const user = await User.findById(_id).select("_id role isOnline");
		if (!user) {
			throw new SocketError("connection", "User not found", null);
		}

		if (!user.isOnline) {
			user.isOnline = true;
			await user.save();
		}

		socket.join(user._id.toString());

		// send undelivered messages to user

		const undeliveredMessages = await InboxService.getUndeliveredMessages(
			user._id
		);

		if (undeliveredMessages.length > 0) {
			io.to(user._id.toString()).emit("new-message", undeliveredMessages);
		}

		const roomId = user._id.toString();
		const isInRoom = io.sockets.adapter.rooms.get(roomId)?.has(socket.id);

		// add to map 
		addToMap(userSocketMap, user._id.toString(), socket.id);

		console.log(`Socket ${socket.id} in room ${roomId}?`, isInRoom); // should be true
		console.log(
			`User is online - 🎏 ${user._id} - ${user.role} - status: ${user.isOnline ?? "online"}`
		);
		socket.emit("connection-success", {
			message: `${user.role} connected successfully and is online`,
			data: {
				userId: user._id,
				role: user.role,
				inRoom: isInRoom,
			},
		});
	} catch (error) {
		socket.emit("connection-error", {
			message: "Error updating user presence",
			error,
		});
		console.error("error in connectionLifecycleHandler:", error);
		setTimeout(() => {
			socket.disconnect(true);
		}, 0);
	}
};

export const disconnectEventHandler = async (socket: Socket) => {
	console.log("disconnect event handler triggered");
	const { _id, role } = socket.payload;

	try {
		if (!_id) {
			console.error("User ID not found in socket payload");
			throw new SocketError("disconnect", "User ID not found", null);
		}

		if (!role) {
			console.error("Role not found in socket payload");
			throw new SocketError("disconnect", "Role not found", null);
		}
		let user = await User.findById(_id).select("_id role isOnline");

		if (!user) {
			console.error("User not found:", _id);
			throw new SocketError("disconnect", "User not found", null);
		}

		if (user.isOnline) {
			user.isOnline = false;
		}

		await user.save();
		removeFromMap(userSocketMap, user._id.toString(), socket.id);
		socket.leave(user._id.toString());

		console.log(`User is offline - 🏳️ ${user._id.toString()} - ${role}`);
	} catch (error: any) {
		console.error(`Error in handleDisconnect:`, error.stack || error);
		// TODO: handle error appropriately and retry mechanism
		return;
	}
};
