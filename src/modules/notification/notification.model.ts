import { model, Schema } from "mongoose";
import { INotification, INotificationModel } from "./notification.interface";
import paginate from "../../utils/paginate";

const notificationSchema = new Schema<INotification, INotificationModel>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        icon: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

notificationSchema.plugin(paginate);

export const Notification = model<INotification, INotificationModel>("Notification", notificationSchema);