import { Router } from "express";
import { NotificationControllers } from "./notification.controller";
import auth from "../../middleware/auth";
import requestValidator from "../../middleware/request-validator";
import { addTokenValidationSchema, NotificationValidation } from "./notification.validation";
import { USER_ROLES } from "../user/user.constant";

const router = Router();


// router.post(
// 	"/driver-account-verification-notification",
// 	auth("Driver"),
// 	NotificationControllers.driverAccountVerificaitonNotification
// );
router.get(
    "/",
    auth(USER_ROLES.DRIVER, USER_ROLES.RIDER),
    requestValidator(NotificationValidation.getAllNotifications),
    NotificationControllers.getAllNotifications
)

export const NotificationRoutes = router;
