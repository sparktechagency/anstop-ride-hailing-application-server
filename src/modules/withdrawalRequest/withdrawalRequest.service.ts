import { Types } from "mongoose";
import { TCreateWithdrawalRequestDto, TRejectWithdrawalRequestDto } from "./withdrawalRequest.dto";
import { WithdrawalRequest } from "./withdrawalRequest.model";
import { WITHDRAWAL_STATUS } from "./withdrawalRequest.constant";
import { TPaginateOptions } from "../../types/paginate";
import { User } from "../user/user.model";
import ApiError from "../../utils/ApiError";

const createWithdrawalRequest = async (userId: Types.ObjectId, payload: TCreateWithdrawalRequestDto) => {

    const existingRequest = await WithdrawalRequest.findOne({
        userId: userId,
        status: WITHDRAWAL_STATUS.PENDING
    })

    if (existingRequest) {
        throw new Error("You have a pending withdrawal request")
    }

    const user = await User.findById(userId).select("balance");

    if (!user) {
        throw new Error("User not found")
    }

    if (user.balance < payload.amount) {
        throw new Error("Insufficient balance")
    }

    const withdrawalRequest = await WithdrawalRequest.create({
        userId,
        ...payload
    })

    return withdrawalRequest
}

const getAllWithdrawalRequest = async (filter: any, options: TPaginateOptions) => {

    options.select = "userId amount status bankName accountNumber accountType accountHolderName createdAt"
    options.populate = {
        path: "userId",
        select: "name email profilePicture role"
    }
    console.log(filter)
    const withdrawalRequest = await WithdrawalRequest.paginate(filter, options)
    return withdrawalRequest
}

const rejectWithdrawRequest = async (payload: TRejectWithdrawalRequestDto) => {

    const withdrawalRequest = await WithdrawalRequest.findOne({
        _id: payload.requestId,
    })

    if (!withdrawalRequest) {
        throw new ApiError(404, "Withdrawal request not found")
    }

    if (withdrawalRequest.status !== WITHDRAWAL_STATUS.PENDING) {
        throw new ApiError(400, "Withdrawal request is already processed")
    }

    withdrawalRequest.status = WITHDRAWAL_STATUS.REJECTED
    withdrawalRequest.rejectReason = payload.rejectReason
    await withdrawalRequest.save()

    return null;
}

export const withdrawalRequestService = {
    createWithdrawalRequest,
    getAllWithdrawalRequest,
    rejectWithdrawRequest
}