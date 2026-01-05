import { Types } from "mongoose";
import { TAddress } from "../../shared/shared.interface";

export const RideRequestStatus = {
	PENDING: "PENDING",
	ACCEPTED: "ACCEPTED",
	ONGOING: "ONGOING",
	DRIVER_CANCELED: "DRIVER_CANCELED",
	USER_CANCELED: "USER_CANCELED",
	COMPLETED: "COMPLETED",
} as const;

type TRideRequestStatus =
	(typeof RideRequestStatus)[keyof typeof RideRequestStatus];

export const RIDEREQUESTSTATUS = [
	RideRequestStatus.PENDING,
	RideRequestStatus.ACCEPTED,
	RideRequestStatus.ONGOING,
	RideRequestStatus.DRIVER_CANCELED,
	RideRequestStatus.USER_CANCELED,
	RideRequestStatus.COMPLETED,
] as const;

export const ServiceType = {
	RYDR_BASIC: "RYDR_BASIC",
	RYDR_Female: "RYDR_Female",
	RYDR_Family: "RYDR_Family",
} as const;

export type TServiceType = (typeof ServiceType)[keyof typeof ServiceType];

export const SERVICETYPES = [
	ServiceType.RYDR_BASIC,
	ServiceType.RYDR_Female,
	ServiceType.RYDR_Family,
] as const;

interface TPricingInfo {
	recommendedFare: number;
	minimumFare: number;
	fare: number;
	operationFee: number;
	totalFare: number;
}
export interface TRideRequest {
	_id?: Types.ObjectId;
	userId: Types.ObjectId;
	driverId?: Types.ObjectId;
	pickupAddress: TAddress;
	dropOffAddress: TAddress;
	hasSteps: boolean;
	steps?: TAddress[];
	isScheduled: boolean;
	scheduledAt?: Date;
	serviceType: TServiceType;
	pricingInfo: TPricingInfo;
	status: TRideRequestStatus;
	isCancelled: boolean;
	cancellationReason?: {
		type: "USER_CANCELED" | "DRIVER_CANCELED";
		reason: string;
	};
	estimatedDuration: number;
	estimatedEndTime: Date;
	distance: number; // in km
	createdAt: Date;
	updatedAt: Date;
}
