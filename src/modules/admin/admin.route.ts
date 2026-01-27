import { Router } from "express";
import auth from "../../middleware/auth";
import { USER_ROLES } from "../user/user.constant";
import { AdminController } from "./admin.controller";
import requestValidator from "../../middleware/request-validator";
import { AdminValidation } from "./admin.validation";

const router = Router();

router.get("/dashboard-stats", auth(USER_ROLES.ADMIN), AdminController.dashboardStats);

router.get("/earnings-stats", auth(USER_ROLES.ADMIN), AdminController.earningsStats);

router.get("/earnings-chart", auth(USER_ROLES.ADMIN), requestValidator(AdminValidation.earningsChartSchema), AdminController.earningsChart);

export const AdminRoutes = router;