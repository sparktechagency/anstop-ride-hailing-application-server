import asyncHandler from "../../../utils/asyncHandler";
import { SendMessageDTO } from "./message.dto";
import { MessageService } from "./message.service";
import httpStatus from "http-status";
import ApiResponse from "../../../utils/ApiResponse";
import { TPaginateOptions } from "../../../types/paginate";

// const sendMessage = asyncHandler(async (req, res) => {
// 	const userId = req.user._id.toString();
// 	const payload: SendMessageDTO = req.body;
// 	const message = await MessageService.sendMessage(userId, payload);
// 	res.status(httpStatus.OK).json(
// 		new ApiResponse({
// 			statusCode: httpStatus.OK,
// 			message: "Message sent successfully",
// 			data: message,
// 		})
// 	);
// });

const getAllMessagesInConversation = asyncHandler(async (req, res) => {
	const userId = req.user._id.toString();
	const conversationId = req.params.conversationId;

	const options = {
		page: req.validatedData.query.page,
		limit: req.validatedData.query.limit,
		sortBy: req.validatedData.query.sortBy,
		sortOrder: req.validatedData.query.sortOrder,
	} as Omit<TPaginateOptions, "select" | "populate">;

	const messages = await MessageService.getAllMessagesInConversation(
		{
			user: userId,
			conversation: conversationId,
		},
		options
	);
	res.status(httpStatus.OK).json(
		new ApiResponse({
			statusCode: httpStatus.OK,
			message: "Messages fetched successfully",
			data: messages,
		})
	);
});

export const MessageController = {
	// sendMessage,
	getAllMessagesInConversation,
};
