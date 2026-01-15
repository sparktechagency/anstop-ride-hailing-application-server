import { model, Schema } from "mongoose";
import { IConversation } from "./conversation.interface";

const conversationSchema = new Schema<IConversation>(
	{
		title: {
			type: String,
			trim: true,
		}, // group only
		privateHash: {
			type: String,
		}, // private only
		conversationType: {
			type: String,
			enum: ["PRIVATE", "GROUP"],
			default: "PRIVATE",
		},
	},
	{
		timestamps: true,
	}
);

conversationSchema.index(
	{ privateHash: 1 },
	{
		unique: true,
		partialFilterExpression: { type: "private" },
	}
);

export const Conversation = model<IConversation>(
	"Conversation",
	conversationSchema
);
