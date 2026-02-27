import { z } from "zod";
import { RideConstants } from "./rideRequest.constant";

const createSchema = z.object({
	body: z
		.object({
			pickUp: z
				.object({
					name: z.string(),
					latitude: z.number().min(-90).max(90),
					longitude: z.number().min(-180).max(180),
				})
				.strict(),
			destination: z
				.object({
					name: z.string(),
					latitude: z.number().min(-90).max(90),
					longitude: z.number().min(-180).max(180),
				})
				.strict(),
			// distance: z.string(),
			// baseFare: z.number(),
			// preferedFare: z.number(),
			note: z.string().optional(),
			rideNeeds: z.array(z.string()).optional(),
			paymentMethod: z.enum(
				[
					RideConstants.PAYMENT_METHOD.CASH,
					RideConstants.PAYMENT_METHOD.CARD,
					RideConstants.PAYMENT_METHOD.WALLET,
				],
				{
					errorMap: () => ({
						code: "BAD_REQUEST",
						message: `Invalid payment method, available payment methods are ${RideConstants.PAYMENT_METHOD.CASH}, ${RideConstants.PAYMENT_METHOD.CARD}, ${RideConstants.PAYMENT_METHOD.WALLET}`,
					}),
				}
			),
			rideFor: z.enum(
				[RideConstants.RIDE_FOR.SELF, RideConstants.RIDE_FOR.OTHER],
				{
					errorMap: () => ({
						code: "BAD_REQUEST",
						message: `Invalid ride for, available ride for are ${RideConstants.RIDE_FOR.SELF}, ${RideConstants.RIDE_FOR.OTHER}`,
					}),
				}
			),
			riderNumber: z.string().optional(),
		})
		.strict()
		.superRefine((data, ctx) => {
			if (
				data.rideFor === RideConstants.RIDE_FOR.OTHER &&
				!data.riderNumber
			) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Rider number is required when ride is for other",
					path: ["riderNumber"],
				});
			}
		}),
});

const calculateFareSchema = z.object({
	query: z
		.object({
			pickUpLat: z.coerce.number().min(-90).max(90),
			pickUpLng: z.coerce.number().min(-180).max(180),
			destinationLat: z.coerce.number().min(-90).max(90),
			destinationLng: z.coerce.number().min(-180).max(180),
		})
		.strict(),
});



export const RideRequestValidation = {
	createSchema,
	calculateFareSchema,
};
