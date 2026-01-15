import { Types } from "mongoose";

export type TGroupRoles = "ADMIN" | "MEMBER";
export interface IParticipant {
	_id: string;
	user: Types.ObjectId;
	role: TGroupRoles;
	conversation: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}
