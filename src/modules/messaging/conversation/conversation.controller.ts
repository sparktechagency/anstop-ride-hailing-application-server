import { Types } from "mongoose";
import ApiResponse from "../../../utils/ApiResponse";
import asyncHandler from "../../../utils/asyncHandler";
import { ConversationService } from "./conversation.service";
import httpStatus from "http-status";

const GetConversation = asyncHandler(async (req, res) => {
	const userId = req.user._id.toString();
	const conversationId = req.params.conversationId;
	const conversation = await ConversationService.getUserConversation(
		new Types.ObjectId(userId)
	);
	res.status(httpStatus.OK).json(
		new ApiResponse({
			statusCode: httpStatus.OK,
			message: "Conversation retrieved successfully",
			data: conversation,
		})
	);
});

export const ConversationController = {
	GetConversation,
};
