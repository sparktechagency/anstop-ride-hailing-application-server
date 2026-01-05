import ApiError from "../../utils/ApiError";
import asyncHandler from "../../utils/asyncHandler";
import httpStatus from "http-status";
import { RiderService } from "./rider.service";
import ApiResponse from "../../utils/ApiResponse";

const onboardRider = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	if (!req.user && !_id) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated");
	}
	const payload = req.body;
	await RiderService.onboardRider(_id, payload);
	res.status(httpStatus.CREATED).json(
		new ApiResponse({
			statusCode: httpStatus.CREATED,
			message: "User is onboarded successfully",
			data: null,
		})
	);
});

const saveAddress = asyncHandler(async (req, res) => {
	const { _id: userId } = req.user;
	if (!req.user && !userId) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated");
	}
	const payload = req.body;
	await RiderService.saveAddress(userId, payload);
	res.status(httpStatus.OK).json(
		new ApiResponse({
			statusCode: httpStatus.OK,
			message: "Address saved successfully",
			data: null,
		})
	);
});

const getAllSavedAddresses = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	if (!req.user && !_id) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated");
	}
	const savedAddresses = await RiderService.getAllSavedAddresses(_id);
	res.status(httpStatus.OK).json(
		new ApiResponse({
			statusCode: httpStatus.OK,
			message: "Saved addresses retrieved successfully",
			data: savedAddresses,
		})
	);
});

const getSavedAddressById = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	if (!req.user && !_id) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated");
	}
	const { addressId } = req.params;

	if (!addressId) {
		throw new ApiError(httpStatus.BAD_REQUEST, "Address ID is required");
	}

	const savedAddress = await RiderService.getSavedAddressById(_id, addressId);

	res.status(httpStatus.OK).json(
		new ApiResponse({
			statusCode: httpStatus.OK,
			message: "Saved address retrieved successfully",
			data: savedAddress,
		})
	);
});

const updateSavedAddressById = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	if (!req.user && !_id) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated");
	}
	const { addressId } = req.params;

	if (!addressId) {
		throw new ApiError(httpStatus.BAD_REQUEST, "Address ID is required");
	}

	const payload = req.body;
	await RiderService.updateSavedAddressById(_id, addressId, payload);
	res.status(httpStatus.OK).json(
		new ApiResponse({
			statusCode: httpStatus.OK,
			message: "Saved address updated successfully",
			data: null,
		})
	);
});

const addTrustedContact = asyncHandler(async (req, res) => {
	const { _id: userId } = req.user;
	if (!req.user && !userId) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated");
	}
	const payload = req.body;
	await RiderService.addTrustedContact(userId, payload);
	res.status(httpStatus.OK).json(
		new ApiResponse({
			statusCode: httpStatus.OK,
			message: "Trusted contact added successfully",
			data: null,
		})
	);
});

const getAllTrustedContacts = asyncHandler(async (req, res) => {
	const { _id: userId } = req.user;
	if (!req.user && !userId) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated");
	}
	const trustedContacts = await RiderService.getAllTrustedContacts(userId);
	res.status(httpStatus.OK).json(
		new ApiResponse({
			statusCode: httpStatus.OK,
			message: "Trusted contacts retrieved successfully",
			data: trustedContacts,
		})
	);
});

const recentRides = asyncHandler(async (req, res) => {
	const { _id: userId } = req.user;
	if (!req.user && !userId) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated");
	}
	const recentRides = await RiderService.recentRides(userId);
	res.status(httpStatus.OK).json(
		new ApiResponse({
			statusCode: httpStatus.OK,
			message: "Recent rides retrieved successfully",
			data: recentRides,
		})
	);
});

export const RiderController = {
	onboardRider,
	saveAddress,
	getAllSavedAddresses,
	getSavedAddressById,
	updateSavedAddressById,
	addTrustedContact,
	getAllTrustedContacts,
	recentRides,
};
