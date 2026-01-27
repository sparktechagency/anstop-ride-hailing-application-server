import asyncHandler from "../../utils/asyncHandler";
import { SupportService } from "./support.service";

const createSupportMessage = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const payload = req.body;

    await SupportService.createSupportMessage(userId, payload);

    res.status(200).json({
        success: true,
        message: "Support message created successfully",
        data: null
    })
})


const getMySupportMessage = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const query = req.validatedData.query;


    const options = {
        page: query.page,
        limit: query.limit,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder
    }

    const supportMessages = await SupportService.getMySupportMessages({userId}, options);

    res.status(200).json({
        success: true,
        message: "Support messages fetched successfully",
        data: supportMessages.results,
        meta: supportMessages.meta,
    })
})


const getAllSupportMessages = asyncHandler(async (req, res) => {
    const query = req.validatedData.query;


    const options = {
        page: query.page,
        limit: query.limit,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder
    }

    const supportMessages = await SupportService.getAllSupportMessages({}, options);

    res.status(200).json({
        success: true,
        message: "Support messages fetched successfully",
        data: supportMessages.results,
        meta: supportMessages.meta,
    })
})


export const SupportController = {
    createSupportMessage,
    getMySupportMessage,
    getAllSupportMessages
}