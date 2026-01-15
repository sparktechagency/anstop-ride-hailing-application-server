import { Router } from "express";
import auth from "../../middleware/auth";
import { USER_ROLES } from "../user/user.constant";
import requestValidator from "../../middleware/request-validator";
import { TransactionValidation } from "./transaction.validation";
import { TransactionController } from "./transaction.controller";

const router = Router();


router.get("/", auth("COMMON"), requestValidator(TransactionValidation.getAllTransations), TransactionController.getAllTransations)


export const TransactionRoutes = router;