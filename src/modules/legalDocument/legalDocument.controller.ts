import {  Types } from "mongoose";
import ApiResponse from "../../utils/ApiResponse";
import asyncHandler from "../../utils/asyncHandler"
import { TGetLegalDocumentsDto } from "./legalDocument.dto";
import { LegalDocumentService } from "./legalDocument.service";
import httpStatus from "http-status";

const getLegalDocuments = asyncHandler(async (req, res) => {
    
    const payload = req.query as TGetLegalDocumentsDto;

    const legalDocuments = await LegalDocumentService.getLegalDocuments(payload);

    res.status(httpStatus.OK).json(new ApiResponse({
        statusCode: httpStatus.OK,
        message: "Legal documents fetched successfully",
        data: legalDocuments,
    }));
})

const updateLegalDocument = asyncHandler(async (req, res) => {
    
    const payload = req.body ;
    const id = req.params.id;

    const legalDocument = await LegalDocumentService.updateLegalDocuments(new Types.ObjectId(id), payload);

    res.status(httpStatus.OK).json(new ApiResponse({
        statusCode: httpStatus.OK,
        message: "Legal document updated successfully",
        data: null,
    }));
})

export const LegalDocumentController = {
    getLegalDocuments,
    updateLegalDocument
}