import { z } from "zod";
import {
	addTrustedContactValidationSchema,
	riderOnboardingValidationSchema,
	saveAddressValidationSchema,
} from "./rider.validation";

export type OnboardRiderDto = z.infer<typeof riderOnboardingValidationSchema>;
export type SaveAddressDto = z.infer<typeof saveAddressValidationSchema>;
export type AddTrustedContactDto = z.infer<
	typeof addTrustedContactValidationSchema
>;
