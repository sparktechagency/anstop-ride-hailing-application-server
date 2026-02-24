import e, { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import { User } from "../modules/user/user.model";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import jwt from "jsonwebtoken";
import { TRole } from "../modules/user/user.interface";
import { RoleRights, USER_ROLES, USER_STATUS } from "../modules/user/user.constant";


const auth = (
	...roles: string[]
): ((
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<void> | void) =>
	asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
		const tokenWithBearer = req.headers.authorization;

		if (!tokenWithBearer || !tokenWithBearer.startsWith("Bearer")) {
			throw new ApiError(
				httpStatus.UNAUTHORIZED,
				"Missing or malformed authorization token."
			);
		}

		const token = tokenWithBearer.split(" ")[1];

		if (!token) {
			throw new ApiError(
				httpStatus.UNAUTHORIZED,
				"Missing or malformed authorization token"
			);
		}

		let decoded;
		try {
			decoded = jwt.verify(
				token,
				config.JWT.access_secret as string
			) as JwtPayload & { _id: string; role: TRole[] };
		} catch {
			throw new ApiError(
				httpStatus.UNAUTHORIZED,
				"Unauthorized access! Please make sure you have a valid token."
			);
		}

		const { _id, role } = decoded;

		if (!_id || !role) {
			throw new ApiError(
				httpStatus.UNAUTHORIZED,
				"Invalid token! Please make sure you have a valid token."
			);
		}



		let user = await User.findById(_id);

		if (!user) {
			throw new ApiError(
				httpStatus.UNAUTHORIZED,
				"Invalid token! Please make sure you have a valid token."
			);
		}

		if (user.role.includes(USER_ROLES.DRIVER) && !user.isOnboarded && !(req.url == "/onboarding-status" || req.url == "/onboard")) {
			throw new ApiError(
				httpStatus.UNAUTHORIZED,
				"Unauthorized access! Please complete your onboarding process."
			);
		}

		if (user.role.includes(USER_ROLES.DRIVER) && user.status != USER_STATUS.ACTIVE && !(req.url == "/onboarding-status" || req.url == "/onboard")){
			throw new ApiError(
				httpStatus.UNAUTHORIZED,
				"Unauthorized access! Your account is not active. Please contact to admin."
			);
		}

		// check if user is deleted or not

		if (user.isDeleted) {
			throw new ApiError(
				httpStatus.UNAUTHORIZED,
				"Unauthorized access! This account is deleted."
			);
		}

		if (roles.length) {
			let userPermissions: Set<string> = new Set();


			user.role.forEach((role) => {
				RoleRights.get(role)?.forEach((right) => {
					userPermissions.add(right);
				});
			});

			const hasPermission = roles.some((role) => userPermissions.has(role));
			console.log(hasPermission, userPermissions, roles);
			if (!hasPermission) {
				throw new ApiError(
					httpStatus.FORBIDDEN,
					"You don't have permission to access this API."
				);
			}
		}
		req.user = { _id: user._id, role: user.role };
		next();
	});

export default auth;
