import { Router } from "express";
import auth from "../../middleware/auth";
import { USER_ROLES } from "../user/user.constant";
import requestValidator from "../../middleware/request-validator";
import { TransactionValidation } from "./transaction.validation";
import { TransactionController } from "./transaction.controller";

const router = Router();


router.get("/", auth("COMMON"), requestValidator(TransactionValidation.getAllTransationsSchema), TransactionController.getAllTransations)

router.post("/", auth("COMMON"), requestValidator(TransactionValidation.createTransactionSchema), TransactionController.createTransaction)

export const TransactionRoutes = router;