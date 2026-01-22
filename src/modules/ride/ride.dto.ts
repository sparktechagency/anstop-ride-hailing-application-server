import { z } from "zod";
import { RideValidation } from "./ride.validation";

export type GetMyRideDto = z.infer<typeof RideValidation.getMyRideSchema>["query"];