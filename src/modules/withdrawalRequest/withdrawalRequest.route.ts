import { Router } from "express";
import auth from "../../middleware/auth";
import { USER_ROLES } from "../user/user.constant";
import { WithdrawalRequestController } from "./withdrawalRequest.controller";
import requestValidator from "../../middleware/request-validator";
import { withdrawalRequestValidation } from "./withdrawalRequest.validation";

const router = Router();


router.get("/", auth(USER_ROLES.ADMIN), requestValidator(withdrawalRequestValidation.getAllSchema), WithdrawalRequestController.getAllWithdrawalRequest)

router.post("/", auth(USER_ROLES.DRIVER), requestValidator(withdrawalRequestValidation.createSchema), WithdrawalRequestController.createWithdrawalRequest)

router.get("/my-requests", auth(USER_ROLES.DRIVER), requestValidator(withdrawalRequestValidation.getAllSchema), WithdrawalRequestController.getMyWithdrawalRequest)


export const WithdrawalRequestRoutes = router;
