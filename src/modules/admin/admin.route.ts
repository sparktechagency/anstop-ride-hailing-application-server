import { Router } from "express";
import requestValidator from "../../middleware/request-validator";
import { adminForgotPasswordValidationSchema, adminLoginValidationSchema } from "./admin.validation";
import { AdminController } from "./admin.controller";


const router = Router();

// Admin Login

router.post(
    "/login",
    requestValidator(adminLoginValidationSchema),
    AdminController.login,
);

// Admin forgot password

router.post(
    "/forgot-password",
    requestValidator(adminForgotPasswordValidationSchema),
    AdminController.forgotPassword,
);

// Admin reset password

router.post(
    "/reset-password",
    requestValidator(adminForgotPasswordValidationSchema),
    AdminController.resetPassword,
); 

// Dashboard stats

router.get(
    "/dashboard-stats",
    AdminController.dashboardStats,
);

// Get all users

router.get(
    "/get-all-users",
    AdminController.getAllUser,
);

// Get all drivers

router.get(
    "/get-all-drivers",
    AdminController.getAllDriver,
);

// Get user by id

router.get(
    "/get-user-by-id/:userId",
    AdminController.getUserById,
);

// Get driver by id

router.get(
    "/get-driver-by-id/:driverId",
    AdminController.getDriverById,
);

// Trip stats

router.get(
    "/trip-stats",
    AdminController.tripStats,
);


export const AdminRoutes = router;
