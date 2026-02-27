import { TPaginateOptions } from "../../types/paginate";
import ApiError from "../../utils/ApiError";
import { TCreateSupportDto } from "./support.dto";
import { Support } from "./support.model";
import { Types } from "mongoose";
import httpStatus from "http-status";
import { SUPPORT_TYPE } from "./support.constant";

const createSupportMessage = async (userId: Types.ObjectId, supportData: TCreateSupportDto) => {
    await Support.create({ userId, ...supportData });
    return true;
}

const getMySupportMessages = async (filter: {
    userId: Types.ObjectId
}, options: TPaginateOptions) => {

    options.select = "subject message status createdAt";

    const supportMessages = await Support.paginate(filter, options)
    return supportMessages;
}

const getAllSupportMessages = async (filter: any, options: TPaginateOptions) => {

    options.select = "userId subject message status createdAt";
    options.populate = {
        path: "userId",
        select: "name email profilePicture"
    }

    const supportMessages = await Support.paginate(filter, options);
    return supportMessages;
}

const updateSupportMessage = async (id: Types.ObjectId) => {
    const supportMessage = await Support.findById(id);
    if (!supportMessage) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Support message not found");
    }
    supportMessage.status = SUPPORT_TYPE.CLOSED;
    await supportMessage.save();
    return supportMessage;
}

export const SupportService = {
    createSupportMessage,
    getMySupportMessages,
    getAllSupportMessages,
    updateSupportMessage
}