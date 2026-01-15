import { Router } from "express";
import auth from "../../../middleware/auth";
import requestValidator from "../../../middleware/request-validator";
import { MessageValidation } from "./message.validation";
import { MessageController } from "./message.controller";

const router = Router();

// router.post(
// 	"/",
// 	auth(UserRoles.User),
// 	requestValidator(MessageValidation.sendFirstMessageSchema),
// 	MessageController.sendMessage
// );

router.get(
	"/:conversationId",
	auth("COMMON"),
	requestValidator(MessageValidation.getMessages),
	MessageController.getAllMessagesInConversation
);

export const MessageRoutes = router;
