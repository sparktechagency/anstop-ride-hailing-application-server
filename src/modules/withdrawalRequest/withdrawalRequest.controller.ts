
import asyncHandler from "../../utils/asyncHandler";
import { withdrawalRequestService } from "./withdrawalRequest.service";

const createWithdrawalRequest = asyncHandler(async(req, res) => {
    
    const userId = req.user._id
    const payload = req.body;
	

    const result = await withdrawalRequestService.createWithdrawalRequest(userId, payload)
    res.status(200).json({
        success: true,
        message: "Withdrawal requests retrieved successfully",
        data: result
    })
})

const getAllWithdrawalRequest = asyncHandler(async(req, res) => {
    const query = req.validatedData.query;

    const options = {
		page: query.page,
		limit: query.limit,
		sortBy: query.sortBy,
		sortOrder: query.sortOrder,
    }

    const result = await withdrawalRequestService.getAllWithdrawalRequest({}, options)

    res.status(200).json({
        success: true,
        message: "Withdrawal requests retrieved successfully",
        data: result
    })
})

const getMyWithdrawalRequest = asyncHandler(async(req, res) => {

    const userId = req.user._id
    const query = req.validatedData.query;

    const options = {
		page: query.page,
		limit: query.limit,
		sortBy: query.sortBy,
		sortOrder: query.sortOrder,
    }

    const result = await withdrawalRequestService.getAllWithdrawalRequest({userId}, options)

    res.status(200).json({
        success: true,
        message: "Withdrawal requests retrieved successfully",
        data: result
    })
})


export const WithdrawalRequestController = {
    createWithdrawalRequest,
    getAllWithdrawalRequest,
    getMyWithdrawalRequest
}