import { TPaginateOptions } from "../../types/paginate"
import { Transaction } from "./transaction.model"

const getAllTransations = async(filter: any, options: TPaginateOptions) => {
    const transactions = await Transaction.paginate({},{})

    console.log("transactions",transactions)
    return transactions;
}


export const TransactionService = {
    getAllTransations
}