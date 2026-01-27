import ApiResponse from "../../utils/ApiResponse";
import asyncHandler from "../../utils/asyncHandler";
import { AdminService } from "./admin.service";
import httpStatus from "http-status";



const dashboardStats = asyncHandler(async (req, res) => {
    const stats = await AdminService.dashboardStats();
    res.status(httpStatus.OK).json(new ApiResponse(
        {
            statusCode: httpStatus.OK,
            message: "Dashboard stats fetched successfully",
            data: stats
        }
    ));
});

const earningsChart = asyncHandler(async (req, res) => {

    const query = req.validatedData.query;

    const stats = await AdminService.earningsChart(query);
    res.status(httpStatus.OK).json(new ApiResponse(
        {
            statusCode: httpStatus.OK,
            message: "Dashboard stats fetched successfully",
            data: stats
        }
    ));
});

const earningsStats = asyncHandler(async (req, res) => {
    const stats = await AdminService.earningStats();
    res.status(httpStatus.OK).json(new ApiResponse(
        {
            statusCode: httpStatus.OK,
            message: "Dashboard stats fetched successfully",
            data: stats
        }
    ));
});

export const AdminController = {
    dashboardStats,
    earningsStats,
    earningsChart
}
