import { Router } from "express";
import { NotificationControllers } from "./notification.controller";
import auth from "../../middleware/auth";
import requestValidator from "../../middleware/request-validator";
import { addTokenValidationSchema } from "./notification.validation";

const router = Router();

router.post(
	"/register-user-device",
	requestValidator(addTokenValidationSchema),
	auth("Common"),
	NotificationControllers.registerUserDevice
);

router.post(
	"/driver-account-verification-notification",
	auth("Driver"),
	NotificationControllers.driverAccountVerificaitonNotification
);

export const NotificationRoutes = router;
