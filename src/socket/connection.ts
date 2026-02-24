import { Server, Socket } from "socket.io";
import { registerSocket } from "./socketHandler";

export const onConnection = async (io: Server, socket: Socket) => {
	// Note: All socket events are now centralized in socketHandler.ts using socket.onAny
	registerSocket(socket);
};
