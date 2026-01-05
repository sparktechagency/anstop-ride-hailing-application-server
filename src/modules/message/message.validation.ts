import { z } from "zod";
import { objectIdSchema } from "../../shared/shared.validation";
import { TMessageType } from "./message.interface";

export const sendMessageValidationSchema = z.object({
    tripId: objectIdSchema,
    sender:z.object({
        id: objectIdSchema,
        role: z.string().min(1, "Role is required"),
    }),
    messageType: z.nativeEnum(TMessageType),
    content: z.string().min(1, "Message is required"),

});

export type TSendMessage = z.infer<typeof sendMessageValidationSchema>;

