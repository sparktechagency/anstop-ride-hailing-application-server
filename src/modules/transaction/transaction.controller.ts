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

export const TransactionController = {
    getAllTransations
}