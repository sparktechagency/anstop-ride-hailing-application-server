import { LEGAL_DOCUMENT_TYPE } from "./legalDocument.constant";


type TLegalDocumentType = typeof LEGAL_DOCUMENT_TYPE[keyof typeof LEGAL_DOCUMENT_TYPE];


export type TLegalDocument = {
    type: TLegalDocumentType;
    title: string;
    description: string;
}