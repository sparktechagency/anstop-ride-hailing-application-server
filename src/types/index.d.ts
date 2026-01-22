import { Types } from "mongoose";
import { TRoles } from "../modules/user/user.interface";
import { DefaultEventsMap } from "socket.io";

declare global {
	namespace Express {
		interface Request {
			user: { _id: Types.ObjectId; role: TRoles };
			validatedData: {
				body: any;
				params: any;
				query: any;
			};
		}
	}
	var io: import("socket.io").Server;
	var socket: import("socket.io").Socket;
}

declare module "socket.io" {
	interface Socket {
		payload: {
			_id: string;
			role: TRoles;
		};
	}
}

export { };
