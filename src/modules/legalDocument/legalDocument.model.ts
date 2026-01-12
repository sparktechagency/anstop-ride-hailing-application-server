import { model, Schema } from "mongoose";
import { LEGAL_DOCUMENT_TYPE } from "./legalDocument.constant";
import { TLegalDocument } from "./legalDocument.interface";

const legalDocumentSchema = new Schema<TLegalDocument>(
    {
        type: {
            type: String,
            enum: Object.values(LEGAL_DOCUMENT_TYPE),
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
    }
);

legalDocumentSchema.index({ type: 1 }, { unique: true });

export const LegalDocument = model<TLegalDocument>("LegalDocument", legalDocumentSchema);