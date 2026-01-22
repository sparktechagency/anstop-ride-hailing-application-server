import { Router } from "express";
import requestValidator from "../../middleware/request-validator";
import { RideRequestValidation } from "./rideRequest.validation";
import auth from "../../middleware/auth";
import { USER_ROLES } from "../user/user.constant";
import { RideRequestController } from "./rideRequest.controller";

const route = Router();

route.post(
	"/create-ride-request",
	requestValidator(RideRequestValidation.createSchema),
	auth(USER_ROLES.RIDER),
	RideRequestController.createRideRequest
);

route.get(
	"/get-all-ride-requests",
	auth(USER_ROLES.RIDER),
	RideRequestController.getAllRideRequests
);

route.patch(
	"/cancel-ride-request/:rideRequestId",
	auth(USER_ROLES.RIDER),
	RideRequestController.cancelRideRequest
);

export const RideRequestRoutes = route;
