import { Types } from "mongoose";
import { TAddress } from "../../shared/shared.interface";
import { RideConstants } from "./rideRequest.constant";


type TRideNeeds = typeof RideConstants.RIDE_NEEDS[keyof typeof RideConstants.RIDE_NEEDS];

export type TRideStatus = typeof RideConstants.RIDE_STATUS[keyof typeof RideConstants.RIDE_STATUS];

type TPaymentMethod = typeof RideConstants.PAYMENT_METHOD[keyof typeof RideConstants.PAYMENT_METHOD];

type TCancelledBy = typeof RideConstants.CANCELLED_BY[keyof typeof RideConstants.CANCELLED_BY];

type TRefundStatus = typeof RideConstants.REFUND_STATUS[keyof typeof RideConstants.REFUND_STATUS];

type TRideFor = typeof RideConstants.RIDE_FOR[keyof typeof RideConstants.RIDE_FOR];

type TCancellationInfo = {
	cancelledBy: TCancelledBy;
	reason: string;
	cancelledAt: Date;
	refundAmount?: number;
	refundStatus?: TRefundStatus;
}


// interface TPricingInfo {
// 	recommendedFare: number;
// 	minimumFare: number;
// 	fare: number;
// 	operationFee: number;
// 	totalFare: number;
// }
export interface TRideRequest {
	_id?: Types.ObjectId;
	riderId: Types.ObjectId;
	driverId?: Types.ObjectId;
	pickUp: TAddress;
	destination: TAddress;
	distance: string;
	fare: number;
	rideFor: TRideFor;
	riderNumber?: string;
	note?: string;
	rideNeeds?: TRideNeeds[];
	status: TRideStatus;
	paymentMethod: TPaymentMethod;
	isPaymentCompleted: boolean;
	cancellationInfo?: TCancellationInfo;
	createdAt: Date;
	updatedAt: Date;
}
