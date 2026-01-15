import { z } from "zod";

const sendFirstMessageSchema = z.object({
	body: z
		.object({
			text: z.string().min(1, "Message text is required"),
			attachments: z.array(z.string()).optional(),
			receiver: z.string().regex(/^[0-9a-fA-F]{24}$/),
		})
		.strict(),
});

const getMessages = z.object({
	query: z
		.object({
			page: z.coerce
				.number({
					invalid_type_error: "Page must be a string",
				})
				.default(1),

			limit: z.coerce
				.number({
					invalid_type_error: "Limit must be a string",
				})
				.default(10),

			sortBy: z
				.string({
					invalid_type_error: "SortBy must be a string",
				})
				.default("createdAt"),

			sortOrder: z
				.enum(["asc", "desc"], {
					invalid_type_error:
						"Sort order must be either 'asc' or 'desc'",
				})
				.default("asc")
				.transform((val) => (val === "asc" ? 1 : -1)),
		})
		.strict(),
	params: z.object({
		conversationId: z.string().regex(/^[0-9a-fA-F]{24}$/),
	}).strict(),
});

export const MessageValidation = { sendFirstMessageSchema, getMessages };
