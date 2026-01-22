import { Types } from "mongoose";
import { RideConstants } from "./ride.constant";

interface LOCATION {
    name: string;
    coordinates: [number, number]; 
}


type TRideNeeds = typeof RideConstants.RIDE_NEEDS[keyof typeof RideConstants.RIDE_NEEDS];

export type TRideStatus = typeof RideConstants.RIDE_STATUS[keyof typeof RideConstants.RIDE_STATUS];

type TPaymentMethod = typeof RideConstants.PAYMENT_METHOD[keyof typeof RideConstants.PAYMENT_METHOD];

type TCancelledBy = typeof RideConstants.CANCELLED_BY[keyof typeof RideConstants.CANCELLED_BY];

type TRefundStatus = typeof RideConstants.REFUND_STATUS[keyof typeof RideConstants.REFUND_STATUS];

type TCancellationInfo = {
    cancelledBy: TCancelledBy;
    reason: string;
    cancelledAt: Date;
    refundAmount?: number;
    refundStatus?: TRefundStatus;
}

export interface TRide {
  _id: Types.ObjectId;
  riderId: Types.ObjectId;
  driverId: Types.ObjectId
  pickup: LOCATION;
  destination: LOCATION;
  distance: string;
  baseFare: number;
  finalFare: number;
  note?: string;
  rideNeeds?: TRideNeeds[];
  status: TRideStatus;
  paymentMethod: TPaymentMethod;
  cancellationInfo?: TCancellationInfo;
  createdAt: Date;
  updatedAt: Date;
}
