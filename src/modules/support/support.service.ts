import { TPaginateOptions } from "../../types/paginate";
import { TCreateSupportDto } from "./support.dto";
import { Support } from "./support.model";
import { Types } from "mongoose";

const createSupportMessage = async (userId: Types.ObjectId,supportData: TCreateSupportDto) => {
    await Support.create({userId, ...supportData});
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


export const SupportService = {
    createSupportMessage,
    getMySupportMessages,
    getAllSupportMessages
}