import { Router } from "express";
import { UserControllers } from "./user.controller";
import auth from "../../middleware/auth";
import requestValidator from "../../middleware/request-validator";
import { UserValidation } from "./user.validation";

const router = Router();

router.post("/fcm-token", auth("COMMON"), requestValidator(UserValidation.setFcmTokenSchema), UserControllers.setFcmToken);
router.post("/address", auth("COMMON"), requestValidator(UserValidation.saveAddressSchema), UserControllers.saveAddress);
router.get("/address", auth("COMMON"), requestValidator(UserValidation.getAddressSchema), UserControllers.getSavedAddress);

export const UserRoutes = router;