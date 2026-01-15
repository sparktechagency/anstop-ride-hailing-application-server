import { Types } from "mongoose";
import { INBOX_STATUS } from "./inbox.constant";


type TInboxStatus = (typeof INBOX_STATUS)[keyof typeof INBOX_STATUS];

interface IInbox {
	_id: Types.ObjectId;
	conversationId: Types.ObjectId;
	participantId: Types.ObjectId;
	messageId: Types.ObjectId;
	status: TInboxStatus;
}

export { IInbox };
