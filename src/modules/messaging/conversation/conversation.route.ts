import { Router } from "express";
import auth from "../../../middleware/auth";
import { ConversationController } from "./conversation.controller";


const route = Router();

route.get(
	"/",
	auth("COMMON"),
	ConversationController.GetConversation
);

export const ConversationRoutes = route;
