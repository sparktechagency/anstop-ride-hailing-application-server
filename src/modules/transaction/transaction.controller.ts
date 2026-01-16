import { TPaginateOptions } from "../../types/paginate";
import ApiResponse from "../../utils/ApiResponse";
import asyncHandler from "../../utils/asyncHandler";
import { TransactionService } from "./transaction.service";
import httpStatus from "http-status"

const getAllTransations = asyncHandler(async(req, res) => {

        const options = {
            page: req.validatedData.query.page,
            limit: req.validatedData.query.limit,
            sortBy: req.validatedData.query.sortBy,
            sortOrder: req.validatedData.query.sortOrder,
        } as Omit<TPaginateOptions, "select" | "populate">;


        const result = await TransactionService.getAllTransations({}, options)


        res.status(httpStatus.OK).json(new ApiResponse({
            statusCode: httpStatus.OK,
            message: "Transaction successfully retrived",
            data: result
        }))
    
    
})


const createTransaction = asyncHandler(async(req, res) => {

    const userId = req.user._id;
    const payload = req.validatedData.body;


    const result = await TransactionService.createTransaction(userId, payload);

    res.status(httpStatus.OK).json(new ApiResponse({
        statusCode: httpStatus.OK,
        message: "Transaction successfully created",
        data: result
    })) 
    
})

export const TransactionController = {
    getAllTransations,
    createTransaction
}