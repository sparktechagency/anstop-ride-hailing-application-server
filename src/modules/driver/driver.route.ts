import { Router } from "express";
import auth from "../../middleware/auth";
import requestValidator from "../../middleware/request-validator";
import { DriverControllers } from "./driver.controller";
import { DriverValidation } from "./driver.validation";


const router = Router();

// onboard user route
router.post(
	"/onboard",
	auth("Driver"),
	requestValidator(DriverValidation.OnboardingSchema),
	DriverControllers.onboardDriver,
);

router.get(
	"/onboarding-status",
	auth("COMMON"),
	DriverControllers.checkOnboardingStatus,
);



export const DriverRoutes = router;
