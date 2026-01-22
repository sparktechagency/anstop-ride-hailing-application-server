import { Server, Socket } from "socket.io";
import { onConnection } from "./connection";
import {
	connectionLifecycleHandler,
	disconnectEventHandler,
} from "./connectionLifeCycle";

export const SocketHandler = (io: Server) => {
	io.on("connection", async (socket: Socket) => {
		socket.on("disconnect", () => {
			console.log("disconnect event triggered");
			disconnectEventHandler(socket);
		});

		await connectionLifecycleHandler(socket, io);
		onConnection(io, socket);
	});
};
