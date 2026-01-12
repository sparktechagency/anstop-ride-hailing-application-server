import { LegalDocumentValidation } from "./legalDocument.validation";
import { z } from "zod";

export type TGetLegalDocumentsDto = z.infer<typeof LegalDocumentValidation.getLegalDocumentsSchema>["query"];
export type TUpdateLegalDocumentsDto = z.infer<typeof LegalDocumentValidation.updateSchema>["body"];
    