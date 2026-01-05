import { Server, Socket } from "socket.io";
import { emitSocketError } from "./utils/SocketError";
import { GetUserByIdAndRole } from "../utils/GetUserByIdAndRole";
import { handleDisconnect } from ".";
import { User } from "../modules/user/user.model";

export const connectionLifecycleHandler = (socket: Socket) => {
	socket.on("connect-event", async () => {
		try {
			const { userId, role } = socket.payload;

			if (!socket.payload || !userId || !role) {
				console.error("Unauthenticated user");
				emitSocketError({
					socket,
					message: "Unauthenticated user",
					statusCode: 401,
				});
				return;
			}
			const user = await User.findById(userId).select("_id role isOnline");
			if (!user) {
				emitSocketError({
					socket,
					message: "User does not exist",
					statusCode: 400,
				});
				return;
			}

			if (user.isOnline) {
				emitSocketError({
					socket,
					message: `User is already online - ${user._id}-${user.role}`,
					statusCode: 400,
				});
				return;
			}

			user.isOnline = true;
			await user.save();
			socket.join(user._id.toString());
			console.log("User got online - 🏳️ ", user._id.toString());
			// Confirm to client
			socket.emit("joined-room", user._id.toString());
			const roomId = user._id.toString();
			const isInRoom = io.sockets.adapter.rooms
				.get(roomId)
				?.has(socket.id);

			console.log(`Socket ${socket.id} in room ${roomId}?`, isInRoom); // should be true
		} catch (error) {
			emitSocketError({
				socket,
				message: "Error updating user presence",
				statusCode: 500,
			});
			console.error(`Error updating user presence: ${error}`);
			return;
		}
	});
	socket.on("ride-request", (data) => {
		console.log("ride-request", data);
		io.to(data.driverId).emit("ride-request", data);
	});
	socket.on("disconnect-event", () => handleDisconnect(socket));

};
