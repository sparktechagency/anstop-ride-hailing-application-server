import { z } from "zod";

const sendMessageSchema = z.object({
    conversationId: z.string().regex(/^[0-9a-fA-F]{24}$/),
    text: z.string().optional(),
    attachments: z.array(z.string()).optional(),
}).strict().refine((data) => data.text || data.attachments, {
    message: "At least one of text or attachments is required",
    path: ["text", "attachments"],
});

export const MessageSocketValidation = {
    sendMessageSchema,
};
