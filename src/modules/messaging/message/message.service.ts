import mongoose, { ClientSession, Types } from "mongoose";
import { Conversation } from "../conversation/conversation.model";
import { SendMessageDTO } from "./message.dto";
import { Participant } from "../participant/participant.model";
import { Message } from "./message.model";
import ApiError from "../../../utils/ApiError";
import httpStatus from "http-status";
import { User } from "../../user/user.model";
import { TPaginateOptions } from "../../../types/paginate";
import { conversationPrivateService } from "../conversation/conversation.service";
import { InboxPrivateService } from "../inbox/inbox.service";
import { MessageSocket } from "../../../socket/modules/messaging/message/message.socket";
import { ParticipantPrivateService } from "../participant/participant.service";

// const sendMessage = async (userId: string, payload: SendMessageDTO) => {
// 	const reciver = await User.findOne({ _id: payload.receiver });
// 	if (!reciver) {
// 		throw new ApiError(
// 			httpStatus.NOT_FOUND,
// 			"Receiver not exist or deleted"
// 		);
// 	}

// 	const hasConversation =
// 		await conversationPrivateService.doesUsersHavePrivateConversation({
// 			userAId: userId,
// 			userBId: payload.receiver,
// 		});

// 	if (hasConversation) {
// 		throw new ApiError(
// 			httpStatus.BAD_REQUEST,
// 			"Conversation already exist. Please use inbox to send message."
// 		);
// 	}

// 	const session = await mongoose.startSession();
// 	try {
// 		session.startTransaction();

// 		const conversation =
// 			await conversationPrivateService.createPrivateConversation(
// 				{
// 					participants:{

// 					}
// 				}
// 			);

// 		const conversationId = conversation[0]._id;

// 		//

// 		await ParticipantPrivateService.createParticipant(
// 			{
// 				conversationId: conversationId.toString(),
// 				userId,
// 			},
// 			{
// 				session,
// 			}
// 		);

// 		await ParticipantPrivateService.createParticipant(
// 			{
// 				conversationId: conversationId.toString(),
// 				userId: payload.receiver,
// 			},
// 			{
// 				session,
// 			}
// 		);

// 		const message = await createMessage(
// 			{
// 				sender: userId,
// 				conversation: conversationId.toString(),
// 				text: payload.text,
// 			},
// 			{
// 				session,
// 			}
// 		);

// 		await InboxPrivateService.createInbox(
// 			{
// 				messageId: message[0]._id,
// 				conversationId,
// 				participantId: new Types.ObjectId(payload.receiver),
// 			},
// 			{
// 				session,
// 			}
// 		);

// 		const messagePayload = {
// 			_id: message[0]._id,
// 			sender: message[0].sender,
// 			conversation: message[0].conversation,
// 			text: message[0].text,
// 			attachments: message[0].attachments,
// 			updatedAt: message[0].updatedAt,
// 		};

// 		MessageSocket.emitNewMessageToUser({
// 			conversationId: conversationId.toString(),
// 			message: messagePayload,
// 			userId: userId,
// 		});

// 		await session.commitTransaction();
// 		return message;
// 	} catch (error) {
// 		console.log("error", error);
// 		await session.abortTransaction();
// 		throw new ApiError(
// 			httpStatus.INTERNAL_SERVER_ERROR,
// 			(error as Error).message || "Failed to send message"
// 		);
// 	} finally {
// 		await session.endSession();
// 	}
// };

const getAllMessagesInConversation = async (
	payload: { user: string; conversation: string },
	options: TPaginateOptions
) => {
	const conversation = await Conversation.findOne({
		_id: payload.conversation,
	});
	if (!conversation) {
		throw new ApiError(httpStatus.NOT_FOUND, "Conversation not found");
	}

	// Check if user is part of the conversation
	const participant = await Participant.findOne({
		conversation: conversation._id,
		user: payload.user,
	});
	if (!participant) {
		throw new ApiError(
			httpStatus.FORBIDDEN,
			"You are not a participant of this conversation"
		);
	}

	console.log("payload:", options);

	return await Message.paginate(
		{ conversation: payload.conversation },
		{
			...options,
			sortBy: "-createdAt",
			// sortOrder: 1,
			populate: {
				path: "sender",
				select: "name profilePicture",
			},
		}
	);
};

export const MessageService = {
	// sendMessage,
	getAllMessagesInConversation,
};

// Private

const createMessage = async (
	payload: {
		conversation: string;
		sender: string;
		text?: string;
		attachments?: string[];
	},
	options?: {
		session?: ClientSession;
	}
) => {
	const session = options?.session;

	// Check if user is part of the conversation
	const participant = await Participant.findOne({
		conversation: new Types.ObjectId(payload.conversation),
		user: new Types.ObjectId(payload.sender),
	}).session(session || null);

	console.log("payload:", payload, "participant:", participant);

	if (!participant) {
		throw new ApiError(
			httpStatus.FORBIDDEN,
			"You are not a participant of this conversation"
		);
	}

	return await Message.create(
		[
			{
				conversation: payload.conversation,
				sender: payload.sender,
				text: payload.text,
				attachments: payload.attachments,
			},
		],
		{
			session,
		}
	);
};

export const MessagePrivateService = {
	createMessage,
};
