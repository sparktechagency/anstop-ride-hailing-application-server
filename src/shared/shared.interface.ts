import { z } from "zod";
import {
	languagePreferenceValidationSchema,
	setUserAddressValidationSchema,
} from "./shared.validation";

export type TUserName = {
	firstName: string;
	lastName: string;
};

export type TAddress = {
	addressLabel: string;
	coordinates: [number, number]; // [longitude, latitude]
};

export const LanguagePreference = {
	English: "en",
	Spanish: "es",
	French: "fr",
} as const;

export type TLanguagePreference = "en" | "es" | "fr";

export const UserRoles = {
	Rider: "Rider",
	Driver: "Driver",
	Admin: "Admin",
	Super_Admin: "Super_Admin",
};

export const RoleRights = new Map<string, string[]>([
	[UserRoles.Rider, ["Common", "Rider"]],
	[UserRoles.Driver, ["Common", "Driver"]],
	[UserRoles.Admin, ["Common", "Admin"]],
	[UserRoles.Super_Admin, ["Common", "Admin", "Super_Admin"]],
]);

export const Roles = [
	UserRoles.Rider,
	UserRoles.Driver,
	UserRoles.Admin,
	UserRoles.Super_Admin,
] as const;

export type TRoles = (typeof Roles)[number];

// authenticated user request
export type TUserData = {
	userId: string;
	role: string;
};

// Type definition by zod schema
export type TSetUserAddress = z.infer<typeof setUserAddressValidationSchema>;
export type TLanguagePreferencePayload = z.infer<
	typeof languagePreferenceValidationSchema
>;
