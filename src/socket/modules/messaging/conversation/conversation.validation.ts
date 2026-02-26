import { z } from "zod";

const joinConversationSchema = z.object({
    conversationId: z.string().regex(/^[0-9a-fA-F]{24}$/),
}).strict();

export const ConversationSocketValidation = {
    joinConversationSchema,
};
