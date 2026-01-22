import ApiError from "../../utils/ApiError";
import httpStatus from "http-status";
import { Wallet } from "./wallet.model";

const checkBalance = async (userId: string) => {
    const wallet = await Wallet.findOne({ user: userId }).select("balance").lean();
    if (!wallet) {
        throw new ApiError(httpStatus.NOT_FOUND, "Wallet not found");
    }
    return wallet.balance;
}