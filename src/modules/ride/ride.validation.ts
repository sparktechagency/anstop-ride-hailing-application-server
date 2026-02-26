import { z } from "zod";

const getMyRideSchema = z.object({
    query: z.object({
        status: z.enum(["ACCEPTED", "ON_GOING", "COMPLETED", "CANCELLED"], {
            errorMap: () => ({
                message: `Invalid status. Must be one of: ACCEPTED, ON_GOING, COMPLETED, CANCELLED`
            })
        }).optional(),
    }).strict(),
})

const getRideDetailsSchema = z.object({
    params: z.object({
        id: z.string().optional(),
    }).strict(),
})

const calculateFareSchema = z.object({
    query: z.object({
        distance: z.coerce.number(),
    }).strict(),
    // body: z.object({
    //     pickUp: z.object({
    //         name: z.string(),
    //         latitude: z.number().min(-90).max(90),
    //         longitude: z.number().min(-180).max(180),
    //     }),
    //     destination: z.object({
    //         name: z.string(),
    //         latitude: z.number().min(-90).max(90),
    //         longitude: z.number().min(-180).max(180),
    //     }),
    // })
})


export const RideValidation = {
    getMyRideSchema,
    getRideDetailsSchema,
    calculateFareSchema
}