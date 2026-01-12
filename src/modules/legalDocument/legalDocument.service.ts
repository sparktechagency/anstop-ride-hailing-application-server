import { Types } from "mongoose";
import { TGetLegalDocumentsDto, TUpdateLegalDocumentsDto } from "./legalDocument.dto";
import { LegalDocument } from "./legalDocument.model";

const getLegalDocuments = async(payload: TGetLegalDocumentsDto) => {

    const { type } = payload;

    const legalDocument = await LegalDocument.findOne({ type }).select("_id type title description");

    if (!legalDocument) {
        throw new Error("Legal document not found");
    }

    return legalDocument;
}

const updateLegalDocuments = async(id: Types.ObjectId,payload: TUpdateLegalDocumentsDto) => {

    const { title, description } = payload;

    const legalDocument = await LegalDocument.findById(id);

    if (!legalDocument) {
        throw new Error("Legal document not found");
    }

    if(title){
        legalDocument.title = title;
    }

    if(description){
        legalDocument.description = description;
    }

    legalDocument.save();
}

export const LegalDocumentService = {
    getLegalDocuments,
    updateLegalDocuments
}
    