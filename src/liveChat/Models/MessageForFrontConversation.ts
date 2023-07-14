import { User } from "../../schemas/user.schema";

export interface MessageForFrontConversation {
    content: string;
    from: any;
    date: number;
    conversationId: string;
}

