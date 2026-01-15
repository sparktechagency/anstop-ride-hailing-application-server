import { Router } from "express";
import auth from "../../middleware/auth";
import { USER_ROLES } from "../user/user.constant";
import requestValidator from "../../middleware/request-validator";
import { SupportValidation } from "./support.validation";
import { SupportController } from "./support.controller";

const route = Router();

route.post("/", auth(USER_ROLES.RIDER, USER_ROLES.DRIVER), requestValidator(SupportValidation.createSchema), SupportController.createSupportMessage)


route.get("/", auth(USER_ROLES.ADMIN), requestValidator(SupportValidation.getAllSchema), SupportController.getAllSupportMessages)


route.get("/my-messages", auth(USER_ROLES.RIDER, USER_ROLES.DRIVER), requestValidator(SupportValidation.getAllSchema), SupportController.getMySupportMessage)

export const SupportRoutes = route;