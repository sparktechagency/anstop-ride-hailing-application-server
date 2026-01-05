import { ExtendedError, Socket } from "socket.io";
import { emitSocketError } from "./utils/SocketError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import { TRoles, UserRoles } from "../shared/shared.interface";
import {
	addSocketToMap,
	driverSocketMap,
	userSocketMap,
} from "./utils/socketStore";
import { User } from "../modules/user/user.model";

const authenticateUser = async (
	socket: Socket,
	next: (err?: ExtendedError) => void
) => {
	const rawToken =
		socket.handshake.auth.token ||
		socket.handshake.headers.auth ||
		socket.handshake.headers.authorization;

	const token = rawToken?.startsWith("Bearer ")
		? rawToken.split(" ")[1]
		: rawToken;

	const unauthMsg =
		"Unauthorized access! Please make sure you have a valid token.";

	if (!token) {
		emitSocketError({
			socket,
			message: unauthMsg,
			statusCode: 401,
		});
		next(new Error(unauthMsg));
		return;
	}

	try {
		let decoded;

		decoded = jwt.verify(
			token,
			config.jwt_access_secret as string
		) as JwtPayload & { _id: string; role: TRoles };

		const { _id, role } = decoded;

		if (!_id || !role) {
			emitSocketError({
				socket,
				message: unauthMsg,
				statusCode: 401,
			});
			next(new Error(unauthMsg));
			return;
		}

		let user = await User.findById(_id).select("_id role");

		if (!user) {
			emitSocketError({
				socket,
				message: "User not found",
				statusCode: 404,
			});
			next(new Error("User not found"));
			return;
		}

		if (user.role !== role) {
			emitSocketError({
				socket,
				message: unauthMsg,
				statusCode: 404,
			});
			next(new Error(unauthMsg));
			return;
		}

		// check if user is deleted or not

		if (user.isDeleted) {
			emitSocketError({
				socket,
				message:
					"The account has been deleted. Please contact support.",
				statusCode: 404,
			});
			next(
				new Error(
					"The account has been deleted. Please contact support."
				)
			);
			return;
		}
		socket.payload = {
			userId: _id,
			role,
		};

		if (role === UserRoles.Rider) {
			addSocketToMap(userSocketMap, user._id.toString(), socket.id);
		} else if (role === UserRoles.Driver) {
			addSocketToMap(driverSocketMap, _id.toString(), socket.id);
		}

		console.log("Passed from middleware 🟢🟢");

		next();
	} catch (error) {
		emitSocketError({
			socket,
			message: "Failed to authenticate user. please try again!",
			statusCode: 500,
			error,
		});
		next(new Error("Failed to authenticate user. please try again!"));
		return;
	}
};

export default authenticateUser;
