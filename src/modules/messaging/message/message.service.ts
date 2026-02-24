import mongoose, { ClientSession, Types } from "mongoose";
import { Conversation } from "../conversation/conversation.model";
import { SendMessageDTO } from "./message.dto";
import { Participant } from "../participant/participant.model";
import { Message } from "./message.model";
import ApiError from "../../../utils/ApiError";
import httpStatus from "http-status";
import { TPaginateOptions } from "../../../types/paginate";

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
