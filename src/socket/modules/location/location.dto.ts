import { z } from "zod";
import { setCurrentLocationSchema } from "./location.validation";

export type UpdateLocationDto = z.infer<typeof setCurrentLocationSchema>;