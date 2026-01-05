import { z } from "zod";
import { RIDEREQUESTSTATUS, SERVICETYPES } from "./rideRequest.interface";
import { addressValidationSchema } from "../../shared/shared.validation";

const pricingInfoValidationSchema = z.object({
	recommendedFare: z.number(),
	minimumFare: z.number(),
	fare: z.number(),
	operationFee: z.number(),
	totalFare: z.number(),
});

export const serviceTypeValidationSchema = z.enum(SERVICETYPES, {
	errorMap: (issue) => {
		if (issue.code === "invalid_enum_value") {
			return {
				message: `"${issue.received}" is not a valid service type. Service type must be one of: ${SERVICETYPES.join(", ")}`,
			};
		}
		return { message: "Invalid service type." };
	},
});

export const createRideRequestValidationSchema = z
	.object({
		pickupAddress: addressValidationSchema,
		dropOffAddress: addressValidationSchema,
		hasSteps: z.boolean().optional(),
		steps: z.array(addressValidationSchema).optional(),
		serviceType: serviceTypeValidationSchema,
		status: z.enum(RIDEREQUESTSTATUS),
		isScheduled: z.boolean().optional(),
		scheduledAt: z.coerce.date().optional(),
		pricingInfo: pricingInfoValidationSchema,
		// validate duration
		estimatedDuration: z.coerce
			.number()
			.min(5 * 60 * 1000, "Duration must be at least 5 minutes") // 5 min in ms
			.max(5 * 60 * 60 * 1000, "Duration must be at most 5 hours"), // 5 hours in ms
		estimatedEndTime: z.coerce.date(),
		distance: z.coerce.number(),
	})
	.strict()

	// validate estimateDuration and estimateEndTime

	.refine(
		(data) => {
			const rideStartTime = data.isScheduled
				? new Date(data.scheduledAt!)
				: new Date();
			const maxDuration = new Date(
				rideStartTime.getTime() + 5 * 60 * 60 * 1000
			); // 5 hours

			// Check that estimateEndTime isn't absurd
			return (
				data.estimatedEndTime > rideStartTime &&
				data.estimatedEndTime <= maxDuration
			);
		},
		{
			message: "estimateEndTime must be within 5 hours from now",
			path: ["estimateEndTime"],
		}
	)

	// check if estimatedEnd time, estimate duration has any conflicts with ride start time
	.refine(
		(data) => {
			const rideStartTime = data.isScheduled
				? new Date(data.scheduledAt!)
				: new Date();

			const calculatedEndTime = new Date(
				rideStartTime.getTime() + data.estimatedDuration
			);

			return (
				calculatedEndTime.getTime() === data.estimatedEndTime.getTime()
			);
		},
		{
			message:
				"estimateEndTime must match rideStartTime + estimateDuration",
			path: ["estimateEndTime"],
		}
	)
	// if hasSteps is present and true, steps is required
	.refine(
		(data) => {
			if (data.hasSteps && !data.steps) {
				return false;
			}
			return true;
		},
		{
			message: "Steps are required if hasSteps is true",
			path: ["steps"],
		}
	)

	// if isScheduled is true, scheduledAt is required
	.refine(
		(data) => {
			if (data.isScheduled && !data.scheduledAt) {
				return false;
			}
			return true;
		},
		{
			message: "Scheduled at is required if isScheduled is true",
			path: ["scheduledAt"],
		}
	);

export type TCreateRideRequest = z.infer<
	typeof createRideRequestValidationSchema
>;

export const cancelRideRequestValidationSchema = z.object({
	reason: z.string().min(1, "Cancellation reason is required"),
});

export type TCancelRideRequest = z.infer<
	typeof cancelRideRequestValidationSchema
>;
