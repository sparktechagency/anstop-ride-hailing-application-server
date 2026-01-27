import { RideRequest } from "./rideRequest.model";
import { Transaction } from "../transaction/transaction.model";
import { SEED_USER_IDS } from "../user/user.seed.constant";
import { RideConstants } from "./rideRequest.constant";
import { TRANSACTION_STATUS, TRANSACTION_TYPE } from "../transaction/transaction.constant";

export const seedRideRequests = async () => {
    console.log("Seeding 2000 ride requests and transactions...");

    const riders = [...SEED_USER_IDS.RIDERS, ...SEED_USER_IDS.DUAL_ROLE];
    const drivers = [...SEED_USER_IDS.DRIVERS, ...SEED_USER_IDS.DUAL_ROLE];

    const activeRideByUserId = new Set<string>();
    const requestsToCreate = [];
    const transactionsToCreate = [];

    const statuses = [
        RideConstants.RIDE_STATUS.PENDING,
        RideConstants.RIDE_STATUS.ACCEPTED,
        RideConstants.RIDE_STATUS.ONGOING
    ];

    for (let i = 0; i < 2000; i++) {
        let riderId = riders[Math.floor(Math.random() * riders.length)];
        let driverId = drivers[Math.floor(Math.random() * drivers.length)];

        // Ensure rider and driver are different
        while (riderId.toString() === driverId.toString()) {
            driverId = drivers[Math.floor(Math.random() * drivers.length)];
        }

        // Determine status
        let status: any = RideConstants.RIDE_STATUS.COMPLETED;
        const canBeActive = !activeRideByUserId.has(riderId.toString()) && !activeRideByUserId.has(driverId.toString());

        if (canBeActive && Math.random() < 0.05) { // 5% chance to be active if allowed
            status = statuses[Math.floor(Math.random() * statuses.length)];
            activeRideByUserId.add(riderId.toString());
            activeRideByUserId.add(driverId.toString());
        }

        // Determine payment method
        const rand = Math.random();
        let paymentMethod: any = RideConstants.PAYMENT_METHOD.CARD;
        if (rand > 0.6 && rand <= 0.8) {
            paymentMethod = RideConstants.PAYMENT_METHOD.CASH;
        } else if (rand > 0.8) {
            paymentMethod = RideConstants.PAYMENT_METHOD.WALLET;
        }

        const baseFare = Math.floor(Math.random() * 400) + 100; // 100 to 500
        const finalFare = status === RideConstants.RIDE_STATUS.COMPLETED ? baseFare : undefined;

        const request = {
            riderId,
            driverId,
            pickUp: { name: "Pickup Location", coordinates: [0, 0] },
            destination: { name: "Destination Location", coordinates: [0.01, 0.01] },
            distance: "5.5 km",
            baseFare,
            finalFare,
            status,
            paymentMethod
        };
        requestsToCreate.push(request);

        // Transaction
        const transaction = {
            riderId,
            driverId: status === RideConstants.RIDE_STATUS.PENDING ? undefined : driverId,
            amount: baseFare,
            type: TRANSACTION_TYPE.RIDE_FARE,
            status: TRANSACTION_STATUS.COMPLETED,
            commissionRate: 10,
            commissionAmount: Math.floor(baseFare * 0.1),
            driverEarningAmount: Math.floor(baseFare * 0.9)
        };
        transactionsToCreate.push(transaction);

        // If Wallet payment, create consistent deposit
        if (paymentMethod === RideConstants.PAYMENT_METHOD.WALLET) {
            transactionsToCreate.push({
                riderId,
                amount: baseFare,
                type: TRANSACTION_TYPE.DEPOSIT,
                status: TRANSACTION_STATUS.COMPLETED
            });
        }
    }

    console.log("Saving ride requests to database...");
    await RideRequest.insertMany(requestsToCreate);

    console.log("Saving transactions to database...");
    await Transaction.insertMany(transactionsToCreate);

    console.log("Updating user balances based on transactions...");
    const balanceMap = new Map<string, number>();

    for (const tx of transactionsToCreate) {
        if (tx.type === TRANSACTION_TYPE.DEPOSIT) {
            const userId = tx.riderId.toString();
            balanceMap.set(userId, (balanceMap.get(userId) || 0) + tx.amount);
        } else if (tx.type === TRANSACTION_TYPE.RIDE_FARE && tx.driverId) {
            const driverId = tx.driverId.toString();
            balanceMap.set(driverId, (balanceMap.get(driverId) || 0) + (tx.driverEarningAmount || 0));
        }
    }

    const bulkOps = Array.from(balanceMap.entries()).map(([userId, balanceChange]) => ({
        updateOne: {
            filter: { _id: userId },
            update: { $inc: { balance: balanceChange } }
        }
    }));

    if (bulkOps.length > 0) {
        const { User } = await import("../user/user.model");
        await User.bulkWrite(bulkOps as any);
        console.log(`Updated balances for ${bulkOps.length} users.`);
    }

    console.log(`Successfully seeded ${requestsToCreate.length} ride requests and ${transactionsToCreate.length} transactions.`);
};
