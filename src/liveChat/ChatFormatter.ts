import { MessageForFront } from './Models/MessageForFront';
import { MessageForChat } from './Models/MessageForChat';
import { MessageForFrontConversation } from './Models/MessageForFrontConversation';

export class ChatFormatter {
    static async makeChatForRoom(content: string, userName: string) {
        const now = new Date();
        const time = now.getTime();
        const chat: MessageForFront = {
            content: content,
            time: time,
            isMe: false,
            userName: userName,
            //userPhoto: user.avatar,
        };
        return chat;
    }

    static async makeChatForConversation(
        messageForChat: MessageForChat,
        userName: string,
    ) {
        const now = new Date();
        const time = now.getTime();
        const chat: MessageForFrontConversation = {
            content: messageForChat.content,
            time: time,
            userName: userName,
            conversationId: messageForChat.conversationId,
        };
        return chat;
    }
}
