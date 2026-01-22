import { Socket } from "socket.io";
import { INBOX_STATUS } from "../../../../modules/messaging/inbox/inbox.constant";
import Inbox from "../../../../modules/messaging/inbox/inbox.model";
import { userSocketMap } from "../../../utils/socketStore";

interface JoinConversationPayload {
	conversationId: string;
	participants: string[];
}

const joinConversation = async (payload: JoinConversationPayload) => {
	// logic to join a conversation room

	const room = GetConversationRooms(payload.conversationId);

	console.log("conversation-room", room);

	console.log("participant", payload);

	// Join the room for each participant
	payload.participants.forEach((participantId) => {
		const userSocket = userSocketMap.get(participantId);

		if (userSocket) {
			userSocket.forEach((socketId) => {
				const userSocket = io.sockets.sockets.get(socketId);
				if (userSocket) {
					userSocket.join(room);
					console.log(
						`Participant - ${participantId} - joined room. socket status - ${userSocket.connected}`
					);
				}
			});
		}
	});

	return true;
};

const GetConversationRooms = (conversationId: string) => {
	return `conversation_${conversationId}`;
};

const emitNewMessageToConversation = (payload: {
	socket: Socket;
	conversationId: string;
	message: {
		_id: string;
		text: string;
		attachments: string[];
	};
}) => {
	const { socket, conversationId, message } = payload || {};
	const room = GetConversationRooms(conversationId);

	socket.to(room).emit(
		`conversation-new-message`,
		message
		// async (data: { userId: string; messageId: string }) => {
		// 	// handle client acknowledgement
		// 	await Inbox.findOneAndUpdate(
		// 		{
		// 			messageId: data?.messageId,
		// 			participantId: data?.userId,
		// 		},
		// 		{
		// 			status: INBOX_STATUS.DELIVERED,
		// 		}
		// 	);
		// }
	);
};

const conversationEventHandler = (socket: Socket) => {
	socket.on("join-conversation", async (data) => {
		// if (!data || !data.conversationId || !data.participants) {
		// 	console.log("invalid data");
		// 	return;
		// }

		const result = await joinConversation({
			conversationId: data.conversationId,
			participants: [socket.payload._id.toString()],
		});
	});
};

export const ConversationSocket = {
	joinConversation,
	GetConversationRooms,
	emitNewMessageToConversation,
	conversationEventHandler,
};
