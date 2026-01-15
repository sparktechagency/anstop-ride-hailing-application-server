import { z } from "zod";
import { MessageValidation } from "./message.validation";

export type SendMessageDTO = z.infer<
	typeof MessageValidation.sendFirstMessageSchema
>["body"];
