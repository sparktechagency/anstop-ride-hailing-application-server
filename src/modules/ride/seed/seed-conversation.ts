import { Types } from "mongoose"
import { conversationPrivateService } from "../../messaging/conversation/conversation.service"

const seedConversation = async () => {
    await conversationPrivateService.createConversationBetweenDriverAndRider({
        driverId: "6964836a712b5d292425a974",
        riderId: "6964855a31e70d5a42c2ebec",
        rideId: new Types.ObjectId("6965d5ee292113b158d49a74")
    })
}

export default seedConversation;