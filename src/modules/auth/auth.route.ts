import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import requestValidator from "../../middleware/request-validator";
import {
	optVerificationValidationSchema,
	userRegistrationValidationSchema,
} from "./auth.validation";

const router = Router();

// User registration routes

router.post(
	"/authenticate",
	requestValidator(userRegistrationValidationSchema),
	AuthControllers.createUser
);

// verify OTP routes

router.post(
	"/verify-otp",
	requestValidator(optVerificationValidationSchema),
	AuthControllers.verifyOTP
);

// resend OTP routes

router.post(
	"/resend-otp",
	requestValidator(
		optVerificationValidationSchema.pick({ phoneNumber: true })
	),
	AuthControllers.resendOTP
);

export const AuthRoutes = router;
