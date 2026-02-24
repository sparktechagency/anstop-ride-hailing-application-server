import { Socket } from "socket.io";
import { User } from "../../../modules/user/user.model";
import SocketError from "../../utils/socketError";
import { UpdateLocationDto } from "./location.dto";

export const setCurrentLocation = async (socket: Socket, data: UpdateLocationDto) => {
    const userId = socket.payload._id
    const user = await User.findById(userId);
    if (!user) {
        throw new SocketError("update-location", "User not found", 404);
    }

    user.location.coordinates = [data.longitude, data.latitude];
    user.locationName = data.locationName;
    await user.save();

    if (user.isEngaged && user.engagedRideId) {
        const engagedUser = await User.findOne({ engagedRideId: user.engagedRideId, _id: { $ne: userId } });
        console.log("engagedUser", engagedUser);
        if (!engagedUser) {
            throw new SocketError("update-location", "Engaged user not found", 404);
        }
        socket.to(engagedUser._id.toString()).emit("update-location", data);
    }
}