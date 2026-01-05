import ApiError from "../../utils/ApiError";
import httpStatus from "http-status";
import { TAddress } from "../../shared/shared.interface";
import { RideRequest } from "../rideRequest/rideRequest.model";
import { RideRequestStatus } from "../rideRequest/rideRequest.interface";
import { Rider } from "../rider/rider.model";
import { User } from "../user/user.model";
import { startSession, Types } from "mongoose";
import {
	AddTrustedContactDto,
	OnboardRiderDto,
	SaveAddressDto,
} from "./rider.dto";
import { UserInternalApi } from "../user";
import { TRider } from "./rider.interface";

// rider internal apis

const getRider = async (payload: Partial<TRider>) => {
	const rider = await Rider.findOne(payload);

	if (!rider) {
		throw new ApiError(httpStatus.NOT_FOUND, "Rider not found");
	}

	return rider;
};

const createRider = async (userId: Types.ObjectId) => {
	const rider = await Rider.create({ user: userId });
	return rider;
};

// Rider services

export const onboardRider = async (
	userId: Types.ObjectId,
	payload: OnboardRiderDto
): Promise<void> => {
	const { username, email } = payload;

	const session = await startSession();

	try {
		// performing mongodb transaction
		await session.withTransaction(async () => {
			const dataToUpdate = {
				username: username,
				email: email,
				isVerified: true,
				isOnboarded: true,
			};

			await UserInternalApi.updateUser(userId, dataToUpdate);

			await createRider(userId);
		});
	} catch (error) {
		console.error("Rider onboarding transaction failed:", error);
		throw new ApiError(
			httpStatus.INTERNAL_SERVER_ERROR,
			"Rider onboarding failed"
		);
	} finally {
		session.endSession();
	}
};

const saveAddress = async (
	userId: Types.ObjectId,
	payload: SaveAddressDto
): Promise<void> => {
	const { title, address } = payload;

	// Find the user by ID
	const rider = await getRider({ user: userId });

	if (!rider) {
		throw new ApiError(httpStatus.NOT_FOUND, "Rider does not exist");
	}

	// Check if the user already has a saved address with the same title

	if (rider.savedAddresses.some((loc) => loc.title === title)) {
		throw new ApiError(
			httpStatus.BAD_REQUEST,
			"Address with this title already exists"
		);
	}

	// Check if the address is already saved
	if (
		rider.savedAddresses.some(
			(loc) => loc.address.addressLabel === address.addressLabel
		)
	) {
		throw new ApiError(httpStatus.BAD_REQUEST, "Address already saved");
	}

	// Check if the coordinates is already saved
	if (
		rider.savedAddresses.some(
			(loc) =>
				loc.address.coordinates[0] === address.coordinates[0] &&
				loc.address.coordinates[1] === address.coordinates[1]
		)
	) {
		throw new ApiError(httpStatus.BAD_REQUEST, "Coordinates already saved");
	}

	rider.savedAddresses.push({
		title,
		address: address as TAddress,
	});
	await rider.save();
};

const getAllSavedAddresses = async (
	userId: Types.ObjectId
): Promise<{ savedAddresses: SaveAddressDto[] }> => {
	// Find the user by ID
	const rider = await getRider({ user: userId });

	if (!rider) {
		throw new ApiError(httpStatus.NOT_FOUND, "Rider does not exist");
	}

	return { savedAddresses: rider.savedAddresses };
};

const getSavedAddressById = async (
	userId: Types.ObjectId,
	addressId: string
): Promise<{ savedAddress: SaveAddressDto }> => {
	// Find the user by ID
	const rider = await getRider({ user: userId });

	if (!rider) {
		throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
	}

	// Find the specific saved address
	const savedAddress = rider.savedAddresses.find(
		(loc) => loc._id?.toString() === addressId.toString()
	);

	if (!savedAddress) {
		throw new ApiError(
			httpStatus.NOT_FOUND,
			"The saved address does not exist"
		);
	}

	return { savedAddress };
};

const updateSavedAddressById = async (
	userId: Types.ObjectId,
	addressId: string,
	payload: SaveAddressDto
): Promise<{ success: boolean }> => {
	// Find the user by ID
	const rider = await getRider({ user: userId });

	if (!rider) {
		throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
	}

	// Find the specific saved address
	const savedAddress = rider.savedAddresses.find(
		(loc) => loc._id?.toString() === addressId.toString()
	);

	if (!savedAddress) {
		throw new ApiError(
			httpStatus.NOT_FOUND,
			"The saved address does not exist"
		);
	}

	savedAddress.title = payload.title;
	savedAddress.address = payload.address as TAddress;
	await rider.save();

	return { success: true };
};

// const addTrustedContact = async (
// 	userId: string,
// 	payload: TAddTrustedContact
// ): Promise<{ success: boolean }> => {
// 	const { phoneNumber } = payload;

// 	// Find the user by ID
// 	const user = await User.findById(userId);

// 	if (!user) {
// 		throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
// 	}

// 	if (user.phoneNumber === phoneNumber) {
// 		throw new ApiError(
// 			httpStatus.BAD_REQUEST,
// 			"You cannot add yourself as a trusted contact"
// 		);
// 	}

//     const rider = await Rider.findOne({user: userId});

//     if (!rider) {
//         throw new ApiError(httpStatus.NOT_FOUND, "Rider does not exist");
//     }

// 	if (rider.trustedContacts.includes(phoneNumber)) {
// 		throw new ApiError(
// 			httpStatus.BAD_REQUEST,
// 			"The user you are trying to add is already added"
// 		);
// 	}

// 	const expectedUser = await User.findOne({ phoneNumber });

// 	if (!expectedUser) {
// 		throw new ApiError(
// 			httpStatus.NOT_FOUND,
// 			"The user you are trying to add does not exist yet"
// 		);
// 	}

// 	if (!expectedUser.isVerified) {
// 		throw new ApiError(
// 			httpStatus.BAD_REQUEST,
// 			"The user you are trying to add is not verified yet"
// 		);
// 	}

// 	await user.updateOne({ $addToSet: { trustedContacts: phoneNumber } });

// 	return { success: true };
// };

const addTrustedContact = async (
	userId: Types.ObjectId,
	payload: AddTrustedContactDto
): Promise<{ success: boolean }> => {
	const { phoneNumber } = payload;

	// Find the user by ID
	const user = await UserInternalApi.getUser({ _id: userId });

	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
	}

	if (user.phoneNumber === phoneNumber) {
		throw new ApiError(
			httpStatus.BAD_REQUEST,
			"You cannot add yourself as a trusted contact"
		);
	}

	const rider = await getRider({ user: userId });

	if (!rider) {
		throw new ApiError(httpStatus.NOT_FOUND, "Rider does not exist");
	}

	if (rider.trustedContacts.includes(phoneNumber)) {
		throw new ApiError(
			httpStatus.BAD_REQUEST,
			"The user you are trying to add is already added"
		);
	}

	const expectedUser = await User.findOne({ phoneNumber });

	if (!expectedUser) {
		throw new ApiError(
			httpStatus.NOT_FOUND,
			"The user you are trying to add does not exist yet"
		);
	}

	if (!expectedUser.isVerified) {
		throw new ApiError(
			httpStatus.BAD_REQUEST,
			"The user you are trying to add is not verified yet"
		);
	}

	await user.updateOne({ $addToSet: { trustedContacts: phoneNumber } });

	return { success: true };
};

const getAllTrustedContacts = async (
	userId: Types.ObjectId
): Promise<{ trustedContacts: string[] }> => {
	// Find the user by ID
	const rider = await getRider({ user: userId });

	if (!rider) {
		throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
	}

	return { trustedContacts: rider.trustedContacts };
};

const recentRides = async (userId: Types.ObjectId) => {
	const recentRides = await RideRequest.find({
		userId: userId,
		status: {
			$in: [RideRequestStatus.COMPLETED],
		},
	})
		.sort({ createdAt: -1 })
		.limit(5);

	const formattedRides = recentRides.map((ride) => {
		return {
			rideId: ride._id,
			pickupAddress: ride.pickupAddress,
			dropoffAddress: ride.dropOffAddress,
			createdAt: ride.createdAt,
		};
	});

	return formattedRides;
};

export const RiderService = {
	onboardRider,
	saveAddress,
	getAllSavedAddresses,
	getSavedAddressById,
	updateSavedAddressById,
	addTrustedContact,
	getAllTrustedContacts,
	recentRides,
};

export const RiderInternalApi = {
	createRider,
};
