import ApiResponse from "../../utils/ApiResponse";
import asyncHandler from "../../utils/asyncHandler";
import { TSaveAddressDto, TSaveAddressQuery } from "./user.dto";
import { UserServices } from "./user.service";
import httpStatus from "http-status";


const setFcmToken = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { fcmToken } = req.body;


    await UserServices.setFcmToken(userId, fcmToken);
    res.status(httpStatus.OK).json(
        new ApiResponse({
            statusCode: httpStatus.OK,
            message: "FCM token set successfully",
            data: null,
        }),
    );
});

const saveAddress = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    const payload = req.body;
    const query = req.query as unknown as TSaveAddressQuery;

    await UserServices.saveAddress(userId, payload, query)

    res.status(httpStatus.OK).json(
        new ApiResponse({
            statusCode: httpStatus.OK,
            message: "Address saved successfully",
            data: null,
        }),
    );
})

const getSavedAddress = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    const query = req.query as unknown as TSaveAddressQuery;

    const savedAddress = await UserServices.getSavedAddress(userId, query)

    res.status(httpStatus.OK).json(
        new ApiResponse({
            statusCode: httpStatus.OK,
            message: "Address retrieved successfully",
            data: savedAddress,
        }),
    );
})

const setCurrentLocation = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    const payload = req.body;

    await UserServices.setCurrentLocation(userId, payload)

    res.status(httpStatus.OK).json(
        new ApiResponse({
            statusCode: httpStatus.OK,
            message: "Current location set successfully",
            data: null,
        }),
    );
})

const uploadFiles = asyncHandler(async(req, res) => {
    const {urls} = req.body;

    res.status(httpStatus.OK).json(
        new ApiResponse({
            statusCode: httpStatus.OK,
            message: "Files uploaded successfully",
            data: urls,
        }),
    );
    
})

const updateProfile = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    const payload = req.body;

    await UserServices.updateProfile(userId, payload)

    res.status(httpStatus.OK).json(
        new ApiResponse({
            statusCode: httpStatus.OK,
            message: "Profile updated successfully",
            data: null,
        }),
    );
})

const getMyProfile = asyncHandler(async(req, res) => {
    const userId = req.user._id;

    const profile = await UserServices.getMyProfile(userId)

    res.status(httpStatus.OK).json(
        new ApiResponse({
            statusCode: httpStatus.OK,
            message: "Profile retrieved successfully",
            data: profile,
        }),
    );
})

const getBalance = asyncHandler(async(req, res) => {
    const userId = req.user._id;

    const balance = await UserServices.getBalance(userId)

    res.status(httpStatus.OK).json(
        new ApiResponse({
            statusCode: httpStatus.OK,
            message: "Balance retrieved successfully",
            data: balance,
        }),
    );
})

export const UserControllers = {
    setFcmToken,
    saveAddress,
    getSavedAddress,
    setCurrentLocation,
    uploadFiles,
    updateProfile,
    getMyProfile,
    getBalance
}