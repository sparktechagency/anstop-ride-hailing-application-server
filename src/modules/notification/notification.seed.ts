import { Notification } from "./notification.model";
import { SEED_USER_IDS } from "../user/user.seed.constant";

export const seedNotifications = async () => {
    console.log("Seeding 500 notifications...");

    const allUserIds = [
        ...SEED_USER_IDS.RIDERS,
        ...SEED_USER_IDS.DRIVERS,
        ...SEED_USER_IDS.DUAL_ROLE
    ];

    const notificationsToCreate = [];
    const icons = ["bell", "info", "star", "check-circle", "alert-triangle"];
    const titles = [
        "New Ride Request",
        "Payment Received",
        "Account Update",
        "Promotional Offer",
        "System Alert",
        "Review Received",
        "Reward Earned"
    ];

    for (let i = 0; i < 500; i++) {
        const userId = allUserIds[Math.floor(Math.random() * allUserIds.length)];
        const icon = icons[Math.floor(Math.random() * icons.length)];
        const title = titles[Math.floor(Math.random() * titles.length)];

        notificationsToCreate.push({
            userId,
            icon,
            title,
            description: `This is a test notification number ${i + 1} for ${title.toLowerCase()}.`
        });
    }

    await Notification.insertMany(notificationsToCreate);
    console.log(`Successfully seeded ${notificationsToCreate.length} notifications.`);
};
