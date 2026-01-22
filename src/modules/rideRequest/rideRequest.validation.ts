import { z } from "zod";
import { RideConstants } from "./rideRequest.constant";

const createSchema = z.object({
    body: z.object({
        pickUp: z.object({
            name: z.string(),
            latitude: z.number().min(-90).max(90),
            longitude: z.number().min(-180).max(180),
        }),
        destination: z.object({
            name: z.string(),
            latitude: z.number().min(-90).max(90),
            longitude: z.number().min(-180).max(180),
        }),
        distance: z.string(),
        baseFare: z.number(),
        preferedFare: z.number(),
        note: z.string().optional(),
        rideNeeds: z.array(z.string()).optional(),
        paymentMethod: z.enum([RideConstants.PAYMENT_METHOD.CASH, RideConstants.PAYMENT_METHOD.CARD, RideConstants.PAYMENT_METHOD.WALLET], {
            errorMap: () => ({
                code: "BAD_REQUEST",
                message: `Invalid payment method, available payment methods are ${RideConstants.PAYMENT_METHOD.CASH}, ${RideConstants.PAYMENT_METHOD.CARD}, ${RideConstants.PAYMENT_METHOD.WALLET}`,
            }),
        }),
    })
})

export const RideRequestValidation = {
    createSchema
}