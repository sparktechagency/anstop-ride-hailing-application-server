import { Router } from "express";
import requestValidator from "../../middleware/request-validator";
import { AuthValidation } from "./auth.validation";
import { AuthControllers } from "./auth.controller";
import auth from "../../middleware/auth";
import { USER_ROLES } from "../user/user.constant";

const router = Router();

// User registration routes

router.post(
	"/sign-up",
	requestValidator(AuthValidation.SignUpScheam),
	AuthControllers.SignUp
);

router.post(
	"/sign-in",
	requestValidator(AuthValidation.SignInSchema),
	AuthControllers.SignIn
);

router.post(
	"/verify-otp",
	requestValidator(AuthValidation.OtpVerificationSchema),
	AuthControllers.verifyOTP
);

router.post(
	"/resend-otp",
	requestValidator(AuthValidation.ResendOtpSchema),
	AuthControllers.resendOTP
);

router.post(
	"/forgot-password",
	requestValidator(AuthValidation.ForgotPasswordSchema),
	AuthControllers.forgotPassword
);

router.post(
	"/reset-password",
	auth("COMMON"),
	requestValidator(AuthValidation.ResetPasswordSchema),
	AuthControllers.resetPassword
);

router.post(
	"/change-password",
	auth("COMMON"),
	requestValidator(AuthValidation.ChangePasswordSchema),
	AuthControllers.changePassword
);

export const AuthRoutes = router;
