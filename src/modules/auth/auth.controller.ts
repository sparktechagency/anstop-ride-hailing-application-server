import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import asyncHandler from "../../utils/asyncHandler";
import { authService } from "./auth.service";
import httpStatus from "http-status";

const createUser = asyncHandler(async (req, res) => {
    const userData = req.body;

    const result = await authService.registerUserIntoDB(userData);

    // if user is not created then throw error
    if (!result) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "User registration failed");
    }

    res.status(httpStatus.CREATED).json(
        new ApiResponse({
            statusCode: httpStatus.CREATED,
            message: result.message ||"User is created successfully",
            data: {shouldOnboard: result.shouldOnboard},
        }),
    );
});

const verifyOTP = asyncHandler(async (req, res) => {
    const payload= req.body;

    const result = await authService.verifyOTP(payload);

    if (!result) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to verify OTP");
    }

    res.status(httpStatus.OK).json(
        new ApiResponse({
            statusCode: httpStatus.OK,
            message: "OTP verified successfully",
            data: result,
        }),
    );
});

const resendOTP = asyncHandler(async (req, res) => {
    const { phoneNumber } = req.body;

    await authService.resendOTP(phoneNumber);

    res.status(httpStatus.OK).json(
        new ApiResponse({
            statusCode: httpStatus.OK,
            message: "OTP resent successfully",
            data: null,
        }),
    );
});


export const AuthControllers = {
    createUser,
    verifyOTP,
    resendOTP,
};
