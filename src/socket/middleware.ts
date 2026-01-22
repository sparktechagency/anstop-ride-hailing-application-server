import { ExtendedError, Socket } from "socket.io";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import { addToMap, userSocketMap } from "./utils/socketStore";
import { User } from "../modules/user/user.model";
import { TRole } from "../modules/user/user.interface";

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
		console.log("token not found");
		next(new Error(unauthMsg));
		return;
	}

	try {
		let decoded;

		decoded = jwt.verify(
			token,
			config.JWT.access_secret as string
		) as JwtPayload & { _id: string; role: TRole[] };

		console.log("decoded", decoded)

		const { _id, role } = decoded;

		if (!_id || !role) {
			console.log("invalid token payload");
			next(new Error(unauthMsg));
			return;
		}

		let user = await User.findById(_id).select("_id role");

		if (!user) {
			next(new Error("User not found"));
			return;
		}

		// if (user.role !== role) {
		// 	console.log("user role mismatch");
		// 	next(new Error(unauthMsg));
		// 	return;
		// }

		// check if user is deleted or not

		if (user.isDeleted) {
			next(
				new Error(
					"The account has been deleted. Please contact support."
				)
			);
			return;
		}
		socket.payload = {
			_id: user._id.toString(),
			role,
		};

		// console.log("User connected:", user._id);
		addToMap(userSocketMap, user._id.toString(), socket.id);

		console.log("Passed from middleware 🟢🟢");

		next();
	} catch (error) {
		next(
			new Error(
				`${error}. Failed to authenticate user. please try again!`
			)
		);
		return;
	}
};

export default authenticateUser;
