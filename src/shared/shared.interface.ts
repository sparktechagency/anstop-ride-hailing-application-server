import { z } from "zod";
import {
	languagePreferenceValidationSchema,
	setUserAddressValidationSchema,
} from "./shared.validation";
import { Types } from "mongoose";

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



// authenticated user request
export type TUserData = {
	userId: Types.ObjectId;
	role: string;
};

// Type definition by zod schema
export type TSetUserAddress = z.infer<typeof setUserAddressValidationSchema>;
export type TLanguagePreferencePayload = z.infer<
	typeof languagePreferenceValidationSchema
>;
