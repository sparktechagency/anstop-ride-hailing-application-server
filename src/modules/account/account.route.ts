import { Router } from "express";
import auth from "../../middleware/auth";
import { AccountControllers } from "./account.controller";
import { UserRoles } from "../../shared/shared.interface";

const route = Router();

route.get("/me", auth(UserRoles.Rider), AccountControllers.getMe);

export const AccountRoutes = route;