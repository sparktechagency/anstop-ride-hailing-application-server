import mongoose, { Types } from "mongoose"
import { TPaginateOptions } from "../../types/paginate"
import { Transaction } from "./transaction.model"
import { TTransactionDTO } from "./transaction.dto"
import { User } from "../user/user.model"
import ApiError from "../../utils/ApiError"
import httpStatus from "http-status"

const getAllTransations = async (filter: any, options: TPaginateOptions) => {
    const transactions = await Transaction.paginate({}, {})

    console.log("transactions", transactions)
    return transactions;
}

const createTransaction = async (userId: Types.ObjectId, payload: TTransactionDTO) => {

    const session = await mongoose.startSession()
   try {

    session.startTransaction()

    const transaction = new Transaction({
        userId,
        ...payload
    });
    await transaction.save({session});

    if(payload.type === "DEPOSIT" && payload.status === "COMPLETED"){
        const user = await User.findById(userId);
        if(!user){
            throw new ApiError(httpStatus.NOT_FOUND, "User not found");
        }

        user.balance += payload.amount;
        await user.save({session});
    }else if(payload.type === "WITHDRAWAL" && payload.status === "COMPLETED"){
        const user = await User.findById(userId);
        if(!user){
            throw new ApiError(httpStatus.NOT_FOUND, "User not found");
        }

        user.balance -= payload.amount;
        await user.save({session});
    }

    await session.commitTransaction();
    return transaction;
   } catch (error) {
    await session.abortTransaction();
    throw new Error(error as any);
   }finally{
    await session.endSession();
   }
}


export const TransactionService = {
    getAllTransations,
    createTransaction
}