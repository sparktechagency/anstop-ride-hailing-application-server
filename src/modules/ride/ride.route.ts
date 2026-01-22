import { Router } from "express";
import { RideController } from "./ride.controller";
import auth from "../../middleware/auth";
import requestValidator from "../../middleware/request-validator";
import { RideValidation } from "./ride.validation";

const router = Router();

router.get("/my-rides",auth("COMMON"), requestValidator(RideValidation.getMyRideSchema), RideController.getMyRidesController);

router.get("/calculate-fare", auth("COMMON"), requestValidator(RideValidation.calculateFareSchema), RideController.calculateFare);

router.get("/:id", auth("COMMON"), requestValidator(RideValidation.getRideDetailsSchema), RideController.getRideDetails);

export const RideRoutes = router;