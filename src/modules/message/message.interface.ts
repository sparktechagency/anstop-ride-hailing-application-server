import { Model, Types } from "mongoose";
import { TPaginateOptions, TPaginateResult } from "../../types/paginate";

export enum TMessageType {
	TEXT = "text",
	IMAGE = "image",
	AUDIO = "audio",
	VIDEO = "video",
	DOCUMENT = "document",
	MIXED = "mixed",
}

export interface TContent {
	text?: string;
	messageType: TMessageType;
	fileUrls?: string[];
}

export interface TMessage {
	_id?: string;
	tripId: Types.ObjectId;
	sender: {
		id: Types.ObjectId;
		role: "Driver" | "Rider";
	};
	content: TContent;
	isDeleted?: boolean;
	deliveryStatus?: "Sent" | "Delivered" | "Seen";
	createdAt?: Date;
	updatedAt?: Date;
}

export interface IMessageModel extends Model<TMessage> {
	paginate(
		filter: Record<string, any>,
		options: TPaginateOptions
	): Promise<TPaginateResult<TMessage>>;
}
