import {User} from "../../schemas/user.schema";
import {Message} from "../../schemas/messages.schema";
import {MessageForFrontConversation} from "../../liveChat/Models/MessageForFrontConversation";

export class ConversationToFront {
    _id?: string;
    users?: User[];
    messages?: MessageForFrontConversation;
}