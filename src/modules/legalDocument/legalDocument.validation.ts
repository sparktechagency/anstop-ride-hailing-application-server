import { LEGAL_DOCUMENT_TYPE } from "./legalDocument.constant";
import { z } from "zod";

const getLegalDocumentsSchema = z.object({
    query: z.object({
        type: z.enum([LEGAL_DOCUMENT_TYPE.PRIVACY_POLICY, LEGAL_DOCUMENT_TYPE.TERMS_AND_CONDITIONS, LEGAL_DOCUMENT_TYPE.ABOUT_US, LEGAL_DOCUMENT_TYPE.REFUND_POLICY], {
        errorMap: () => {
            return {
                message: `Invalid legal document type. Valid types are ${Object.values(LEGAL_DOCUMENT_TYPE).join(", ")}`,
            };
        },
    }),
    })
});

const updateSchema = z.object({
    body: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
    }).strict().refine(
        data => data.title || data.description,
        {
            message: "At least one field is required",
        }
    ),
    params: z.object({
        id: z.string(),
    })
})

export const LegalDocumentValidation = {
    getLegalDocumentsSchema,
    updateSchema
}