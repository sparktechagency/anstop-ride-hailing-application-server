import { z } from "zod";

const newOfferSchema = z.object({
    rideId: z.string().regex(/^[0-9a-fA-F]{24}$/),
}).strict();

const acceptRideSchema = z.object({
    rideId: z.string().regex(/^[0-9a-fA-F]{24}$/),
    driverId: z.string().regex(/^[0-9a-fA-F]{24}$/),
}).strict();

const cancelOfferSchema = z.object({
    rideId: z.string().regex(/^[0-9a-fA-F]{24}$/),
    driverId: z.string().regex(/^[0-9a-fA-F]{24}$/),
}).strict();

const pickupRiderSchema = z.object({}).strict(); // No payload required, uses driver's engagedRideId

const dropOffRiderSchema = z.object({}).strict(); // No payload required, uses driver's engagedRideId

const cancelRideSchema = z.object({
    rideId: z.string().regex(/^[0-9a-fA-F]{24}$/),
    reason: z.string(),
}).strict();

export const RideSocketValidation = {
    newOfferSchema,
    acceptRideSchema,
    cancelOfferSchema,
    pickupRiderSchema,
    dropOffRiderSchema,
    cancelRideSchema,
};
