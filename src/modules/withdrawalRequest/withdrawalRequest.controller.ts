
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

    const filter: Record<string, any> = {}

    if(query.status){
        filter.status = query.status
    }

    const result = await withdrawalRequestService.getAllWithdrawalRequest(filter, options)

    res.status(200).json({
        success: true,
        message: "Withdrawal requests retrieved successfully",
        data: result.results,
        meta: result.meta,
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
        data: result.results,
        meta: result.meta,
    })
})

const rejectWithdrawRequest = asyncHandler(async(req, res) => {
    const payload = req.body;

    const result = await withdrawalRequestService.rejectWithdrawRequest(payload)
    res.status(200).json({
        success: true,
        message: "Withdrawal request rejected successfully",
        data: result
    })
})


export const WithdrawalRequestController = {
    createWithdrawalRequest,
    getAllWithdrawalRequest,
    getMyWithdrawalRequest,
    rejectWithdrawRequest
}