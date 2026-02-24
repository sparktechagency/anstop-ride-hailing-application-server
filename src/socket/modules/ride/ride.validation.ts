import { z } from "zod";

const newOfferSchema = z.object({
    rideId: z.string().regex(/^[0-9a-fA-F]{24}$/),
    amount: z.number().positive(),
});

const acceptRideSchema = z.object({
    rideId: z.string().regex(/^[0-9a-fA-F]{24}$/),
    driverId: z.string().regex(/^[0-9a-fA-F]{24}$/),
});

const cancelOfferSchema = z.object({
    rideId: z.string().regex(/^[0-9a-fA-F]{24}$/),
    driverId: z.string().regex(/^[0-9a-fA-F]{24}$/),
});

const pickupRiderSchema = z.object({}); // No payload required, uses driver's engagedRideId

const dropOffRiderSchema = z.object({}); // No payload required, uses driver's engagedRideId

const cancelRideSchema = z.object({
    rideId: z.string().regex(/^[0-9a-fA-F]{24}$/),
    reason: z.string().optional(),
});

export const RideSocketValidation = {
    newOfferSchema,
    acceptRideSchema,
    cancelOfferSchema,
    pickupRiderSchema,
    dropOffRiderSchema,
    cancelRideSchema,
};
