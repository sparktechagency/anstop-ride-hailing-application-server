import { model, Schema } from "mongoose";
import { ISupportModel, TSupport } from "./support.interface";
import { SUPPORT_TYPE } from "./support.constant";
import paginate from "../../utils/paginate";

const supportScheam = new Schema<TSupport, ISupportModel>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        subject: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: Object.values(SUPPORT_TYPE),
            default: SUPPORT_TYPE.OPEN
        }
    },
    {
        timestamps: true
    }
)

supportScheam.plugin(paginate);

export const Support = model<TSupport, ISupportModel>("Support", supportScheam);