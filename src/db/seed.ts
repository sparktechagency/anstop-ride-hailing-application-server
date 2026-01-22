import mongoose from "mongoose";
import { config } from "../config";
import { User } from "../modules/user/user.model";
import { LegalDocument } from "../modules/legalDocument/legalDocument.model";
import { Ride } from "../modules/ride/ride.model";
import { RideRequest } from "../modules/rideRequest/rideRequest.model";
import { Transaction } from "../modules/transaction/transaction.model";
import { Wallet } from "../modules/wallet/wallet.model";
import { WithdrawalRequest } from "../modules/withdrawalRequest/withdrawalRequest.model";
import { Notification } from "../modules/notification/notification.model";
import { Support } from "../modules/support/support.model";
import { OTPToken } from "../modules/otpToken/otpToken.model";
import { Conversation } from "../modules/messaging/conversation/conversation.model";
import { Participant } from "../modules/messaging/participant/participant.model";
import { Message } from "../modules/messaging/message/message.model";
import Inbox from "../modules/messaging/inbox/inbox.model";

import { USER_ROLES, USER_STATUS } from "../modules/user/user.constant";
import { LEGAL_DOCUMENT_TYPE } from "../modules/legalDocument/legalDocument.constant";
import { RideConstants as RideMsgConstants } from "../modules/ride/ride.constant";
import { RideConstants as RideReqConstants } from "../modules/rideRequest/rideRequest.constant";
import { TRANSACTION_STATUS, TRANSACTION_TYPE } from "../modules/transaction/transaction.constant";
import { WITHDRAWAL_STATUS } from "../modules/withdrawalRequest/withdrawalRequest.constant";
import { SUPPORT_TYPE } from "../modules/support/support.constant";
import { INBOX_STATUS } from "../modules/messaging/inbox/inbox.constant";

const seedLegalDocs = async () => {
    const legalDocs = [
        {
            type: LEGAL_DOCUMENT_TYPE.PRIVACY_POLICY,
            title: "Privacy Policy",
            description: "Default Privacy Policy content.",
        },
        {
            type: LEGAL_DOCUMENT_TYPE.TERMS_AND_CONDITIONS,
            title: "Terms and Conditions",
            description: "Default Terms and Conditions content.",
        },
        {
            type: LEGAL_DOCUMENT_TYPE.ABOUT_US,
            title: "About Us",
            description: "Default About Us content.",
        },
        {
            type: LEGAL_DOCUMENT_TYPE.REFUND_POLICY,
            title: "Refund Policy",
            description: "Default Refund Policy content.",
        },
    ];

    for (const doc of legalDocs) {
        await LegalDocument.findOneAndUpdate(
            { type: doc.type },
            { $setOnInsert: doc },
            { upsert: true, new: true }
        );
    }
    console.log("Legal Documents seeded");
};

const seedUsers = async () => {
    const users = [
        {
            name: "Admin User",
            email: "admin@admin.com",
            password: "admin@anstop",
            role: [USER_ROLES.ADMIN],
            status: USER_STATUS.ACTIVE,
            isEmailVerified: true,
            isOnboarded: true,
            location: { type: "Point", coordinates: [0, 0] }
        },
        {
            name: "Test Rider",
            email: "rider@test.com",
            password: "password123",
            role: [USER_ROLES.RIDER],
            status: USER_STATUS.ACTIVE,
            isEmailVerified: true,
            isOnboarded: true,
            location: { type: "Point", coordinates: [-74.0060, 40.7128] }
        },
        {
            name: "Test Driver",
            email: "driver@test.com",
            password: "password123",
            role: [USER_ROLES.DRIVER],
            status: USER_STATUS.ACTIVE,
            isEmailVerified: true,
            isOnboarded: true,
            location: { type: "Point", coordinates: [-74.0050, 40.7120] }
        }
    ];

    const seededUsers = [];
    for (const userData of users) {
        let user = await User.findOne({ email: userData.email });
        if (!user) {
            user = await User.create(userData);
            console.log(`User ${userData.email} created`);
        }
        seededUsers.push(user);
    }
    return seededUsers;
};

const seedWallets = async (users: any[]) => {
    for (const user of users) {
        await Wallet.findOneAndUpdate(
            { user: user._id },
            { $setOnInsert: { balance: 1000 } },
            { upsert: true, new: true }
        );
    }
    console.log("Wallets seeded");
};



const seedRequestsAndRides = async (rider: any, driver: any) => {
    // Seed Ride Request
    const rideRequest = await RideRequest.findOneAndUpdate(
        { riderId: rider._id, status: RideReqConstants.RIDE_STATUS.PENDING },
        {
            $setOnInsert: {
                riderId: rider._id,
                pickUp: { name: "Start Point", coordinates: [-74.0060, 40.7128] },
                destination: { name: "End Point", coordinates: [-73.9855, 40.7580] },
                distance: "5.2 km",
                baseFare: 150,
                status: RideReqConstants.RIDE_STATUS.PENDING,
                paymentMethod: RideReqConstants.PAYMENT_METHOD.CASH
            }
        },
        { upsert: true, new: true }
    );

    // Seed Completed Ride
    const ride = await Ride.findOneAndUpdate(
        { riderId: rider._id, driverId: driver._id, status: RideMsgConstants.RIDE_STATUS.COMPLETED },
        {
            $setOnInsert: {
                riderId: rider._id,
                driverId: driver._id,
                pickup: { name: "Old Start Point", coordinates: [-74.0445, 40.6892] },
                destination: { name: "Old End Point", coordinates: [-74.0060, 40.7128] },
                distance: "3.5 km",
                baseFare: 100,
                finalFare: 120,
                status: RideMsgConstants.RIDE_STATUS.COMPLETED,
                paymentMethod: RideMsgConstants.PAYMENT_METHOD.WALLET
            }
        },
        { upsert: true, new: true }
    );
    console.log("Ride requests and rides seeded");
    return { rideRequest, ride };
};

const seedTransactionsAndWithdrawals = async (rider: any, driver: any) => {
    // Transaction
    await Transaction.create({
        riderId: rider._id,
        driverId: driver._id,
        amount: 120,
        type: TRANSACTION_TYPE.RIDE_FARE,
        status: TRANSACTION_STATUS.COMPLETED,
        commissionAmount: 20,
        driverEarningAmount: 100
    });

    // Withdrawal Request
    await WithdrawalRequest.create({
        userId: driver._id,
        amount: 500,
        status: WITHDRAWAL_STATUS.PENDING,
        bankName: "Test Bank",
        accountNumber: "1234567890",
        accountHolderName: driver.name,
        accountType: "Savings"
    });
    console.log("Transactions and Withdrawal Requests seeded");
};

const seedOtherData = async (user: any) => {
    // Notification
    await Notification.create({
        userId: user._id,
        icon: "info",
        title: "Welcome!",
        description: "Welcome to Anstop application."
    });

    // Support
    await Support.create({
        userId: user._id,
        subject: "General Inquiry",
        message: "How do I use this app?",
        status: SUPPORT_TYPE.OPEN
    });

    // OTP Token
    await OTPToken.create({
        userId: user._id,
        otp: "123456",
        type: "EMAIL_VERIFICATION",
        expiresAt: new Date(Date.now() + 3600000)
    });
    console.log("Notifications, Support tickets, and OTP tokens seeded");
};

const seedMessaging = async (user1: any, user2: any) => {
    const conversation = await Conversation.create({
        conversationType: "PRIVATE",
        privateHash: [user1._id, user2._id].sort().join("_")
    });

    const p1 = await Participant.create({
        user: user1._id,
        conversation: conversation._id,
        role: "ADMIN"
    });

    const p2 = await Participant.create({
        user: user2._id,
        conversation: conversation._id,
        role: "MEMBER"
    });

    const message = await Message.create({
        sender: user1._id,
        conversation: conversation._id,
        text: "Hello from test rider!"
    });

    await Inbox.create({
        conversationId: conversation._id,
        participantId: p2._id,
        messageId: message._id,
        status: INBOX_STATUS.SENT
    });
    console.log("Messaging (Conversations, Messages, Inboxes) seeded");
};

const main = async () => {
    try {
        await mongoose.connect(config.db_uri!);
        console.log("Connected to database for seeding");

        await seedLegalDocs();
        const users = await seedUsers();
        await seedWallets(users);

        const rider = users.find(u => u.role.includes(USER_ROLES.RIDER));
        const driver = users.find(u => u.role.includes(USER_ROLES.DRIVER));

        if (rider && driver) {
            await seedRequestsAndRides(rider, driver);
            await seedTransactionsAndWithdrawals(rider, driver);
            await seedMessaging(rider, driver);
        }

        await seedOtherData(users[0]); // Seed some data for admin

        console.log("Full database seeding completed successfully");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

main();
