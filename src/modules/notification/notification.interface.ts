import { z } from "zod";
import { addTokenValidationSchema } from "./notification.validation";

export type TAddTokenPayload = z.infer<typeof addTokenValidationSchema>