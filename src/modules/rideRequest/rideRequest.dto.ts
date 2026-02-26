import { z } from "zod";
import { RideRequestValidation } from "./rideRequest.validation";

export type TCreateRideRequestDto = z.infer<typeof RideRequestValidation.createSchema>['body'];
export type TCalculateFareDto = z.infer<typeof RideRequestValidation.calculateFareSchema>['query'];