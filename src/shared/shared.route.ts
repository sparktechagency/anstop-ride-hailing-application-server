import { Router } from "express";
import auth from "../middleware/auth";
import requestValidator from "../middleware/request-validator";
import { languagePreferenceValidationSchema, setUserAddressValidationSchema } from "./shared.validation";
import { SharedController } from "./shared.controller";

const router = Router();
// set language preference route

router.post(
	"/set-language-preference",
	auth("Common"),
	requestValidator(languagePreferenceValidationSchema),
	SharedController.setLanguagePreference,
);

// get language preference route
router.post(
	"/get-language-preference",
	auth("Common"),
	SharedController.getLanguagePreference,
);

// set user address route
// router.post(
// 	"/set-user-address",
// 	auth("Common"),
// 	requestValidator(setUserAddressValidationSchema),
// 	SharedController.setUserAddress,
// );

// // get user address route
// router.post(
// 	"/get-user-address",
// 	auth("Common"),
// 	SharedController.getUserAddress,
// );

export const SharedRoutes = router;