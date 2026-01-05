import { Server, Socket } from "socket.io";
import { GetUserByIdAndRole } from "../utils/GetUserByIdAndRole";
import { Driver } from "../modules/driver/driver.model";
import { RideRequest } from "../modules/rideRequest/rideRequest.model";
import { RideRequestStatus } from "../modules/rideRequest/rideRequest.interface";

export const updateLocation = (io: Server, socket: Socket) => {
    socket.on("driver:updated-location", async(data) => {
        console.log("updated-location", data);
        
        await Driver.findByIdAndUpdate(data.driverId, {
            location: {
                type: "Point",
                coordinates: data.coordinates,
            },
        }, {
            new: true
        })

        const driverLocation = {
            coordinates: data.coordinates
        }
        
        socket.to(data.roomId).emit("driver:updated-location", driverLocation);
    })
    socket.on("ride:finished", async(data) => {
        console.log("ride:finished", data);

        await RideRequest.findByIdAndUpdate(data.requestId, {
            status: RideRequestStatus.COMPLETED
        })

        io.to(data.roomId).emit("ride:finished", data);
    })

    socket.on("ride:user-cancelled", async(data) => {
        console.log("ride:cancelled", data);

        await RideRequest.findByIdAndUpdate(data.requestId, {
            status: RideRequestStatus.USER_CANCELED
        })

        socket.to(data.roomId).emit("ride:user-cancelled", data);
    })

    socket.on("ride:driver-cancelled", async(data) => {
        console.log("ride:driver-cancelled", data);

        await RideRequest.findByIdAndUpdate(data.requestId, {
            status: RideRequestStatus.DRIVER_CANCELED
        })

        socket.to(data.roomId).emit("ride:driver-cancelled", data);
    })


    // messaging between driver and user

    socket.on("ride:message", (data) => {
        socket.to(data.roomId).emit("ride:message", data.message);
    });
}