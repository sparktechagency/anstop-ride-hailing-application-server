import { Conversation } from "./conversation/conversation.model";
import Inbox from "./inbox/inbox.model";
import { Message } from "./message/message.model";
import { Participant } from "./participant/participant.model";

export const deleteMessageEntities = async () => {
    await Message.deleteMany({});
    await Conversation.deleteMany({});
    await Participant.deleteMany({});
    await Inbox.deleteMany({});
}