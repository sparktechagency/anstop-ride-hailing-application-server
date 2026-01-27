import { User } from "../user/user.model";
import { WithdrawalRequest } from "./withdrawalRequest.model";
import { Transaction } from "../transaction/transaction.model";
import { WITHDRAWAL_STATUS } from "./withdrawalRequest.constant";
import { TRANSACTION_STATUS, TRANSACTION_TYPE } from "../transaction/transaction.constant";
import { USER_ROLES } from "../user/user.constant";

export const seedWithdrawalRequests = async () => {
    console.log("Seeding withdrawal requests for drivers...");

    // Find all users who are drivers
    const drivers = await User.find({ role: USER_ROLES.DRIVER, balance: { $gte: 100 } });

    if (drivers.length === 0) {
        console.log("No drivers with sufficient balance found for withdrawal seeding.");
        return;
    }

    const requestsToCreate = [];
    const transactionsToCreate = [];
    const userBalanceUpdates = [];

    for (const driver of drivers) {
        // Random amount between 100 and balance
        const amount = Math.floor(Math.random() * (driver.balance - 100 + 1)) + 100;

        // 40% chance to be COMPLETED
        const rand = Math.random();
        let status: any = WITHDRAWAL_STATUS.PENDING;
        if (rand < 0.4) {
            status = WITHDRAWAL_STATUS.COMPLETED;
        } else if (rand < 0.6) {
            status = WITHDRAWAL_STATUS.REJECTED;
        }

        const request = {
            userId: driver._id,
            amount,
            status,
            bankName: "Global Bank",
            accountNumber: "1234567890",
            accountHolderName: driver.name,
            accountType: "Savings"
        };
        requestsToCreate.push(request);

        if (status === WITHDRAWAL_STATUS.COMPLETED) {
            // Create transaction
            transactionsToCreate.push({
                riderId: driver._id, // Using riderId as the main userId in transaction record for consistency with current model
                amount,
                type: TRANSACTION_TYPE.WITHDRAWAL,
                status: TRANSACTION_STATUS.COMPLETED,
                payoutDetails: {
                    accountNumber: "1234567890",
                    accountHolderName: driver.name,
                    accountType: "Savings",
                    bankName: "Global Bank"
                }
            });

            // Prepare balance deduction
            userBalanceUpdates.push({
                updateOne: {
                    filter: { _id: driver._id },
                    update: { $inc: { balance: -amount } }
                }
            });
        }
    }

    if (requestsToCreate.length > 0) {
        await WithdrawalRequest.insertMany(requestsToCreate);
        console.log(`Created ${requestsToCreate.length} withdrawal requests.`);
    }

    if (transactionsToCreate.length > 0) {
        await Transaction.insertMany(transactionsToCreate);
        console.log(`Created ${transactionsToCreate.length} withdrawal transactions.`);
    }

    if (userBalanceUpdates.length > 0) {
        await User.bulkWrite(userBalanceUpdates as any);
        console.log(`Updated balances for ${userBalanceUpdates.length} users due to withdrawals.`);
    }
};
