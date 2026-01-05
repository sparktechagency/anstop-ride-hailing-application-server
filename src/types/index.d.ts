import { Types } from "mongoose";
import { TRoles } from "../modules/user/user.interface";
import { DefaultEventsMap } from "socket.io";

declare global {
	namespace Express {
		interface Request {
			user: { _id: Types.ObjectId; role: TRoles };
		}
	}
	var io: import("socket.io").Server;
	var socket: import("socket.io").Socket;
}

declare module "socket.io" {
	interface Socket {
		payload: {
			userId: string;
			role: TRoles;
		};
	}
}

export {};
