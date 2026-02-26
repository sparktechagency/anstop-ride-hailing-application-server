import { z } from "zod";
import { RideSocketValidation } from "./ride.validation";

type NewOfferDto = z.infer<typeof RideSocketValidation.newOfferSchema>;
type AcceptRideDto = z.infer<typeof RideSocketValidation.acceptRideSchema>;
type CancelOfferDto = z.infer<typeof RideSocketValidation.cancelOfferSchema>;
type PickupRiderDto = z.infer<typeof RideSocketValidation.pickupRiderSchema>;
type DropOffRiderDto = z.infer<typeof RideSocketValidation.dropOffRiderSchema>;
type CancelRideDto = z.infer<typeof RideSocketValidation.cancelRideSchema>;

export type RideSocketDto = {
    NewOffer: NewOfferDto;
    AcceptRide: AcceptRideDto;
    CancelOffer: CancelOfferDto;
    PickupRider: PickupRiderDto;
    DropOffRider: DropOffRiderDto;
    CancelRide: CancelRideDto;
};