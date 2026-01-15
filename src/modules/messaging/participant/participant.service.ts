// Do user A and user B share at least one conversation?

import { ClientSession, Types } from "mongoose";
import { Participant } from "./participant.model";
import { Conversation } from "../conversation/conversation.model";

export const hasParticipantShareCoversation = async (
	userAId: Types.ObjectId,
	userBId: Types.ObjectId
) => {
	const result = await Participant.aggregate([
		{
			$match: {
				user: { $in: [userAId, userBId] },
			},
		},
		{
			$group: {
				_id: "$conversation",
				users: { $addToSet: "$user" },
			},
		},
		{
			$match: {
				$expr: { $eq: [{ $size: "$users" }, 2] },
			},
		},
		{
			$limit: 1,
		},
	]);

	const sharedConversationExists = result.length > 0;

	console.log(sharedConversationExists, result);
};

// private

const GetConversationsParticipants = async (conversationId: string) => {
	return await Participant.find({ conversation: conversationId }).distinct(
		"user"
	);
};

const createParticipant = async (
	payload: {
		conversationId: Types.ObjectId;
		userId: Types.ObjectId;
	},
	options?: { session: ClientSession }
) => {
	const { conversationId, userId } = payload || {};
	const session = options?.session;

	// check is conversation exist
	const conversation = await Conversation.findOne({
		_id: conversationId,
	}).session(session || null);
	if (!conversation) {
		throw new Error("Conversation not found");
	}

	const existingParticipant = await Participant.findOne({
		conversation: conversationId,
		user: userId,
	}).session(session || null);

	if (existingParticipant) {
		return existingParticipant;
	}

	const participant = new Participant({
		conversation: conversationId,
		user: userId,
	});
	return await participant.save({ session });
};

export const ParticipantPrivateService = {
	createParticipant,
	GetConversationsParticipants,
};
