import { Socket } from "socket.io";
import httpStatus from "http-status";
import { TSocketResponse } from "./socketResponse";
import SocketError from "./socketError";

type SocketEventHandler = (data: any) => Promise<TSocketResponse>;

type SocketEvent = (
	handler: SocketEventHandler
) => (data: any, callback: (response: any) => void) => void;

export const handleSocketEvent: SocketEvent = (handler) => {
	return async (data, callback) => {
		console.log("envent triggered", data);
		try {
			const result = await handler(data);
			callback({
				success: true,
				message: result.message,
				data: result.data,
			});
		} catch (error) {
			console.error("Socket event error:", error);

			if (error instanceof SocketError) {
				callback(error.toResponse());
			} else {
				// Unexpected error
				callback(
					new SocketError(
						"unknown-error",
						"An unexpected error occurred",
						data
					).toResponse()
				);
			}
		}
	};
};
