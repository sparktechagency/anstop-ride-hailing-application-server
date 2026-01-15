import { Model, Types } from "mongoose";
import { TPaginateOptions, TPaginateResult } from "../../../types/paginate";

interface IMessage {
	_id: Types.ObjectId;
	sender: Types.ObjectId;
	conversation: Types.ObjectId;
	text?: string;
	attachments?: string[];
	createdAt: Date;
	updatedAt: Date;
}

 interface IMessageModel extends Model<IMessage> {
	paginate: (
		filter: object,
		options: TPaginateOptions
	) => Promise<TPaginateResult<IMessage>>;
}

export { IMessage, IMessageModel };
