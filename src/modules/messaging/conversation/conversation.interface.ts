import { Types } from "mongoose";

const CONVERSATION_TYPE = {
	PRIVATE: "PRIVATE",
	GROUP: "GROUP",
} as const;

type TConversationType =
	(typeof CONVERSATION_TYPE)[keyof typeof CONVERSATION_TYPE];

interface IConversation {
	_id: Types.ObjectId;
	title?: string;
	privateHash?: string;
	conversationType: TConversationType;
	createdAt: Date;
	updatedAt: Date;
}

export { IConversation, TConversationType, CONVERSATION_TYPE };
