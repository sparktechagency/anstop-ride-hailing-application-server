import { Socket } from "socket.io";
import { ParticipantPrivateService } from "../../../../modules/messaging/participant/participant.service";
import { ConversationSocket } from "../conversation/conversation.socket";
import { Conversation } from "../../../../modules/messaging/conversation/conversation.model";
import { Participant } from "../../../../modules/messaging/participant/participant.model";
import mongoose, { Types } from "mongoose";
import { MessagePrivateService } from "../../../../modules/messaging/message/message.service";
import { InboxPrivateService } from "../../../../modules/messaging/inbox/inbox.service";
import SocketError from "../../../utils/socketError";

const emitNewMessageToUser = async (payload: {
	userId: string;
	conversationId: string;
	messageInfo: any;
}) => {
	const { userId, conversationId, messageInfo } = payload || {};

	console.log({
		conversation: conversationId,
		message: messageInfo,
	});

	const participants =
		await ParticipantPrivateService.GetConversationsParticipants(
			conversationId
		);

	participants.forEach((participant) => {
		if (participant.toString() === userId) return;

		io.to(participant.toString()).emit(
			`new-message`,
			messageInfo
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
	});
};

export const sendMessageEventHandler = async (socket: Socket, data: any) => {

	const { conversationId, text, attachments } = data;
	const { _id: userId } = socket.payload;

	const conversation = await Conversation.findOne({
		_id: conversationId,
	});

	if(!conversation){
		throw new SocketError("send-new-message", "Conversation not found", null);
	}


	const isParticipant = await Participant.findOne({
		conversation: conversationId,
		user: userId,
	});

	if (!isParticipant) {
		throw new SocketError("send-new-message", "You are not a participant of this conversation", null);
	}

	const session = await mongoose.startSession();

	try {
		session.startTransaction();

		const message = await MessagePrivateService.createMessage(
			{
				conversation: conversationId,
				sender: userId,
				text,
				attachments,
			},
			{ session }
		);

		await InboxPrivateService.createInbox(
			{
				messageId: message[0]?._id,
				conversationId,
				participantId: new Types.ObjectId(userId),
			},
			{ session }
		);

		await session.commitTransaction();
	} catch (error) {
		await session.abortTransaction();
		console.log("failed to send message", error);
		throw new SocketError("send-new-message", "Failed to send message", null);
	} finally {
		await session.endSession();
	}

	emitNewMessageToUser({
		userId: socket.payload._id.toString(),
		conversationId: data.conversationId,
		messageInfo: data,
	});

};

export const MessageSocket = {
	emitNewMessageToUser,
	sendMessageEventHandler,
};
