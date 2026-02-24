import { z } from "zod";
import { objectIdSchema } from "../shared/shared.validation";
import { MessageSocketValidation } from "./modules/messaging/message/message.validation";
import { MessageSocket } from "./modules/messaging/message/message.socket";
import { RideSocketValidation } from "./modules/ride/ride.validation";
import { ConversationSocketValidation } from "./modules/messaging/conversation/conversation.validation";
import { ConversationSocket } from "./modules/messaging/conversation/conversation.socket";


import { Socket } from "socket.io";
import { setCurrentLocation } from "./modules/location/location.socket";
import { RideSocket } from "./modules/ride/ride.socket";


export interface SocketEventConfig {
    schema: z.ZodTypeAny;
    handler: (socket: Socket, data: any) => Promise<any> | void;
}

export const eventRegistry: Record<string, SocketEventConfig> = {

    // message-event
    "send-new-message": {
        schema: MessageSocketValidation.sendMessageSchema,
        handler: MessageSocket.sendMessageEventHandler,
    },

    // ride-event
    // "new-bid": {
    //     schema: RideSocketValidation.newBidSchema,
    //     handler: RideSocket.newBidEventHandler,
    // },
    // "accept-bid": {
    //     schema: RideSocketValidation.acceptBidSchema,
    //     handler: RideSocket.acceptBidEventHandler,
    // },
    // "cancel-bid": {
    //     schema: RideSocketValidation.cancelBidSchema,
    //     handler: RideSocket.cancelBidEventHandler,
    // },

    "new-offer": {
        schema: RideSocketValidation.newOfferSchema,
        handler: RideSocket.newOfferEventHandler,
    },
    "accept-ride": {
        schema: RideSocketValidation.acceptRideSchema,
        handler: RideSocket.rideAcceptedEventHandler,
    },
    "pickup-rider": {
        schema: RideSocketValidation.pickupRiderSchema,
        handler: RideSocket.pickupRiderEventHandler,
    },
    "drop-off-rider": {
        schema: RideSocketValidation.dropOffRiderSchema,
        handler: RideSocket.dropOffRiderEventHandler,
    },
    "cancel-offer": {
        schema: RideSocketValidation.cancelOfferSchema,
        handler: RideSocket.cancelOfferEventHandler,
    },
    "cancel-ride": {
        schema: RideSocketValidation.cancelRideSchema,
        handler: RideSocket.cancelRideEventHandler,
    },

    // conversation-event
    "join-conversation": {
        schema: ConversationSocketValidation.joinConversationSchema,
        handler: ConversationSocket.joinConversationEventHandler,
    },

    // location
    "update-location": {
        schema: z.object({
            latitude: z.number(),
            longitude: z.number(),
            locationName: z.string(),
        }),
        handler: setCurrentLocation
    },
};