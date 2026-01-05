import Message from './message.model';
import { User } from '../user/user.model';
import { Types } from 'mongoose';
import { TSendMessage } from './message.validation';
import httpStatus from 'http-status'
import { TMessage } from './message.interface';
import ApiError from '../../utils/ApiError';

// View all messages in a chat
const viewAllMessages = async (tripId: string) => {
  // View all messages of a trip.
  const result = await Message.find({ tripId: new Types.ObjectId(tripId) });
  return result;
};

// Count unviewed messages
const unviewedMessagesCount = async (
  userId: string,
  chatId?: string
): Promise<number> => {
  const query: Record<string, any> = {
    chatId: new Types.ObjectId(chatId),
    receiverId: new Types.ObjectId(userId),
    isDeleted: false,
    seenBy: { $nin: [userId] },
  };

  return Message.countDocuments(query);
};


const sendMessage = async (payload: TSendMessage) => {

  const newMsg = await Message.create(payload);
  
  await newMsg.save();

  // Send socket events
  //@ts-ignore
  io.to(payload?.tripId).emit('new-message', {
    code: httpStatus.OK,
    message: 'Message sent successfully',
    data: newMsg,
  });

  return newMsg;
};

// Update message
const updateMessage = async (
  messageId: string,
  text: string
): Promise<TMessage | null> => {
  const message = await Message.findById(messageId);
  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Message not found');
  }
  message.content.text = text;
  await message.save();
  return message;
};

// Delete message
const deleteMessage = async (
  userId: string,
  messageId: string
): Promise<TMessage | null> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const message = await Message.findById(messageId);
  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Message not found');
  }
  if (message.sender.id.toString() !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You are not allowed to delete this message'
    );
  }
  message.isDeleted = true;
  await message.save();
  return message;
};

// Mark message as seen
const markMessageSeen = async (
  messageId: string,
  userId: string
): Promise<TMessage | null> => {
  const message = await Message.findByIdAndUpdate(
    messageId,
    {
      $addToSet: { seenBy: new Types.ObjectId(userId) },
      deliveryStatus: 'Seen',
    },
    { new: true }
  );

  if (message && message.tripId) {
    //@ts-ignore
    io.to(message.tripId).emit("seen-message", {
      code: httpStatus.OK,
      message: 'Message marked as seen',
      data: message,
    });
  }

  return message;
};


export const MessageService = {
  viewAllMessages,
  unviewedMessagesCount,
  sendMessage,
  updateMessage,
  deleteMessage,
  markMessageSeen
};
