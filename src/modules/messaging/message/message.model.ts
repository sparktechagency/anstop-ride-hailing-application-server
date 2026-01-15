import { model, Schema } from "mongoose";
import { IMessage, IMessageModel } from "./message.interface";
import paginate from "../../../utils/paginate";

const messageSchema = new Schema<IMessage, IMessageModel>(
	{
		sender: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		conversation: {
			type: Schema.Types.ObjectId,
			ref: "Conversation",
			required: true,
		},
		text: {
			type: String,
		},
		attachments: [
			{
				type: String,
			},
		],
	},
	{
		timestamps: true,
	}
);

messageSchema.plugin(paginate);

export const Message = model<IMessage, IMessageModel>("Message", messageSchema);
