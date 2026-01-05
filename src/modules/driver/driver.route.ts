import { Router } from "express";
import auth from "../../middleware/auth";
import requestValidator from "../../middleware/request-validator";
import { driverOnboardingValidationSchema } from "./driver.validation";
import { DriverControllers } from "./driver.controller";


const router = Router();

// onboard user route
router.post(
	"/onboard",
	auth("Driver"),
	requestValidator(driverOnboardingValidationSchema),
	DriverControllers.onboardDriver,
);



export const DriverRoutes = router;
