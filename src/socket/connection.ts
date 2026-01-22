import { Server, Socket } from "socket.io";
import { ConversationSocket } from "./modules/messaging/conversation/conversation.socket";
import { MessageSocket } from "./modules/messaging/message/message.socket";
import { RideEventHandler } from "./modules/ride";

export const onConnection = async (io: Server, socket: Socket) => {
	ConversationSocket.conversationEventHandler(socket);
	MessageSocket.MessageEventHandler(socket);
	RideEventHandler(socket);
};
