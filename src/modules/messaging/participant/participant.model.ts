import { model, Schema } from "mongoose";
import { IParticipant } from "./participant.interface";

const participantSchema = new Schema<IParticipant>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		conversation: {
			type: Schema.Types.ObjectId,
			ref: "Conversation",
			required: true,
		},
		role: {
			type: String,
			enum: ["ADMIN", "MEMBER"],
			default: "MEMBER",
		},
	},
	{
		timestamps: true,
	}
);

participantSchema.index({ conversation: 1, user: 1 }, { unique: true });
participantSchema.index({ user: 1, conversation: 1 });

export const Participant = model<IParticipant>(
	"Participant",
	participantSchema
);
