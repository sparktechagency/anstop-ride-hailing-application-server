import { Model, Types } from "mongoose";
import { TPaginateOptions, TPaginateResult } from "../../types/paginate";

export interface INotification {
    _id?: Types.ObjectId;
    userId: Types.ObjectId;
    icon: string;
    title: string;
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface INotificationModel extends Model<INotification> {
    paginate: (
        filter: object,
        options: TPaginateOptions
    ) => Promise<TPaginateResult<INotification>>;
}