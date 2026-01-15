import { model, Schema } from "mongoose";
import { IInbox } from "./inbox.interface";
import { INBOX_STATUS } from "./inbox.constant";

const inboxSchema = new Schema<IInbox>(
	{
		conversationId: {
			type: Schema.Types.ObjectId,
			ref: "Conversation",
			required: true,
		},
		participantId: {
			type: Schema.Types.ObjectId,
			ref: "Participant",
			required: true,
		},
		messageId: {
			type: Schema.Types.ObjectId,
			ref: "Message",
			required: true,
		},
		status: {
			type: String,
			enum: Object.values(INBOX_STATUS),
			default: INBOX_STATUS.SENT,
		},
	},
	{
		timestamps: true,
	}
);

const Inbox = model<IInbox>("Inbox", inboxSchema);

export default Inbox;
