import ApiResponse from "../../utils/ApiResponse";
import asyncHandler from "../../utils/asyncHandler";
import { TContent, TMessage, TMessageType } from "./message.interface";
import { MessageService } from "./message.service";
import { TSendMessage } from "./message.validation";
import httpStatus from "http-status";



const sendMessage = asyncHandler(async (req, res) => {
  const { _id, role } = req.user;
  const { content, tripId, messageType } = req.body;

  const payload: TSendMessage = {
    tripId,
    sender: {
      id: _id,
      role,
    },
    content,
    messageType,

  };

  // Send message via the service
  const result = await MessageService.sendMessage(payload);

  // Send success response
  res.status(httpStatus.CREATED).json(
          new ApiResponse({
              statusCode: httpStatus.CREATED,
              message: 'Message sent successfully',
              data: result,
          })
      );
});


const updateMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { message } = req.body;
  const result = await MessageService.updateMessage(messageId, message);
  res.status(httpStatus.OK).json(
    new ApiResponse({
      statusCode: httpStatus.OK,
      message: 'Message updated successfully',
      data: result,
    })
  )
});

const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const {_id: userId} = req.user;
  const message = await MessageService.deleteMessage(userId, messageId);
  res.status(httpStatus.OK).json(
    new ApiResponse({
      statusCode: httpStatus.OK,
      message: 'Message deleted successfully',
      data: message,
    })
  )
});

const markMessageSeen = asyncHandler(async (req , res) => {
  const { messageId } = req.params;
  const {_id: userId} = req.user;
  const message = await MessageService.markMessageSeen(messageId, userId);
  res.status(httpStatus.OK).json(
    new ApiResponse({
      statusCode: httpStatus.OK,
      message: 'Message marked as seen successfully',
      data: message,
    })
  )
});

const viewAllMessages = asyncHandler(async (req, res) => {
  const { tripId } = req.params;

  const messages = await MessageService.viewAllMessages(tripId);

  res.status(httpStatus.OK).json(
    new ApiResponse({
      statusCode: httpStatus.OK,
      message: 'Messages retrieved successfully',
      data: messages,
    })
  )
});



export const MessageController = {
  sendMessage,
  updateMessage,
  deleteMessage,
  markMessageSeen,
  viewAllMessages
};
