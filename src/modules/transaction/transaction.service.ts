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
        if (payload.type !== "WITHDRAWAL") {
            transaction = new Transaction({
                userId,
                ...payload
            });
            await transaction.save({ session });
        }

        if (payload.type === "DEPOSIT" && payload.status === "COMPLETED") {
            const user = await User.findById(userId);
            if (!user) {
                throw new ApiError(httpStatus.NOT_FOUND, "User not found");
            }

            user.balance += payload.amount!;
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

            const withdrawalRequest = await WithdrawalRequest.findOne({ userId: payload.userId, status: "PENDING" });
            if (!withdrawalRequest) {
                throw new ApiError(httpStatus.NOT_FOUND, "Withdrawal request not found");
            }

            transaction = new Transaction({
                amount: withdrawalRequest.amount,
                ...payload
            });

            transaction.save({ session })

            user.balance -= withdrawalRequest.amount;
            await user.save({ session });

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

    options.select = "transactionId rideId amount type status payoutDetails createdAt"
    options.populate = {
        path: "rideId",
        select: "_id riderId driverId"
    }
    return await Transaction.paginate(filter, options)
}


const transactionDetails = async (transactionId: Types.ObjectId) => {
    return await Transaction.findById(transactionId).select("rideId transactionId amount type status  payoutDetails createdAt").populate({
        path: "rideId",
        select: "_id riderId driverId"
    })
}

export const TransactionService = {
    getAllTransations,
    createTransaction,
    transactionDetails
}