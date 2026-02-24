// socketHandler.ts
import { Socket } from "socket.io";
import { eventRegistry } from "./eventRegistry";
import SocketError from "./utils/socketError";
import SocketResponse from "./utils/socketResponse";

export const registerSocket = (socket: Socket) => {

    socket.onAny(async (event, payload, ack) => {
        try {
            const eventConfig = eventRegistry[event];


            if (!eventConfig) {
                return safeAck(ack, new SocketError(event, "Event not found", null));
            }


            const validation = eventConfig.schema.safeParse(payload);

            if (!validation.success) {
                return safeAck(ack, new SocketError(event, "Validation error", validation.error.errors));
            }


            const result = await eventConfig.handler(socket, validation.data);

            return safeAck(ack, new SocketResponse("Operation successful", result));
        } catch (err: any) {

            console.log(err)

            return safeAck(ack, new SocketError(event, err.message || "Internal server error", null));
        }
    });

};

function safeAck(ack: any, response: SocketError | SocketResponse) {
    console.log(response)
    if (typeof ack === "function") {
        ack(response);
    }
}