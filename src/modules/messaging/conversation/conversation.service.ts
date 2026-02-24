import mongoose, { ClientSession, Types } from "mongoose";
import { CONVERSATION_TYPE } from "./conversation.interface";
import { Conversation } from "./conversation.model";
import { Participant } from "../participant/participant.model";
import ApiError from "../../../utils/ApiError";
import httpStatus from "http-status";
import { ConversationSocket } from "../../../socket/modules/messaging/conversation/conversation.socket";
import { ParticipantPrivateService } from "../participant/participant.service";

type TGetPrivateConversation = {
	participants: Types.ObjectId[];
	session?: mongoose.ClientSession;
};

const getPrivateConversation = async (payload: TGetPrivateConversation) => {
	//console.log("request reached to get private conversation")

	const existingConversation = await Conversation.aggregate([
		{
			$match: {
				conversationType: CONVERSATION_TYPE.PRIVATE,
			},
		},
		{
			$lookup: {
				from: "participants",
				localField: "_id",
				foreignField: "conversation",
				as: "participants",
			},
		},
		{
			$match: {
				"participants.user": { $all: payload.participants },
			},
		},
	]);

	if (existingConversation.length > 0) {
		//console.log("existingConversation", existingConversation[0]);
		return existingConversation[0];
	}

	const conversation = new Conversation({
		conversationType: CONVERSATION_TYPE.PRIVATE,
	});
	await conversation.save({ session: payload.session });

	await Participant.insertMany(
		[
			...payload.participants.map((p) => ({
				conversation: conversation._id,
				user: p,
			})),
		],
		{ session: payload.session }
	);

	//console.log("conversation id to join rooms:", conversation._id.toString());

	ConversationSocket.joinConversation({
		conversationId: conversation._id.toString(),
		participants: payload.participants.map((p) => p.toString()),
	});

	return conversation;
};

const getUserConversation = async (userId: Types.ObjectId) => {
	const conversations = await Conversation.aggregate([
		{
			$match: { conversationType: CONVERSATION_TYPE.PRIVATE },
		},
		{
			$lookup: {
				from: "participants",
				localField: "_id",
				foreignField: "conversation",
				as: "participants",
			},
		},
		{
			$match: {
				"participants.user": new Types.ObjectId(userId),
			},
		},
		{
			$unwind: "$participants",
		},
		{
			$match: {
				"participants.user": { $ne: new Types.ObjectId(userId) },
			},
		},
		{
			$lookup: {
				from: "users",
				localField: "participants.user",
				foreignField: "_id",
				as: "user",
				pipeline: [
					{
						$project: {
							username: 1,
							avatar: 1,
						},
					},
				],
			},
		},
		{
			$lookup: {
				from: "inboxes",
				localField: "_id",
				foreignField: "conversationId",
				as: "inbox",

				pipeline: [
					{
						$match: {
							participantId: new Types.ObjectId(userId),
							status: { $ne: "READ" },
						},
					},
					{
						$group: {
							_id: "$conversationId",
							unreadCount: { $sum: 1 },
							lastMessage: { $last: "$messageId" },
							lastMessageAt: { $last: "$createdAt" },
						},
					},
				],
			},
		},
		{
			$unwind: {
				path: "$inbox",
				preserveNullAndEmptyArrays: true,
			},
		},
		{
			$lookup: {
				from: "messages",
				localField: "inbox.lastMessage",
				foreignField: "_id",
				as: "lastMessage",
				pipeline: [
					{
						$project: {
							text: 1,
						},
					},
				],
			},
		},
	]);

	// //console.log("conversations", conversations);

	return conversations;
};


const GetConversationIds = async (userId: Types.ObjectId) => {
	const conversations = await Participant.find({ user: userId }).select(
		"conversation -_id"
	);
	if (!conversations) {
		throw new ApiError(
			httpStatus.NOT_FOUND,
			"Conversations not found for the user"
		);
	}
	return conversations.map((c) => c.conversation.toString());
};

// private methods

const generatePrivateHash = (payload: { userAId: string; userBId: string }) => {
	const { userAId, userBId } = payload;
	return userAId < userBId
		? `${userAId}:${userBId}`
		: `${userBId}:${userAId}`;
};

const doesUsersHavePrivateConversation = async (payload: {
	userAId: string;
	userBId: string;
}) => {
	const hash = generatePrivateHash(payload);
	const conversation = await Conversation.findOne({
		conversationType: "PRIVATE",
		privateHash: hash,
	});

	console.log("hasConversation", conversation);
	return !!conversation;
};


type TCreatePrivateConversation = {
	participants: {
		userAId: string;
		userBId: string;
	},
	options?: {
		session?: ClientSession;
	},
	conversationId: Types.ObjectId
}

const createPrivateConversation = async (
	payload: TCreatePrivateConversation,
) => {
	const { options, participants, conversationId } = payload;
	const session = options?.session;

	const hash = generatePrivateHash(participants);


	return await Conversation.create(
		[
			{
				_id: conversationId,
				conversationType: "PRIVATE",
				privateHash: hash,
			},
		],
		{
			session,
		}
	);


};


const createConversationBetweenDriverAndRider = async (payload: {
	driverId: string;
	riderId: string;
	rideId: Types.ObjectId
}) => {
	const session = await mongoose.startSession();
	try {
		session.startTransaction();
		const conversation = await createPrivateConversation(
			{
				participants: {
					userAId: payload.driverId,
					userBId: payload.riderId,
				},
				conversationId: payload.rideId,
				options: { session },
			}
		);

		await ParticipantPrivateService.createParticipant(
			{
				conversationId: conversation[0]._id,
				userId: new Types.ObjectId(payload.driverId),
			},
			{ session }
		);

		await ParticipantPrivateService.createParticipant(
			{
				conversationId: conversation[0]._id,
				userId: new Types.ObjectId(payload.riderId),
			},
			{ session }
		);
		await session.commitTransaction();
		return conversation;
	} catch (error) {
		await session.abortTransaction();
		throw error;
	} finally {
		await session.endSession();
	}
}

export const ConversationService = {
	getPrivateConversation,
	getUserConversation,
	GetConversationIds,
	// getUserConversationIds
};

export const conversationPrivateService = {
	doesUsersHavePrivateConversation,
	createPrivateConversation,
	generatePrivateHash,
	createConversationBetweenDriverAndRider,
};
