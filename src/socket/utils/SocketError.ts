import { Socket } from "socket.io";

type SocketError = {
	socket: Socket
	message: string;
	statusCode?: number;
	error?: any;
	event?: string;
};

export const emitSocketError = ({
	socket,
	message,
	statusCode = 500,
	error = null,
	event = "socket-error",
}: SocketError) => {
	console.error(`[${event}]`, message, error?.stack || error);
	socket.emit(event, {
		statusCode,
		message,
		error,
	});
};
