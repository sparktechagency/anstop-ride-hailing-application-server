import { z } from "zod";

export const setCurrentLocationSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
    locationName: z.string(),
}).strict();