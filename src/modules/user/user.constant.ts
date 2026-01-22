// DEFINE ROLES CONSTANT

export const USER_ROLES = {
	RIDER: "RIDER",
	DRIVER: "DRIVER",
	ADMIN: "ADMIN",
} as const;

export const RoleRights = new Map<string, string[]>([
	[USER_ROLES.RIDER, ["COMMON", "RIDER"]],
	[USER_ROLES.DRIVER, ["COMMON", "DRIVER"]],
	[USER_ROLES.ADMIN, ["COMMON", "ADMIN"]],
]);

// DEFINE CONSTANT FOR STATUS

export const USER_STATUS = {
	ACTIVE: "ACTIVE",
	PENDING: "PENDING",
	SUSPENDED: "SUSPENDED",
} as const;


// DEFINE CONSTANT FOR GENDER
export const GENDER = {
    MALE: "MALE",
    FEMALE: "FEMALE",
    OTHER: "OTHER",
} as const

export const SAVED_ADDRESS_TYPE = {
    HOME: "HOME",
    WORK: "WORK",
	BOOKMARK: "BOOKMARK",
} as const;