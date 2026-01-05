import { Router } from "express";
import auth from "../../middleware/auth";
import { RideRequestController } from "./rideRequest.controller";
import requestValidator from "../../middleware/request-validator";
import { cancelRideRequestValidationSchema, createRideRequestValidationSchema } from "./rideRequestValidation";

const route = Router();

route.post(
	"/create-ride-request",
	requestValidator(createRideRequestValidationSchema),
	auth("Rider"),
	RideRequestController.createRideRequest
);

route.get(
	"/get-all-ride-requests",
	auth("Rider"),
	RideRequestController.getAllRideRequests
);

route.patch(
	"/cancel-ride-request/:rideRequestId",
	requestValidator(cancelRideRequestValidationSchema),
	auth("Rider"),
	RideRequestController.cancelRideRequest
);

export const RideRequestRoutes = route;
