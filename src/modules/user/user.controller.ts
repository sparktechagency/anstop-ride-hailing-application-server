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

export const UserControllers = {
    setFcmToken,
    saveAddress,
    getSavedAddress
}