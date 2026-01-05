import mongoose, { Schema } from "mongoose";
import { TMessage, IMessageModel, TMessageType } from "./message.interface";
import paginate from "../../utils/paginate";

const ContentSchema = new Schema(
	{
		text: {
			type: String,
		},
		messageType: {
			type: String,
			enum: Object.values(TMessageType),
			required: true,
		},
		fileUrls: {
			type: [String],
		},
	},
	{
		_id: false,
	}
);

const messageSchema = new Schema<TMessage, IMessageModel>(
	{
		tripId: {
			type: Schema.Types.ObjectId,
			ref: "Trip",
			required: true,
		},
		sender: {
			id: {
				type: Schema.Types.ObjectId,
				required: true,
				refPath: "sender.role",
			},
			role: {
				type: String,
				enum: ["Rider", "Driver"],
				required: true,
			},
		},
		content: ContentSchema,
		isDeleted: {
			type: Boolean,
			default: false,
		},
		deliveryStatus: {
			type: String,
			enum: ["Sent", "Delivered", "Seen"],
			default: "Sent",
		},
	},
	{ timestamps: true }
);

// Add pagination plugin
messageSchema.plugin(paginate);

const Message = mongoose.model<TMessage, IMessageModel>(
	"Message",
	messageSchema
);
export default Message;
