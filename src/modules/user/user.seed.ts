import { User } from "./user.model";
import { SEED_USER_IDS } from "./user.seed.constant";
import { USER_ROLES, USER_STATUS } from "./user.constant";

export const seedUsers = async () => {
    console.log("Seeding users...");

    const usersToCreate = [];

    // 20 Riders
    for (let i = 0; i < 20; i++) {
        usersToCreate.push({
            _id: SEED_USER_IDS.RIDERS[i],
            name: `Rider User ${i + 1}`,
            email: `rider${i + 1}@example.com`,
            password: "password123",
            role: [USER_ROLES.RIDER],
            status: USER_STATUS.ACTIVE,
            isEmailVerified: true,
            isOnboarded: false,
            location: { type: "Point", coordinates: [0, 0] }
        });
    }

    // 20 Drivers
    for (let i = 0; i < 20; i++) {
        usersToCreate.push({
            _id: SEED_USER_IDS.DRIVERS[i],
            name: `Driver User ${i + 1}`,
            email: `driver${i + 1}@example.com`,
            password: "password123",
            role: [USER_ROLES.DRIVER],
            status: USER_STATUS.ACTIVE,
            isEmailVerified: true,
            isOnboarded: false,
            location: { type: "Point", coordinates: [0, 0] }
        });
    }

    // 10 Dual-role Users
    for (let i = 0; i < 10; i++) {
        usersToCreate.push({
            _id: SEED_USER_IDS.DUAL_ROLE[i],
            name: `Dual User ${i + 1}`,
            email: `dual${i + 1}@example.com`,
            password: "password123",
            role: [USER_ROLES.RIDER, USER_ROLES.DRIVER],
            status: USER_STATUS.ACTIVE,
            isEmailVerified: true,
            isOnboarded: false,
            location: { type: "Point", coordinates: [0, 0] }
        });
    }

    // Use User.create to trigger password hashing hooks
    // We can't use insertMany if we want the hooks to run for each document individually easily with create
    // but create can take an array.
    
    const createdUsers = await User.create(usersToCreate);
    console.log(`Created ${createdUsers.length} users successfully.`);
    return createdUsers;
};
