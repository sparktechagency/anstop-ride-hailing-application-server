import { ClientSession, Types } from "mongoose";
import { INBOX_STATUS } from "./inbox.constant";
import Inbox from "./inbox.model";
import { Conversation } from "../conversation/conversation.model";
import { Participant } from "../participant/participant.model";

const getUndeliveredMessages = async (userId: Types.ObjectId) => {
	//console.log("userid", userId)
	// const undeliveredMessages = await Inbox.find({
	// 	participantId: userId,
	// 	status: INBOX_STATUS.SENT,
	// })
	// 	.sort({ createdAt: -1 })
	// 	.populate("messageId", "text")
	// 	.populate("conversationId", "conversationType");

	const undeliveredMessages = await Inbox.aggregate([
		{
			$match: {
				participantId: userId,
				status: INBOX_STATUS.SENT,
			},
		},
		{
			$lookup: {
				from: "messages",
				localField: "messageId",
				foreignField: "_id",
				as: "message",
			},
		},
		{
			$unwind: "$message",
		},
		{
			$group: {
				_id: "$conversationId",
				totalMessageCount: { $sum: 1 },
				lastMessage: { $last: "$message.text" },
			},
		},
		{
			$sort: { createdAt: -1 },
		},
	]);
	return undeliveredMessages;
};

const createInbox = async (
	payload: {
		messageId: Types.ObjectId;
		conversationId: Types.ObjectId;
		participantId: Types.ObjectId;
	},
	options?: { session?: ClientSession }
) => {

	// check is participant part of the conversation

	const isParticipant = await Participant.findOne({
		conversation: payload.conversationId,
		user: payload.participantId,
	}).session(options?.session || null);
	console.log(isParticipant)
	if (!isParticipant) {
		throw new Error("Participant is not part of the conversation");
	}

	// Check if inbox already exist
	const inboxExist = await Inbox.findOne({
		messageId: payload.messageId,
		conversationId: payload.conversationId,
		participantId: payload.participantId,
	}).session(options?.session || null);
	if (inboxExist) {
		return inboxExist;
	}

	const inbox = await Inbox.create([payload], options);
	return inbox;
};

export const InboxService = {
	getUndeliveredMessages,
};


export const InboxPrivateService = {
	createInbox,
};