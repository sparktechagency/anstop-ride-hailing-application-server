import mongoose, { Types } from "mongoose"
import { TPaginateOptions } from "../../types/paginate"
import { Transaction } from "./transaction.model"
import { TTransactionDTO } from "./transaction.dto"
import { User } from "../user/user.model"
import ApiError from "../../utils/ApiError"
import httpStatus from "http-status"
import { WithdrawalRequest } from "../withdrawalRequest/withdrawalRequest.model"
import { USER_ROLES } from "../user/user.constant"

const createTransaction = async (userId: Types.ObjectId, payload: TTransactionDTO) => {

    const session = await mongoose.startSession()
    try {

        session.startTransaction()

        let transaction;
        if (payload.type === "WITHDRAWAL") {
            transaction = new Transaction({
                ...payload
            });
        } else {
            transaction = new Transaction({
                userId,
                ...payload
            });
        }
        await transaction.save({ session });

        if (payload.type === "DEPOSIT" && payload.status === "COMPLETED") {
            const user = await User.findById(userId);
            if (!user) {
                throw new ApiError(httpStatus.NOT_FOUND, "User not found");
            }

            user.balance += payload.amount;
            await user.save({ session });
        } else if (payload.type === "WITHDRAWAL" && payload.status === "COMPLETED") {

            const isAdmin = await User.findById(userId);

            if (isAdmin && !isAdmin.role.includes(USER_ROLES.ADMIN)) {
                throw new ApiError(httpStatus.FORBIDDEN, "You are not authorized to accept withdrawal");
            }

            const user = await User.findById(payload.userId);
            if (!user) {
                throw new ApiError(httpStatus.NOT_FOUND, "User not found");
            }



            user.balance -= payload.amount;
            await user.save({ session });
            const withdrawalRequest = await WithdrawalRequest.findOne({ userId: payload.userId });
            if (!withdrawalRequest) {
                throw new ApiError(httpStatus.NOT_FOUND, "Withdrawal request not found");
            }

            withdrawalRequest.status = "COMPLETED";
            await withdrawalRequest.save({ session });
        }

        await session.commitTransaction();
        return transaction;
    } catch (error) {
        await session.abortTransaction();
        throw new Error(error as any);
    } finally {
        await session.endSession();
    }
}

const getAllTransations = async (filter: Record<string, any>, options: TPaginateOptions) => {

    options.select = "transactionId riderId amount commissionRate commissionAmount driverEarningAmount type status driverId payoutDetails createdAt status"
    options.populate = {
        path: "riderId",
        select: "name"
    }
    return await Transaction.paginate(filter, options)
}


const transactionDetails = async (transactionId: Types.ObjectId) => {
    return await Transaction.findById(transactionId).select("transactionId riderId amount commissionRate commissionAmount driverEarningAmount type status driverId payoutDetails createdAt status").populate({
        path: "riderId",
        select: "name email"
    }).populate({
        path: "driverId",
        select: "name email"
    }).lean();


}

export const TransactionService = {
    getAllTransations,
    createTransaction,
    transactionDetails
}