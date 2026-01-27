import mongoose from "mongoose";
import { config } from "../config";
import { User } from "../modules/user/user.model";
import { Transaction } from "../modules/transaction/transaction.model";
import { RideRequest } from "../modules/rideRequest/rideRequest.model";
import { Notification } from "../modules/notification/notification.model";
import { WithdrawalRequest } from "../modules/withdrawalRequest/withdrawalRequest.model";
import { seedUsers } from "../modules/user/user.seed";
import { seedRideRequests } from "../modules/rideRequest/rideRequest.seed";
import { seedNotifications } from "../modules/notification/notification.seed";
import { seedWithdrawalRequests } from "../modules/withdrawalRequest/withdrawalRequest.seed";

const clearDatabase = async () => {
    console.log("Clearing existing users, transactions, ride requests, notifications, and withdrawal requests...");
    await User.deleteMany({});
    await Transaction.deleteMany({});
    await RideRequest.deleteMany({});
    await Notification.deleteMany({});
    await WithdrawalRequest.deleteMany({});
};

const main = async () => {
    try {
        if (!config.db_uri) {
            throw new Error("DB_URI is not defined in config");
        }
        await mongoose.connect(config.db_uri);
        console.log("Connected to database for seeding");

        await clearDatabase();

        // Seed users using the modular seeder
        await seedUsers();

        // Seed ride requests and transactions (this also updates user balances)
        await seedRideRequests();

        // Seed notifications
        await seedNotifications();

        // Seed withdrawal requests (runs after balances are updated)
        await seedWithdrawalRequests();

        console.log("Full database seeding completed successfully");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

main();
