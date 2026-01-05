import { Router } from "express";
import auth from "../../middleware/auth";
import requestValidator from "../../middleware/request-validator";
import {
	addTrustedContactValidationSchema,
	riderOnboardingValidationSchema,
	saveAddressValidationSchema,
} from "./rider.validation";
import { RiderController } from "./rider.controller";

const router = Router();

router.post(
	"/onboard-rider",
	auth("Rider"),
	requestValidator(riderOnboardingValidationSchema),
	RiderController.onboardRider
);

// save address route
router.post(
	"/save-address",
	auth("Rider"),
	requestValidator(saveAddressValidationSchema),
	RiderController.saveAddress
);

// get all saved addresses route
router.get(
	"/get-all-saved-addresses",
	auth("Rider"),
	RiderController.getAllSavedAddresses
);

// get saved address by ID route
router.get(
	"/get-saved-address/:addressId",
	auth("Rider"),
	RiderController.getSavedAddressById
);

// update saved address by ID route
router.put(
	"/update-saved-address/:addressId",
	auth("Rider"),
	requestValidator(saveAddressValidationSchema),
	RiderController.updateSavedAddressById
);

// add trusted contact route
router.post(
	"/add-trusted-contact",
	requestValidator(addTrustedContactValidationSchema),
	auth("Rider"),
	RiderController.addTrustedContact
);

// get all trusted contacts route
router.get(
	"/get-all-trusted-contacts",
	auth("Rider"),
	RiderController.getAllTrustedContacts
);

// get recent rides route
router.get("/get-recent-rides", auth("Rider"), RiderController.recentRides);

export const RiderRoutes = router;
